import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {
  AmbientLight,
  DirectionalLight,
  Group,
  Light,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three';

import panzoom from '../services/graphServiceHelpers/panzoom.js';
import {fromEvent} from 'rxjs';
import {cumulativeOffset, sanitizeSpaces, stringToNumber} from '../utils/helper';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {Mux} from './Mux.js';
import {GraphNode} from './GraphNode';
import {InputNode} from './InputNode';
import {GenericNode} from './GenericNode';
import tippy from 'tippy.js';
import {ComparatorNode} from './ComparatorNode';
import {renderLoopFunctions} from './globals';
import sync, {cancelSync, Process} from 'framesync';
import * as _ from 'lodash';
import {SelectionNode} from './SelectionNode';
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader';
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {MatSliderChange} from "@angular/material/slider";
import Stats from "three/examples/jsm/libs/stats.module";
import {GLOBAL_UNIFORMS} from "../utils/globals";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('graph') graphElement: ElementRef<HTMLElement>;
  @ViewChild('stats') statsElement: ElementRef<HTMLElement>;

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
  private fxaaPass: ShaderPass;

  // Set by requestAnimationFrame to render next frame
  private frameSync: Process;
  private time = 0;
  private sceneObjects: GraphNode[] = [];

  // Intersection related
  // centeredMouse is update once the mouse is moved, so set start to value which never could be to prevent
  private raycaster = new Raycaster();
  // intersection on 0,0 before mouse is moved
  private centeredMouse = new Vector2(-10000, -10000);
  private mouse = new Vector2(-10000, -10000);


  // For zooming, needs to be disposed and restarted on new init
  private panZoomInstance;

  public stats = Stats();

  /** Offset of renderDom in window, used for mouse position */
  private offsetInWindow = {
    left: 0,
    top: 0
  };
  private intersectedElement: GraphNode;
  private hoverTooltipInstance: any;
  private mouseDownElement: GraphNode;
  private stateMachineCounter = -1;
  private nextNodes: GraphNode[] = [];

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.init(this.graphElement.nativeElement);
    this.resize();
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
          this.renderer = new WebGLRenderer({ alpha: true });
          this.renderer.setPixelRatio(window.devicePixelRatio >= 2 ? window.devicePixelRatio : 2);
          this.renderer.autoClear = true;


          this.renderDom.appendChild(this.renderer.domElement);
          this.stats.domElement.style.position = null;
          this.statsElement.nativeElement.appendChild(this.stats.domElement);

          // Setup camera
          this.camera = this.setupCamera(this.renderDom.clientWidth, this.renderDom.clientHeight);

          this.composer = new EffectComposer(this.renderer);

          const renderPass = new RenderPass(this.scene, this.camera);
          this.composer.addPass(renderPass);

          this.outlinePass = new OutlinePass(new Vector2(this.renderDom.clientWidth, this.renderDom.clientHeight), this.scene, this.camera);
          this.composer.addPass(this.outlinePass);

          this.fxaaPass = new ShaderPass(FXAAShader)
          this.composer.addPass(this.fxaaPass);


          // Add tooltips
          this.hoverTooltipInstance = tippy(window.document.body, {
            content: 'Context menu',
            trigger: 'manual',
            theme: 'light',
            interactive: true,
            arrow: true,
            allowHTML: true,
            offset: [0, 10]
          });

          // this.composer.addPass(new ShaderPass(FXAAShader));

          // Setup scene with light
          this.scene.add(...this.setupLights());

          this.addScene(this.scene);

          // Listeners on this specific dom element
          this.setRenderDomListeners(this.renderDom);

          fromEvent(window, 'resize').subscribe(() => {
            this.offsetInWindow = cumulativeOffset(this.renderDom);
            this.resize();
          });

          // Call first event because events fired only after resize
          this.offsetInWindow = cumulativeOffset(this.renderDom);
          this.resize();

          // Enable zooming
          this.panZoomInstance = panzoom(this.camera, this.renderDom);

          // Start rendering
          this.render();

          // Make interactive
          // First all with opacity
          // Start transition on first node
          // Then go from one two the next --> which one? Connected to output?
          // On each node have an explanation


          resolve();
        }
      });
    });
  }

  /**
   * Stop the rendering. Start again by calling init().
   */
  public stopRender() {
    if (this.frameSync) {
      cancelSync.render(this.frameSync);
    }
  }

  /**
   * Will be called every render function with time and delta time
   * @param func Callback to call every new render
   */
  public runInRenderLoop(func: (time: number, deltaTime: number) => void): void {
    renderLoopFunctions.push(func);
  }

  public focusOnNext() {

    switch (this.stateMachineCounter) {
      case -1:
        const pc = this.getSceneObject('Program Counter');
        (pc as InputNode).value = 0xDEADBEEF;
        this.nextNodes.push(pc);
        this.stateMachineCounter++;
        break;
      case 0:
        const tmpNextNodes = [];
        this.nextNodes.forEach((n) => {
          tmpNextNodes.push(...n.forwardValuesToNextNodes());
        });
        this.nextNodes = _.uniq(tmpNextNodes);
        this.stateMachineCounter++;
        break;
      case 1:
        console.log(this.nextNodes);
        this.nextNodes.forEach((n) => n.compute());
        this.stateMachineCounter = 0;
        break;
    }
  }

  private addScene(scene) {
    const structure = [
      {
        name: 'Program Counter',
        text: 'PC',
        position: [-7, -0.91, 0],
        type: 'input'
      },
      {
        name: 'Memory',
        position: [-2.5, 0, 0],
        type: 'generic',
        inPorts: [{ name: 'Address' }],
        outPorts: [{ name: 'Data' }],
        computation: function(node: GenericNode) {
          // Forward input data to output
          node.setOutputValue(0, node.inputs[0].value);
        }
      },
      {
        name: 'Comparator for OP (operation)',
        position: [7, -0.5, 0],
        type: 'comparator',
        constValue: 0b0110011
      },
      {
        name: 'Comparator for IMM-OP (immediate operator)',
        position: [7, -1.7, 0],
        type: 'comparator',
        constValue: 0b0010011
      },
      {
        name: 'Comparator for LOAD',
        position: [7, -2.9, 0],
        type: 'comparator',
        constValue: 0b0000011
      },
      {
        name: 'Comparator for STORE',
        position: [7, -4.1, 0],
        type: 'comparator',
        constValue: 0b0100011
      },
      {
        name: 'Comparator for BRANCH',
        position: [7, -5.3, 0],
        type: 'comparator',
        constValue: 0b1100011
      },
      {
        name: 'Comparator for JAL (jump and link)',
        position: [7, -6.5, 0],
        type: 'comparator',
        constValue: 0b1101111
      },
      {
        name: 'Comparator for JALR (jump and link register)',
        position: [7, -7.7, 0],
        type: 'comparator',
        constValue: 0b1100111
      },
      {
        name: 'Comparator for LUI (load upper immediate)',
        position: [7, -8.9, 0],
        type: 'comparator',
        constValue: 0b0110111
      },
      {
        name: 'Comparator for AUIPC (add upper immediate to program counter)',
        position: [7, -10.1, 0],
        type: 'comparator',
        constValue: 0b0010111
      },
      {
        name: 'Comparator for SYSTEM',
        position: [7, -11.3, 0],
        type: 'comparator',
        constValue: 0b1110011
      },
      {
        name: 'RS Bit Selector',
        position: [9, 0, 0],
        type: 'selector'
      },
      {
        name: 'Mux Two',
        position: [20, 0, 0],
        type: 'mux',
        numIn: 4
      },
      {
        name: 'Mux Three',
        position: [23, 0, 0],
        type: 'mux',
        numIn: 2
      }
    ];

    const lines = [
      'Program Counter -> Memory',
      'Memory -> Comparator for OP (operation)',
      'Memory -> Comparator for IMM-OP (immediate operator)',
      'Memory -> Comparator for LOAD',
      'Memory -> Comparator for BRANCH',
      'Memory -> Comparator for STORE',
      'Memory -> Comparator for JAL (jump and link)',
      'Memory -> Comparator for JALR (jump and link register)',
      'Memory -> Comparator for LUI (load upper immediate)',
      'Memory -> Comparator for AUIPC (add upper immediate to program counter)',
      'Memory -> Comparator for SYSTEM'
    ];


    structure.forEach((element) => {
      switch (element.type) {
        case 'mux':
          const mux1 = new Mux(element.name, element.numIn, GLOBAL_UNIFORMS);
          mux1.position.set(element.position[0], element.position[1], element.position[2]);
          scene.add(mux1.renderGroup);
          this.sceneObjects.push(mux1);
          break;
        case 'input':
          const input1 = new InputNode(element.name, element.text);
          input1.position.set(element.position[0], element.position[1], element.position[2]);
          scene.add(input1.renderGroup);
          this.sceneObjects.push(input1);
          break;
        case 'generic':
          const generic1 = new GenericNode(element.name, element.inPorts, element.outPorts, GLOBAL_UNIFORMS, element.computation);
          generic1.position.set(element.position[0], element.position[1], element.position[2]);
          scene.add(generic1.renderGroup);
          this.sceneObjects.push(generic1);
          break;
        case 'comparator':
          const comparator1 = new ComparatorNode(element.name, element.constValue, GLOBAL_UNIFORMS);
          comparator1.position.set(element.position[0], element.position[1], element.position[2]);
          scene.add(comparator1.renderGroup);
          this.sceneObjects.push(comparator1);
          break;
        case 'selector':
          const selector1 = new SelectionNode(element.name, GLOBAL_UNIFORMS);
          selector1.position.set(element.position[0], element.position[1], element.position[2]);
          scene.add(selector1.renderGroup);
          this.sceneObjects.push(selector1);
          break;
      }
    });


    lines.forEach((line) => {
      const elements = line.split('->');

      if (elements.length !== 2) {
        console.error('Cannot parse line \'' + line + '\'. There are no elements left and right of the arrow.');
        return;
      }

      const source = elements[0].split('@');
      const target = elements[1].split('@');

      const sourceName = sanitizeSpaces(source[0]);
      const sourceOut = stringToNumber(source[1]);

      const targetName = sanitizeSpaces(target[0]);
      const targetIn = stringToNumber(target[1]);

      if (sourceName === targetName) {
        console.error('The same target and source node with name \'' + sourceName + '\' cannot be linked to itself.');
        return;
      }

      const sourceNode = this.sceneObjects.filter((e) => e.name === sourceName)[0];
      const targetNode = this.sceneObjects.filter((e) => e.name === targetName)[0];

      if (!sourceNode) {
        console.error('Source node with name \'' + sourceName + '\' does not exist.');
        return;
      }

      if (!targetNode) {
        console.error('Target node with name \'' + targetName + '\' does not exist.');
        return;
      }

      sourceNode.connectToInput(targetNode, targetIn, sourceOut);
    });
  }

  private setRenderDomListeners(renderDom) {
    renderDom.addEventListener('mousemove', this.setLocalMouseVariables.bind(this), false);
    renderDom.addEventListener('mouseleave', this.setLocalMouseVariables.bind(this, true), false);

    renderDom.addEventListener('mousedown', this.clickHandler.bind(this, 'mousedown'));
    renderDom.addEventListener('mouseup', this.clickHandler.bind(this, 'mouseup'));
    renderDom.addEventListener('mousemove', this.clickHandler.bind(this, 'mousemove'));
  }

  private clickHandler(event: string) {
    if (event === 'mousemove' || event === 'scroll') {
      this.mouseDownElement = null;
    }

    if (this.intersectedElement) {
      if (event === 'mousedown') {
        this.mouseDownElement = this.intersectedElement;
      } else if (event === 'mouseup' && this.intersectedElement === this.mouseDownElement) {
        console.log(this.intersectedElement);
        if (this.intersectedElement instanceof Mux) {
          this.intersectedElement.selectNext();
        }
      }
    }
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
      this.frameSync = sync.render(({ delta, timestamp }) => {
        this.time += delta;
        // Set uniforms for shaders
        GLOBAL_UNIFORMS.time.value = this.time;
        // Handle interactability via intersections
        this.handleIntersection();
        this.stats.update();
        this.composer.render();
      }, true);
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
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.renderer.domElement.clientWidth * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.renderer.domElement.clientHeight * pixelRatio);

    GLOBAL_UNIFORMS.resolution.value = new Vector2(width, height);
  }

  private handleIntersection() {
    // Intersection
    this.raycaster.setFromCamera(this.centeredMouse, this.camera);

    // Show Tooltip on intersection
    const removeTooltip = () => {
      this.hoverTooltipInstance.hide();
      this.intersectedElement = null;
    };

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      // Get object which intersected
      console.log();

      const object = (intersects[0].object.parent as Group & { node: GraphNode }).node;

      if (object) {
        if (this.intersectedElement != object) {
          if (this.intersectedElement) {
            this.hoverTooltipInstance.hide();
          }
          this.intersectedElement = object;

          this.hoverTooltipInstance.setProps({
            getReferenceClientRect: () => ({
              width: 0,
              height: 0,
              top: this.mouse.y,
              bottom: this.mouse.y,
              left: this.mouse.x,
              right: this.mouse.x
            })
          });

          this.hoverTooltipInstance.setContent('<strong>' + object.name + '</strong>');

          this.hoverTooltipInstance.show();
        } else {
          this.hoverTooltipInstance.setProps({
            getReferenceClientRect: () => ({
              width: 0,
              height: 0,
              top: this.mouse.y,
              bottom: this.mouse.y,
              left: this.mouse.x,
              right: this.mouse.x
            })
          });
        }
      } else {
        if (this.intersectedElement)
          removeTooltip();
      }
    } else {
      if (this.intersectedElement)
        removeTooltip();
    }
  }

  private getSceneObject(name) {
    return this.sceneObjects.filter((o) => o.name === name)[0];
  }

  private fromSlider = 0;
  private toSlider = 1;
  fromSliderChanged($event: MatSliderChange) {
    this.fromSlider = $event.value;
    (this.getSceneObject("RS Bit Selector") as SelectionNode).createTextMesh(0xDEADBEEF, this.fromSlider, this.toSlider)
  }
  toSliderChanged($event: MatSliderChange) {
    this.toSlider = $event.value;
    (this.getSceneObject("RS Bit Selector") as SelectionNode).createTextMesh(0xDEADBEEF, this.fromSlider, this.toSlider)
  }
}
