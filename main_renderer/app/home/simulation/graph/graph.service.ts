import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Group, MathUtils } from 'three';
import panzoom from '../../../utils/drag.js';
import { CpuInterface } from '../../../core/services/cpu-interface/cpu-interface.service';
import { SVGLoader } from './SVGLoader';
import RISC_SVG from '!!raw-loader!./risc_test.svg';
import * as tinycolor from 'tinycolor2';
import { easing, tween } from 'popmotion';
import {
  isAUIPC,
  isBRANCH,
  isIMM,
  isJAL,
  isJALR,
  isLOAD,
  isLUI,
  isOP,
  isSTORE
} from '../../../core/services/cpu-interface/instructionParser';
import { CPU_STATES } from '../../../core/services/cpu-interface/bindingSubjects';
import { MeshText2D, textAlign } from 'three-text2d';
import * as d3 from 'd3';
import DEG2RAD = MathUtils.DEG2RAD;
import tippy, { Instance, Props, Tippy } from 'tippy.js';

interface ThreeNode {
  meshes: THREE.Mesh[];
  id: string;
  node: Element;
  children: ThreeNode[];
}

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

  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];

  private renderGroup; // Holds the meshes in Three.js groups named according to svg names
  private idRoot; // Holds the parsed svg and adds meshes to each element
  private idFlat; // Takes the parsed svg with meshes and flattens all names to be a 1D array

  private centeredMouse = new THREE.Vector2();
  private mouse = new THREE.Vector2();
  private INTERSECTED;
  private raycaster: THREE.Raycaster;

  private activeArea: 'overview' | 'decoder' | 'alu' | 'memory' | 'registers';

  private tippyTooltip: Instance<Props>;

  constructor(private ngZone: NgZone, private cpuInterface: CpuInterface) {
    process.on('exit', () => {
      console.log('Exit GraphService');
      this.stopRender();
      this.scene.dispose();
      this.renderer.dispose();
      this.camera = null;
      this.scene = null;
      this.clock = null;
    });
  }

  runInRenderLoop(func: (time: number, deltaTime: number) => void): void {
    this.renderLoopFunctions.push(func);
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
        // Service already loaded scene, only set dom element again and start rendering
        domElement.appendChild(this.renderer.domElement);
        this.resize();
        this.render();
        panzoom(this.camera, domElement);
      } else {
        const width = domElement.clientWidth;
        const height = domElement.clientHeight;

        // Setup renderer
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.outline = 'none';
        domElement.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        this.camera.position.z = 50;

        // Setup scene with light
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

        // Initiate objects from svg
        this.initiateObjects();

        // For intersection
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);

        // Enable resizing
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        // Enable zooming
        panzoom(this.camera, domElement);

        // Split areas in world and focus on the first
        // This needs to be away from initiateObjects
        this.separateAreas();
        this.goToArea('overview');

        // Add tooltips
        this.tippyTooltip = tippy(this.renderer.domElement, {
          content: 'Context menu',
          trigger: 'manual',
          theme: 'light',
          interactive: true,
          arrow: true,
          offset: [0, 10]
        });

        // Start rendering
        if (document.readyState !== 'loading') this.render();
        else window.addEventListener('DOMContentLoaded', this.render.bind(this));

        // Set initiated to true to not reload settings if init was called again by component using the service
        this.initiated = true;
      }
    });
  }

  goToState(state) {
    // Block if change comes too early
    if (!this.idFlat) return;
    if (this.activeArea !== 'overview') return;
    this.focusCameraOnMesh(this.idFlat['state_' + state].meshes[0], true);
  }

  goToArea(name) {
    // Block if change comes too early
    if (!this.idFlat) return;
    this.activeArea = name;
    this.focusCameraOnMesh(this.idFlat['areaborder_' + name].meshes[0]);
    if (this.activeArea === 'overview') {
      // Focus on state
      this.updateAndFocusState(this.cpuInterface.bindings.nextCpuState.value);
    }
  }

  private focusCameraOnMesh(mesh, animate = false) {
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();
    const bb = mesh.geometry.boundingBox;
    const center = new THREE.Vector3();
    bb.getCenter(center);
    const size = new THREE.Vector3();
    bb.getSize(size);


    // Test sphere
    // const geometry = new THREE.PlaneGeometry(size.x, size.y);
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0xffff00
    // });
    // material.transparent = true;
    // material.opacity = 0.05;
    // const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.copy(center);
    // mesh.add(sphere);


    const vFoV = this.camera.getEffectiveFOV();
    const hFoV = this.camera.fov * this.camera.aspect;
    const FoV = Math.min(vFoV, hFoV);

    const distance = Math.max(size.x, size.y, size.z);
    // var distance = boundingBox.getBoundingSphere().radius * 2;

    // const cameraZ = distance / 2 / Math.tan(Math.PI * FOV / 360);
    // TODO: Why does this need to be divided by 7.5? Why is the camera too far away without that?
    const cameraZ = distance / Math.sin(FoV / 2 * DEG2RAD) / 7.5;
    console.log(distance, cameraZ);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const bsWorld = center.clone();
    mesh.localToWorld(bsWorld);
    const cameraDir = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDir);

    const cameraOffs = cameraDir.clone();

    cameraOffs.setZ(cameraZ);

    const newCameraPos = bsWorld.clone().add(cameraOffs);

    if (animate) {
      tween({
        from: 0,
        to: 1,
        ease: easing.easeOut,
        duration: 300
      }).start((v) => {
        this.camera.position.lerp(newCameraPos, v);
      });
    } else {
      this.camera.position.copy(newCameraPos);
    }
  }

  separateAreas() {
    const areas = ['overview', 'decoder', 'alu', 'memory', 'registers'];

    let y = 0;
    for (const area of areas) {
      if (!this.idFlat['area_' + area]) continue;
      const group = this.idFlat['area_' + area].group;
      group.position.set(0, y, 0);
      y += 1000;
    }
  }

  initiateObjects() {
    const loader = new SVGLoader();
    this.idRoot = loader.parse(RISC_SVG).root;

    this.renderGroup = new THREE.Group();
    this.renderGroup.scale.multiplyScalar(0.25);
    this.renderGroup.position.x = 0;
    this.renderGroup.position.y = 0;
    this.renderGroup.scale.y *= -1;

    const generateChildren = (children, childGroup) => {
      for (const child of children) {
        // Only generate meshes for non idRoot as in elements which have no children
        if (!child.children) {
          if (child.path) {
            const path = child.path;
            const meshes: THREE.Mesh[] = [];
            if (path.userData.style.fill && path.userData.style.fill !== 'none') {
              const fillColor = tinycolor(this.checkColor(path.userData.style.fill));
              const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(fillColor.toHexString()),
                opacity: path.userData.style.fillOpacity * (path.userData.style.opacity ? path.userData.style.opacity : 1) * fillColor.getAlpha(),
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
              });
              const shapes = path.toShapes(true);
              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new THREE.ShapeBufferGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = child.id;
                childGroup.add(mesh);
                meshes.push(mesh);
              }
            }
            if (path.userData.style.stroke && path.userData.style.stroke !== 'none') {
              const strokeColor = tinycolor(this.checkColor(path.userData.style.stroke));
              const material1 = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(strokeColor.toHexString()),
                opacity: path.userData.style.strokeOpacity * (path.userData.style.opacity ? path.userData.style.opacity : 1) * strokeColor.getAlpha(),
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
              });

              for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                const subPath = path.subPaths[j];
                const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                if (geometry) {
                  const mesh = new THREE.Mesh(geometry, material1);
                  childGroup.add(mesh);
                  mesh.name = child.id;
                  meshes.push(mesh);

                  const signalName = this.getSignalName(child.id);
                  if (signalName) {
                    const text = new MeshText2D(signalName, {
                      align: textAlign.left,
                      font: '50px Roboto',
                      fillStyle: '#ffffff',
                      antialias: true
                    });
                    text.scale.set(0.25, -0.25, 0.25);

                    // Get position from signal
                    const positions = [];
                    for (let i = 0; i < geometry.attributes.position.count; i++) {
                      positions.push({
                        x: geometry.attributes.position.array[i * 3],
                        y: geometry.attributes.position.array[i * 3 + 1],
                        z: geometry.attributes.position.array[i * 3 + 2]
                      });
                    }
                    const leftes = d3.scan(positions, (a, b) => a.x - b.x);
                    text.position.set(positions[leftes].x + 3, positions[leftes].y + 2, positions[leftes].z);

                    const binding = this.cpuInterface.bindings.allValues[signalName];
                    if (binding) {
                      binding.subscribe((value) => {
                        text.text = (value === null || value === undefined) ? 'NaN' : value.toString();
                      });
                    }

                    childGroup.add(text);
                    meshes.push(text.mesh);
                  }
                }
              }
            }
            child.meshes = meshes;
            child.group = childGroup;
            child.isGroup = false;
          }
        } else {
          const newChildGroup = new Group();
          newChildGroup.name = child.id;
          child.group = newChildGroup;
          child.isGroup = true;
          generateChildren(child.children, newChildGroup);
          childGroup.add(newChildGroup);
        }
      }
    };

    this.idRoot.group = this.renderGroup;
    generateChildren(this.idRoot.children, this.renderGroup);
    this.idFlat = this.flattenRootToIndexIdArray(this.idRoot);

    console.log(this.renderGroup);
    console.log(this.idRoot);
    console.log(this.idFlat);

    this.scene.add(this.renderGroup);
    this.initHighlightingUsedPaths();
  }

  initHighlightingUsedPaths() {
    const checkElementsCandMUX = (element: string) => {
      for (const key of Object.keys(this.idFlat)) {
        if (key.startsWith('mux') && key.includes(element)) {
          this.setVisibility(key, true);
        }
        if (key.startsWith('c') && key.includes(element)) {
          this.setVisibility(key, true);
        }
      }
    };

    this.cpuInterface.bindings.cycleComplete.subscribe((complete) => {
      const nextCpuState = this.cpuInterface.bindings.nextCpuState.value;
      const cpuState = this.cpuInterface.bindings.cpuState.value;

      // Reset all lines
      // Dont show any active lines
      if (nextCpuState === CPU_STATES.FETCH) {
        for (const key of Object.keys(this.idFlat)) {
          const element = this.idFlat[key];
          // Hide all elements when the next decoding stage is incoming
          if (key.startsWith('mux_') || key.startsWith('c_')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 0.1;
            });
          }
        }
        // Reset all values
        Object.values(this.cpuInterface.bindings.volatileValues).forEach((value) => value.next(null));
      }

      // Show decoded active lines if the current executed state was decoding
      if (cpuState === CPU_STATES.DECODE_INSTRUCTION) {
        if (this.cpuInterface.bindings.instruction.value) {
          const instruction = this.cpuInterface.bindings.instruction.value;
          if (isJAL(instruction.name)) {
            for (const key of Object.keys(this.idFlat)) {
              if (key.startsWith('mux') && key.includes('jal') && (key.indexOf('jal') !== key.indexOf('jalr'))) {
                this.setVisibility(key, true);
              }
              if (key.startsWith('c') && key.includes('jal') && (key.indexOf('jal') !== key.indexOf('jalr'))) {
                this.setVisibility(key, true);
              }
            }
          } else if (isJALR(instruction.name)) {
            checkElementsCandMUX('jalr');
          } else if (isLUI(instruction.name)) {
            checkElementsCandMUX('lui');
          } else if (isAUIPC(instruction.name)) {
            checkElementsCandMUX('auipc');
          } else if (isIMM(instruction.name)) {
            checkElementsCandMUX('imm');
          } else if (isOP(instruction.name)) {
            checkElementsCandMUX('op');
          } else if (isLOAD(instruction.name)) {
            checkElementsCandMUX('load');
          } else if (isSTORE(instruction.name)) {
            checkElementsCandMUX('store');
          } else if (isBRANCH(instruction.name)) {
            checkElementsCandMUX('branch');

            // Show control paths (c) of branch corresponding to instruction of branch type
            this.setVisibility('c_beq', this.cpuInterface.bindings.branchRs1Rs2BEQ.value === 1);
            this.setVisibility('c_blt', (
              this.cpuInterface.bindings.branchFunc3_12.value === 1 ||
              this.cpuInterface.bindings.branchFunc3_12.value === 2 ||
              this.cpuInterface.bindings.branchFunc3_12.value === 3) && this.cpuInterface.bindings.branchRs1Rs2BLT.value === 1);
            this.setVisibility('c_blt1', this.cpuInterface.bindings.branchFunc3_12.value === 1 && this.cpuInterface.bindings.branchRs1Rs2BLT.value === 1);
            this.setVisibility('c_blt2', this.cpuInterface.bindings.branchFunc3_12.value === 2 && this.cpuInterface.bindings.branchRs1Rs2BLT.value === 1);
            this.setVisibility('c_blt3', this.cpuInterface.bindings.branchFunc3_12.value === 3 && this.cpuInterface.bindings.branchRs1Rs2BLT.value === 1);
            this.setVisibility('c_func3-0', this.cpuInterface.bindings.branchFunc3_0.value);
            this.setVisibility('c_bmuxresult', this.cpuInterface.bindings.branchMuxResult.value);
            this.setVisibility('c_branch', this.cpuInterface.bindings.branchResult.value);

            if (this.cpuInterface.bindings.branchResult.value) {
              this.setVisibility('mux_b_true', true);
              this.setVisibility('mux_b_false', false);
            } else {
              this.setVisibility('mux_b_false', true);
              this.setVisibility('mux_b_true', false);
            }
          }
        }
      }

      this.updateAndFocusState(nextCpuState);
    });
  }

  updateAndFocusState(nextCpuState) {
    // Hide all state meshes
    // Show only state borders of active state
    for (const key of Object.keys(this.idFlat)) {
      if (key.includes('state')) {
        this.idFlat[key].meshes.forEach((mesh) => {
          mesh.material.opacity = 0.1;
        });
      }
    }

    // Activate new state meshes and focus on them in the following switch
    const showStateMesh = (name: string): void => {
      const element = this.idFlat['state_' + name];
      element.meshes.forEach((mesh) => {
        mesh.material.opacity = 1;
      });
    };

    switch (nextCpuState) {
      case CPU_STATES.DECODE_INSTRUCTION:
        this.goToState('decode');
        showStateMesh('decode');
        break;
      case CPU_STATES.EXECUTE:
        this.goToState('execute');
        showStateMesh('execute');
        break;
      case CPU_STATES.WRITE_BACK:
        this.goToState('writeback');
        showStateMesh('writeback');
        break;
      case CPU_STATES.ADVANCE_PC:
        this.goToState('advpc');
        showStateMesh('advpc');
        break;
      case CPU_STATES.BREAK:
        break;
      case CPU_STATES.FETCH:
        this.goToState('fetch');
        showStateMesh('fetch');
        break;
    }
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    // TODO: Depends on where the dom is in relation to the other elements
    // Offset left because the dom does not start on the left border
    this.centeredMouse.x = ((event.clientX + this.domElement.offsetLeft - (window.innerWidth - this.domElement.clientWidth)) / this.domElement.clientWidth) * 2 - 1;
    // Offset top because the dom does not start on the edge, additional - offset top because there is a header over all simulation elements
    this.centeredMouse.y = -((event.clientY - this.domElement.offsetTop - (window.innerHeight - this.domElement.clientHeight - this.domElement.offsetTop)) / this.domElement.clientHeight) * 2 + 1;
  }


  setVisibility(id, on) {
    console.log('Setting visibility of ', id);
    this.idFlat[id]?.meshes.forEach((mesh) => {
      mesh.material.opacity = on ? 1 : 0.1;
    });
  }

  flattenRootToIndexIdArray(root) {
    const ids = [];

    const traverseChildren = (child) => {
      const meshes = [];
      if (child.meshes) meshes.push(...child.meshes);
      if (child.children) for (const deeperChild of child.children) meshes.push(...traverseChildren(deeperChild));
      if (child.id) ids[child.id] = { meshes: meshes, group: child.group };
      return meshes;
    };

    traverseChildren(root);

    return ids;
  }

  checkColor(color) {
    if (color == 'none' || color == undefined) {
      return 'rgba(255,255,255,0)';
    } else {
      return color;
    }
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

      // Intersection
      this.raycaster.setFromCamera(this.centeredMouse, this.camera);

      const removeTooltip = () => {
        if (this.INTERSECTED) {
          // this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          this.tippyTooltip.hide();
        }
        this.tippyTooltip.hide();
        this.INTERSECTED = null;
      };

      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        const object = intersects.find((i) => {
          if (i.object.name.startsWith('s_')) return true;
          if (i.object.name.startsWith('c_')) return true;
          if (i.object.parent.parent.name.startsWith('p_')) return true;
        })?.object;

        if (object) {
          if (this.INTERSECTED != object) {
            if (this.INTERSECTED) {
              //this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
              this.tippyTooltip.hide();
            }
            this.INTERSECTED = object;

            this.tippyTooltip.setProps({
              getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: this.mouse.y,
                bottom: this.mouse.y,
                left: this.mouse.x,
                right: this.mouse.x
              })
            });

            if (this.INTERSECTED.parent.parent.name.startsWith('p_')) {
              // This is part of a port
              const portName = this.getPortName(this.INTERSECTED.parent.parent.name);
              this.tippyTooltip.setContent('Port ' + portName);
            } else if (this.INTERSECTED.name.startsWith('s_')) {
              // This is a signal wire
              this.tippyTooltip.setContent('Signal ' + this.getSignalName(this.INTERSECTED.name));
            } else if (this.INTERSECTED.name.startsWith('c_')) {
              this.tippyTooltip.setContent('Signal with no value ' + this.getSignalName(this.INTERSECTED.name));
            }

            this.tippyTooltip.show();

            // this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
            // this.INTERSECTED.material.color.setHex(0xff0000);
          } else {
            this.tippyTooltip.setProps({
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
          removeTooltip();
        }
      } else {
        removeTooltip();
      }

      this.renderer.render(this.scene, this.camera);
    });
  }

  getPortName(id) {
    const regex = /(?:p_)(.*?)(?:[-\n$\s])/g;
    return this.getFirstGroup(regex, id);
  }

  getSignalName(id) {
    const regex = /(?:s_)(.*?)(?:-|$)/g;
    return this.getFirstGroup(regex, id);
  }

  getControlName(id) {
    const regex = /(?:c_)(.*?)(?:-|$)/g;
    return this.getFirstGroup(regex, id);
  }

  getFirstGroup(regexp, str) {
    return Array.from(str.matchAll(regexp), m => m[1])[0];
  }

  stopRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
