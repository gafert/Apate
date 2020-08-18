import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from '../../../utils/THREE.MeshLine';
import panzoom from '../../../utils/drag.js';
import { Panel } from './Panel';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';
import links from './links.yml';
import panels from './panels.yml';
import { easing, tween } from 'popmotion';
import { readStyleProperty } from '../../../utils/helper';
import { loadGIF, parseGIF } from './gifparser';
import { MathUtils } from 'three';
import floorPowerOfTwo = MathUtils.floorPowerOfTwo;

@Injectable()
export class GraphService {
  public initiated = false;
  private domElement;

  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  private frameId;

  private time = 0;
  private clock = new THREE.Clock();
  private globalUniforms = {
    u_time: { type: 'f', value: 0 },
    u_resolution: { type: 'vec2', value: new THREE.Vector2(0, 0) }
  };

  private panels: Panel[] = [];

  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];

  runInRenderLoop(func: (time: number, deltaTime: number) => void): void {
    this.renderLoopFunctions.push(func);
  }

  constructor(private ngZone: NgZone, private simLibInterfaceService: SimLibInterfaceService) {
    process.on('exit', () => {
      console.log('Exit GraphService');
      this.stopRender();
      this.scene.dispose();
      this.renderer.dispose();
      this.camera = null;
      this.scene = null;
      this.clock = null;
    });

    // this.runInRenderLoop((time, deltaTime) => {
    //   this.panels.forEach((panel, index) => {
    //     panel.changeBorderColor(new THREE.Color(Math.sin(time + index), Math.sin(time * 2.3 + index), Math.sin(time * 5.2 + index)))
    //   });
    // })
  }

  resize() {
    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.globalUniforms.u_resolution.value = new THREE.Vector2(width, height);
  }

  init(domElement: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
      this.domElement = domElement;
      if (this.initiated) {
        domElement.appendChild(this.renderer.domElement);
        this.resize();
        this.render();
        panzoom(this.camera, domElement);
      } else {
        const width = domElement.clientWidth;
        const height = domElement.clientHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(2);
        domElement.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

        this.initiateObjects();
        this.resize();
        panzoom(this.camera, domElement);

        if (document.readyState !== 'loading') {
          this.render();
        } else {
          window.addEventListener('DOMContentLoaded', this.render.bind(this));
        }
        window.addEventListener('resize', this.resize.bind(this));

        this.initiated = true;
      }
    });
  }

  initiateObjects() {

    for (const panel of panels) {
      const _panel = new Panel(
        this.scene,
        panel.position.x,
        panel.position.y,
        panel.position.z,
        panel.name,
        panel.size.width,
        panel.size.height,
        this.globalUniforms,
        this.simLibInterfaceService
      );

      for (const port of panel.ports) {
        _panel.addPort(port.position.x, panel.size.height - port.position.y - 0.2, port.name, undefined, port.valueType, port.valueSubject);
      }

      if (panel.icons)
        for (const icon of panel.icons) {
          _panel.addIcon(icon.position.x, panel.size.height - icon.position.y - 0.2, icon.name, icon.compare, icon.valueSubject);
        }

      this.panels.push(_panel);
    }

    const loadCallbacks = [];
    for (const link of links) {
      this.addLink(panels, link, (init) => {
        loadCallbacks.push(init);
      });
    }

    const video = document.createElement('video');
    video.src = 'assets/Pfeil.mp4';
    video.loop = true;
    video.autoplay = true;
    video.addEventListener('loadeddata', function() {
      console.log('loadeddata');
      video.play();
      console.log(video);
      loadCallbacks.forEach((init) => init(video));
    });

    // loadGIF('assets/pfeile.gif', (times, cnt, frames) => {
    //   const w = floorPowerOfTwo(frames[0].width)
    //   const h = floorPowerOfTwo(frames[0].height)
    //   const gif = { times: times, cnt: cnt, frames: frames, height: h, width: w };
    //   loadCallbacks.forEach((init) => init(gif))
    // });
  }


  addLink(panels, link, loadCallback) {
    const fromPanel = panels.filter((e) => e.id === link.from.panel)[0];
    const fromPort = fromPanel.ports.filter((e) => e.id === link.from.port)[0];
    const toPanel = panels.filter((e) => e.id === link.to.panel)[0];
    const toPort = toPanel.ports.filter((e) => e.id === link.to.port)[0];

    const x0 = fromPanel.position.x + fromPort.position.x + 0.4;
    const y0 = fromPanel.position.y + fromPanel.size.height - fromPort.position.y - 0.25;
    const x1 = toPanel.position.x + toPort.position.x;
    const y1 = toPanel.position.y + toPanel.size.height - toPort.position.y - 0.25;

    const init = (video: HTMLVideoElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      const strokeTexture = new THREE.Texture(canvas);
      strokeTexture.wrapS = THREE.RepeatWrapping;
      strokeTexture.wrapT = THREE.RepeatWrapping;

      const prepoints = [
        new THREE.Vector3(x0 - 0.05, y0, fromPanel.position.z),
        //new THREE.Vector3(Math.max(x0 + (x1 - x0) / 2 - 0.2, x0 + 0.2), y0 < y1 ? Math.min(y0 + 0.05, y1) : Math.max(y0 - 0.05, y1), 0),
        //new THREE.Vector3(Math.min(x0 + (x1 - x0) / 2 + 0.2, x1 - 0.2), y0 < y1 ? Math.max(y1 - 0.05, y0) : Math.min(y1 + 0.05, y0), 0),
        new THREE.Vector3(Math.max(x0 + (x1 - x0) / 2 - 0.2, x0 + 0.2), y0 < y1 ? Math.min(y0, y1) : Math.max(y0, y1), fromPanel.position.z),
        new THREE.Vector3(Math.max(x0 + (x1 - x0) / 2 - 0.2, x0 + 0.2), (y0 + y1) / 2, (fromPanel.position.z + toPanel.position.z) / 2),
        new THREE.Vector3(Math.min(x0 + (x1 - x0) / 2 + 0.2, x1 - 0.2), (y0 + y1) / 2, (fromPanel.position.z + toPanel.position.z) / 2),
        new THREE.Vector3(Math.min(x0 + (x1 - x0) / 2 + 0.2, x1 - 0.2), y0 < y1 ? Math.max(y1, y0) : Math.min(y1, y0), toPanel.position.z),
        new THREE.Vector3(x1 + 0.05, y1, toPanel.position.z)
      ];

      const curve = new THREE.CatmullRomCurve3(
        prepoints,
        false,
        'catmullrom',
        0.000000001
      );

      const points = curve.getSpacedPoints(500);

      let length = 0;
      for (let i = 1; i < points.length; i++) {
        length += Math.sqrt(Math.pow(points[i].y - points[i - 1].y, 2) + Math.pow(points[i].x - points[i - 1].x, 2));
      }

      const lineBasicMaterial = new MeshLineMaterial({
        // color: new THREE.Color(readStyleProperty('grey1')),
        lineWidth: 0.08,
        sizeAttenuation: true,
        opacity: 0.1,
        transparent: true,
        useMap: true,
        map: strokeTexture,
        repeat: new THREE.Vector2(length * 2000 / video.videoWidth, 1)
        //offset: new THREE.Vector2(0.5, 0)
      });

      if (link.active) {
        this.simLibInterfaceService.bindings[toPort.valueSubject].subscribe(() => {
          if (link.active(this.simLibInterfaceService.bindings)) {
            tween({
              from: lineBasicMaterial.opacity,
              to: 1,
              ease: easing.easeOut,
              duration: 500
            }).start((v) => lineBasicMaterial.opacity = v);
            tween({
              from: readStyleProperty('accent'),
              to: '#ffffff',
              ease: easing.easeOut,
              duration: 40000
            }).start((v) => lineBasicMaterial.color = new THREE.Color(v));
          } else {
            tween({
              from: lineBasicMaterial.opacity,
              to: 0.1,
              ease: easing.easeOut,
              duration: 500
            }).start((v) => lineBasicMaterial.opacity = v);
          }
        });
      }

      // let frameIndex = 0;
      // let previouseFrameIndex = 0;
      // let lastTime = 0;
      this.runInRenderLoop((time, deltaTime) => {
        // // lineBasicMaterial.offset.add(new THREE.Vector2(3 * deltaTime, 0));
        // if(time - lastTime > gif.times[previouseFrameIndex] * 0.001 ) {
        //   lastTime = time;
        //   previouseFrameIndex = frameIndex;
        //   frameIndex++;
        //   if (frameIndex >= gif.frames.length) {
        //     frameIndex = 0;
        //     context.clearRect(0, 0, gif.width, gif.height)
        //     strokeTexture.needsUpdate = true
        //   }
        //   const frame = gif.frames[frameIndex];
        //   //console.log( this.gif.frames, frameIndex, frame);
        //   context.drawImage(frame, 0, 0, gif.width, gif.height);
        //   strokeTexture.needsUpdate = true;
        // }
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        strokeTexture.needsUpdate = true;
      });

      const line = new MeshLine();
      const geometry = new THREE.Geometry();
      for (const point of points) {
        geometry.vertices.push(point);
      }

      line.setGeometry(geometry, function(p) {
        return 1 - Math.sin(p * Math.PI) / 2.5;
      });

      const lineMesh = new THREE.Mesh(line.geometry, lineBasicMaterial);
      lineMesh.renderOrder = 0;
      this.scene.add(lineMesh);
    };

    loadCallback(init);

    // const loader = new THREE.TextureLoader();
    // loader.load('assets/Arrow.png', function(texture) {
    //   strokeTexture = texture;
    //   strokeTexture.wrapS = strokeTexture.wrapT = THREE.RepeatWrapping;
    //   init();
    // });
  }

  render() {
    this.ngZone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.render.bind(this));
      // update time
      const deltaTime = this.clock.getDelta();
      this.time += deltaTime;
      for (const func of this.renderLoopFunctions) {
        func(this.time, deltaTime);
      }
      this.globalUniforms.u_time.value = this.time;
      this.renderer.render(this.scene, this.camera);
    });
  }

  stopRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
