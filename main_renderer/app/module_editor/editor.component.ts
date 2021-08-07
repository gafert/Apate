import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {NgZone} from '@angular/core';
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  Light,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  LineSegments,
  LineBasicMaterial,
  WireframeGeometry,
  Vector3,
  Color,
} from 'three';

import panzoom from '../services/graphServiceHelpers/panzoom.js';
import {fromEvent} from 'rxjs';
import {cumulativeOffset} from '../utils/helper';
import * as _ from "lodash";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { Mux } from './Mux.js';
import { GraphLine } from './Line.js';
import { MSDFFont } from 'app/services/graphServiceHelpers/msdf/MSDFFont.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild("graph") graphElement: ElementRef<HTMLElement>;

  public initiated = false;

  public update = {
    animations: true,
    highlightStageOnCPUChange: false,
    updateVisibilities: true,
    updateSignalTexts: true
  };

  // Canvas will fill this dom
  private renderDom;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private composer: EffectComposer;
  private outlinePass: OutlinePass;
  // Set by requestAnimationFrame to render next frame
  private frameId: number;
  private time = 0;
  private clock = new Clock();

  // Intersection related
  // centeredMouse is update once the mouse is moved, so set start to value which never could be to prevent
  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];
  private renderGroup; // Holds the meshes in js groups named according to svg names
  private globalUniforms = {
    time: {value: 0},
    resolution: {value: new Vector2(0, 0)}
  };
  // intersection on 0,0 before mouse is moved
  private centeredMouse = new Vector2(-10000, -10000);
  private mouse = new Vector2(-10000, -10000);


  // For zooming, needs to be disposed and restarted on new init
  private panZoomInstance;

  /** Offset of renderDom in window, used for mouse position */
  private offsetInWindow = {
    left: 0,
    top: 0
  }

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.init(this.graphElement.nativeElement);
  }

  /**
   * Setup scene inside domElement and start rendering
   * @param domElement Target of render. This function will add a canvas matching the size of the domElement.
   */
  public init(domElement: HTMLElement): Promise<unknown> {
    return new Promise<void>((resolve, reject) => {
      console.log('Initiating Graph...');
      this.ngZone.runOutsideAngular(() => {
        this.renderDom = domElement;
        if (this.initiated) {
          // Service already loaded scene, only set dom element again and start rendering
          this.renderDom.appendChild(this.renderer.domElement);
          this.offsetInWindow = cumulativeOffset(this.renderDom);
          this.resize();
          this.render();
          this.setRenderDomListeners(this.renderDom);
          // New render dom with new listeners, reset
          this.panZoomInstance.dispose();
          this.panZoomInstance = panzoom(this.camera, this.renderDom);
          resolve();
        } else {
          // Set initiated to true to not reload settings if init was called again by component using the service
          this.initiated = true;

          // Setup renderer
          this.scene = new Scene();
          this.renderer = new WebGLRenderer({alpha: true, antialias: true});
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.renderer.autoClear = false;


          this.renderDom.appendChild(this.renderer.domElement);

          // Setup camera
          this.camera = this.setupCamera(this.renderDom.clientWidth, this.renderDom.clientHeight);

          // const renderPass = new RenderPass(this.scene, this.camera);
          // this.fxaaPass = new ShaderPass(FXAAShader);
          // this.fxaaRenderer = new EffectComposer(this.renderer);
          // this.fxaaRenderer.addPass(renderPass);
          // this.fxaaRenderer.addPass(this.fxaaPass);

          this.composer = new EffectComposer( this.renderer );

          const renderPass = new RenderPass( this.scene, this.camera );
          this.composer.addPass( renderPass );

          this.outlinePass = new OutlinePass( new Vector2( this.renderDom.clientWidth, this.renderDom.clientHeight ), this.scene, this.camera );
          this.composer.addPass( this.outlinePass );

          // this.composer.addPass(new ShaderPass(FXAAShader));

          // Setup scene with light
          this.scene.add(...this.setupLights());

          this.addScene(this.scene);

          // Listeners on this specific dom element
          this.setRenderDomListeners(this.renderDom);

          fromEvent(window, 'resize').subscribe(() => {
            this.offsetInWindow = cumulativeOffset(this.renderDom);
            this.resize();
          })

          // Call first event because events fired only after resize
          this.offsetInWindow = cumulativeOffset(this.renderDom);
          this.resize();

          // Enable zooming
          this.panZoomInstance = panzoom(this.camera, this.renderDom);

          // Start rendering
          this.render();

          resolve();
        }
      });
    });
  }

  private addScene(scene) {
    const mesh = new Mesh(new BoxGeometry(1,1,1), new MeshNormalMaterial());
    mesh.position.set(20,20,0);
    scene.add(mesh);

    const mux1 = new Mux(2, "MUX", this.globalUniforms);
    mux1.position.set(0,0,0);
    scene.add(mux1.renderGroup);
    const mux2 = new Mux(10, "MUX", this.globalUniforms);
    mux2.position.set(4,2,0);
    scene.add(mux2.renderGroup);
    const line1 = new GraphLine(new Vector3().add(mux1.position).add(mux1.outPos), new Vector3().add(mux2.position).add(mux2.inPos[2]));
    scene.add(line1.renderGroup);


    const text = new MSDFFont("DasgyS ist ein Text der text hat");
    text.position.set(6,0,0);
    scene.add(text);


    /*const rect = new WireframeGeometry(text.geometry);
    const meshRect = new LineSegments(rect, new LineBasicMaterial({color: new Color(0xffffff)}));
    meshRect.position.set(6,0,0);
    meshRect.scale.multiplyScalar(12 / 42);

    scene.add(meshRect);*/

    setInterval(() => {
      mux1.setSelected(Math.floor(Math.random() * 2), true);
      mux2.setSelected(Math.floor(Math.random() * 10), true);
      mux1.setHighlight(Math.floor(Math.random() * 2));      
      mux2.setHighlight(Math.floor(Math.random() * 2));
    }, 1000);
  }































  private setRenderDomListeners(renderDom) {
    renderDom.addEventListener('mousemove', this.setLocalMouseVariables.bind(this), false);
    renderDom.addEventListener('mouseleave', this.setLocalMouseVariables.bind(this, true), false);
  }

  /**
   * Stop the rendering. Start again by calling init().
   */
  public stopRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  /**
   * Will be called every render function with time and delta time
   * @param func Callback to call every new render
   */
  public runInRenderLoop(func: (time: number, deltaTime: number) => void): void {
    this.renderLoopFunctions.push(func);
  }

  /**
   * Adds the main camera
   * @private
   */
  private setupCamera(width, height): PerspectiveCamera {
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000000);
    camera.position.z = 50;
    return camera;
  }

  /**
   * Adds lights.
   * @private
   */
  private setupLights(): Light[] {
    const color = 0xffffff;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(0, 0, 10);
    light.target.position.set(0, 0, 0);
    const ambientLight = new AmbientLight(0xcccccc, 0.2);

    return [light, ambientLight];
  }

  private setLocalMouseVariables(event, mouseLeftCanvas = false) {
    if (mouseLeftCanvas) {
      this.mouse.x = 10000;
      this.mouse.y = 10000;
      this.centeredMouse.x = 10000;
      this.centeredMouse.y = 10000;
      return;
    }

    event.preventDefault();
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    // Depends on where the dom is in relation to the other elements
    // Offset left because the dom does not start on the left border
    let c = event.clientX + this.offsetInWindow.left; // Put in window
    c = (c - (window.innerWidth - this.renderDom.clientWidth)) / this.renderDom.clientWidth;
    c = c * 2 - 1; // Make centered

    this.centeredMouse.x = c;
    // Offset top because the dom does not start on the edge, additional - offset top because there is a header over all simulation elements
    this.centeredMouse.y = -((event.clientY - this.offsetInWindow.top - (window.innerHeight - this.renderDom.clientHeight - this.offsetInWindow.top)) / this.renderDom.clientHeight) * 2 + 1;
  }

  private render() {
    this.ngZone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.render.bind(this));

      // update time
      const deltaTime = this.clock.getDelta();
      this.time += deltaTime;
      for (const func of this.renderLoopFunctions) {
        func(this.time, deltaTime);
      }

      // Set uniforms for shaders
      this.globalUniforms.time.value = this.time;

      // this.renderer.render(this.scene, this.camera);
      // this.fxaaRenderer.render();+
      this.composer.render();
    });
  }

  private resize() {
    const width = this.renderDom.clientWidth;
    const height = this.renderDom.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);



    // this.fxaaRenderer.setSize(width, height);
    // const pixelRatio = this.renderer.getPixelRatio();
    // this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.renderer.domElement.clientWidth * pixelRatio);
    // this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.renderer.domElement.clientHeight * pixelRatio);

    this.globalUniforms.resolution.value = new Vector2(width, height);
  }
}