import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Group } from 'three';
import panzoom from '../../../utils/drag.js';
import { CpuInterface } from '../../../core/services/cpu-interface/cpu-interface.service';
import { SVGLoader } from './SVGLoader';
import RISC_SVG from '!!raw-loader!./risc_test.svg';
import * as tinycolor from 'tinycolor2';
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

  private mouse = new THREE.Vector2();
  private INTERSECTED;
  private raycaster: THREE.Raycaster;

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
        domElement.appendChild(this.renderer.domElement);
        this.resize();
        this.render();
        panzoom(this.camera, domElement);
      } else {
        const width = domElement.clientWidth;
        const height = domElement.clientHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.outline = 'none';
        domElement.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        this.camera.position.z = 50;

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

        this.initiateObjects();

        // For intersection
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        // END For intersection

        if (document.readyState !== 'loading') this.render();
        else window.addEventListener('DOMContentLoaded', this.render.bind(this));
        window.addEventListener('resize', this.resize.bind(this));

        this.resize();
        panzoom(this.camera, domElement);

        // Split areas in world and focus on the first
        // This needs to be away from initiateObjects
        this.separateAreas();
        this.goToArea('overview');

        this.initiated = true;
      }
    });
  }

  goToState(state) {
    // Block if change comes too early
    if (!this.idFlat) return;
    this.focusCameraOnMesh(this.idFlat['state_' + state].meshes[0]);
  }

  goToArea(name) {
    // Block if change comes too early
    if (!this.idFlat) return;
    this.focusCameraOnMesh(this.idFlat['areaborder_' + name].meshes[0]);
  }

  private focusCameraOnMesh(mesh) {
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();
    const bs = mesh.geometry.boundingSphere;

    // // Test sphere
    // const geometry = new THREE.CircleGeometry(mesh.geometry.boundingSphere.radius, 32, 32);
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0xffff00
    // });
    // material.transparent = true;
    // material.opacity = 0.05;
    // const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.copy(bs.center);
    // mesh.add(sphere);

    const vFoV = this.camera.getEffectiveFOV();
    const hFoV = this.camera.fov * this.camera.aspect;

    const FoV = Math.min(vFoV, hFoV);
    const FoV2 = FoV * 1.2; // divided by 2 would be the whole fov, but there are things on the side of the screen so the real fov is smaller

    const a = bs.radius;
    const A = FoV2;
    const B = (90 - A) * Math.PI / 180.0;
    const c = a / Math.sin(B);
    const b = Math.sqrt(c * c - a * a);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);

    const bsWorld = bs.center.clone();
    mesh.localToWorld(bsWorld);

    const cameraDir = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDir);

    const cameraOffs = cameraDir.clone();
    cameraOffs.multiplyScalar(-b);
    const newCameraPos = bsWorld.clone().add(cameraOffs);

    this.camera.position.copy(newCameraPos);
    this.camera.lookAt(bsWorld);
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
    });
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = ((event.clientX + this.domElement.offsetLeft - (window.innerWidth - this.domElement.clientWidth)) / this.domElement.clientWidth) * 2 - 1 ;
    this.mouse.y = -((event.clientY + this.domElement.offsetTop - (window.innerHeight - this.domElement.clientHeight)) / this.domElement.clientHeight) * 2 + 1;
  }


  setVisibility(id, on) {
    console.log('Setting visibility of ', id);
    this.idFlat[id].meshes.forEach((mesh) => {
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
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        if (this.INTERSECTED != intersects[0].object) {
          if (this.INTERSECTED) this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          this.INTERSECTED = intersects[0].object;
          if (this.INTERSECTED.parent.name.indexOf('p') == 0) {
            if (this.INTERSECTED.parent.parent.name.indexOf('p_') == 0) {
              // INTERSECTED is part of a port
              const portName = this.getPortName(this.INTERSECTED.parent.parent.name);
              if (portName == 'pc') {
                console.log('Program Counter: ' + this.cpuInterface.bindings.pc.getValue());
              } else {
                console.log('Not found data path: ', this.INTERSECTED.parent.parent.name, portName);
              }
            }
          } else if (this.INTERSECTED.name.indexOf('s') == 0) {
            // This is a signal wire
            console.log('Signal not found: ', this.INTERSECTED.name, this.getSignalName(this.INTERSECTED.name));
          }
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
          this.INTERSECTED.material.color.setHex(0xff0000);
        }
      } else {
        if (this.INTERSECTED) this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        this.INTERSECTED = null;
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
