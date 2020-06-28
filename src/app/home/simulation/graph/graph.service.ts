import {Injectable, NgZone} from '@angular/core';
import * as THREE from 'three';
import {MeshLine, MeshLineMaterial} from '../../../utils/THREE.MeshLine'
import panzoom from './drag.js';
import {SimLibInterfaceService} from "../../../core/services";
import {Panel} from './Panel';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  public initiated = false;
  private domElement;

  private camera;
  private renderer;
  private scene;

  private frameId;

  private time = 0;
  private clock = new THREE.Clock();
  private globalUniforms = {
    u_time: {type: 'f', value: 0},
    u_resolution: {type: 'vec2', value: new THREE.Vector2(0, 0)}
  }

  private panels: Panel[] = [];

  constructor(private simLibInterfaceService: SimLibInterfaceService,
              private ngZone: NgZone) {
  }

  resize() {
    let width = this.domElement.clientWidth;
    let height = this.domElement.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.globalUniforms.u_resolution.value = new THREE.Vector2(width, height);
  }

  init(domElement: HTMLElement) {
    this.domElement = domElement;

    if(this.initiated) {
      domElement.appendChild(this.renderer.domElement);
      this.resize();
      this.render();
      panzoom(this.camera, domElement);
    } else {
      let width = domElement.clientWidth;
      let height = domElement.clientHeight;

      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({alpha: true});
      this.renderer.sortObjects = true;
      this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
      domElement.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.z = 5;

      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 0, 10);
      light.target.position.set(0, 0, 0);
      this.scene.add(light);
      this.scene.add(light.target);

      this.initiateObjects();
      this.resize();
      panzoom(this.camera, domElement);

      // We have to run this outside angular zones,
      // because it could trigger heavy changeDetection cycles.
      this.ngZone.runOutsideAngular(() => {
        if (document.readyState !== 'loading') {
          this.render();
        } else {
          window.addEventListener('DOMContentLoaded', this.render.bind(this));
        }
        window.addEventListener('resize', this.resize.bind(this));
      });

      this.initiated = true;
    }
  }

  initiateObjects() {
    const panelInstantiation: any = [
      {
        name: "Instruction Decoder",
        position: {x: 0, y: 0, z: 0},
        size: {width: 0.95, height: 1.2},
        ports: [
          {
            name: "Opcode",
            position: {x: 0.05, y: 1},
            valueSubject: "uut__DOT__dbg_insn_opcode__subject",
            valueType: "hex"
          },
          {
            name: "Instruction",
            position: {x: 0.5, y: 1},
            valueSubject: "uut__DOT__dbg_ascii_instr__subject",
            valueType: "string"
          },
          {
            name: "RD",
            position: {x: 0.5, y: 0.8},
            valueSubject: "uut__DOT__decoded_rd__subject",
            valueType: "hex"
          },
          {
            name: "Immediate",
            position: {x: 0.5, y: 0.6},
            valueSubject: "uut__DOT__decoded_imm__subject",
            valueType: "hex"
          },
          {
            name: "RS1",
            position: {x: 0.5, y: 0.4},
            valueSubject: "uut__DOT__decoded_rs1__subject",
            valueType: "hex"
          },
          {
            name: "RS2",
            position: {x: 0.5, y: 0.2},
            valueSubject: "uut__DOT__decoded_rs2__subject",
            valueType: "hex"
          }
        ]
      },
      {
        name: "Arithmetic Logic Unit",
        position: {x: 2, y: 0.5, z: 0},
        size: {width: 0.95, height: 1.2},
        ports: [
          {
            name: "Instruction",
            position: {x: 0.05, y: 1},
            valueSubject: "uut__DOT__dbg_ascii_instr__subject",
            valueType: "string"
          },
        ]
      }
    ]

    for (const panel of panelInstantiation) {
      let _panel = new Panel(
        this.scene,
        panel.position.x,
        panel.position.y,
        panel.position.z,
        panel.name,
        panel.size.width,
        panel.size.height,
        this.globalUniforms,
        this.simLibInterfaceService);

      for (const port of panel.ports) {
        _panel.addPort(port.position.x, port.position.y, port.name, undefined, port.valueType, port.valueSubject)
      }

      this.panels.push(_panel);
    }

    const links = [
      {
        from: {
          panel: panelInstantiation[0],
          port: panelInstantiation[0].ports[1]
        },
        to: {
          panel: panelInstantiation[1],
          port: panelInstantiation[1].ports[0]
        }
      }
    ]

    for (const link of links) {
      this.addLink(
        link.from.panel.position.x + link.from.port.position.x + 0.4,
        link.from.panel.position.y + link.from.port.position.y - 0.04,
        link.to.panel.position.x + link.to.port.position.x,
        link.to.panel.position.y + link.to.port.position.y - 0.04)
    }
  }

  addLink(x0, y0, x1, y1) {
    const loader = new THREE.TextureLoader();
    let strokeTexture: THREE.Texture;
    loader.load('assets/Arrow.png', function (texture) {
      strokeTexture = texture;
      strokeTexture.wrapS = strokeTexture.wrapT = THREE.RepeatWrapping;
      init();
    });

    const init = () => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x0 - 0.05, y0, 0),
        new THREE.Vector3(x0 + (x1 - x0) / 2 - 0.2, y0 + 0.05, 0),
        new THREE.Vector3(x0 + (x1 - x0) / 2 + 0.2, y1 - 0.05, 0),
        new THREE.Vector3(x1 + 0.05, y1, 0)], false, 'chordal');

      const points = curve.getPoints(50);

      let length = 0;
      for (let i = 1; i < points.length; i++) {
        length += Math.sqrt(Math.pow((points[i].y - points[i - 1].y), 2) + Math.pow((points[i].x - points[i - 1].x), 2));
      }

      let lineBasicMaterial = new MeshLineMaterial({
        // color: new THREE.Color(readStyleProperty('grey1')),
        lineWidth: 0.08,
        sizeAttenuation: true,
        useMap: true,
        map: strokeTexture,
        repeat: new THREE.Vector2( length * 10,1 ),
        offset: new THREE.Vector2(0.5 ,0 ),
      });

      const offset = () => {
        setTimeout(() => {
          lineBasicMaterial.offset.add(new THREE.Vector2(0.05 ,0 ));
          offset();
        }, 10);
      }

      offset();

      let line = new MeshLine()
      const geometry = new THREE.Geometry();
      for (const point of points) {
        geometry.vertices.push(point);
      }

      line.setGeometry(geometry, function (p) {
        return 1 - (Math.sin(p * Math.PI) / 2.5);
      });

      let lineMesh = new THREE.Mesh(line.geometry, lineBasicMaterial);
      lineMesh.renderOrder = 1;
      this.scene.add(lineMesh);
    }
  }

  render() {
    this.frameId = requestAnimationFrame(this.render.bind(this));

    // update time
    this.time += this.clock.getDelta();
    this.globalUniforms.u_time.value = this.time;

    this.renderer.render(this.scene, this.camera);
  }

  stopRender() {
    if(this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
