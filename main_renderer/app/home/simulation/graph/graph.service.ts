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
  private idRoot;
  private idFlat;

  private mouse = new THREE.Vector2();
  private INTERSECTED;
  private raycaster;

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

    // this.runInRenderLoop((time, deltaTime) => {
    //   this.panels.forEach((panel, index) => {
    //     panel.changeBorderColor(new THREE.Color(Math.sin(time + index), Math.sin(time * 2.3 + index), Math.sin(time * 5.2 + index)))
    //   });
    // })
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
        domElement.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
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

        // For intersection
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);

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
    const loader = new SVGLoader();
    this.idRoot = loader.parse(RISC_SVG).root;

    const renderGroup = new THREE.Group();
    renderGroup.scale.multiplyScalar(0.25);
    renderGroup.position.x = 0;
    renderGroup.position.y = 0;
    renderGroup.scale.y *= -1;

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

                    const binding = this.cpuInterface.bindings.values[signalName];
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
          }
        } else {
          const newChildGroup = new Group();
          newChildGroup.name = child.id;
          generateChildren(child.children, newChildGroup);
          childGroup.add(newChildGroup);
        }
      }
    };

    generateChildren(this.idRoot.children, renderGroup);
    this.scene.add(renderGroup);
    console.log(renderGroup);

    this.idFlat = this.flattenRootToIndexIdArray(this.idRoot);
    console.log(this.idFlat);

    this.initHighlightingUsedPaths();
  }

  initHighlightingUsedPaths() {
    // Show groups which are active according to the opcode
    this.cpuInterface.bindings.instruction.subscribe((instruction) => {
      if (instruction) {
        console.log('Instruction changed');

        // Hide all instructions
        this.setVisibility('s_c_instr', true);

        if (isJAL(instruction.name)) {
          this.setVisibility('s_c_jal', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('jal') && (key.indexOf('jal') !== key.indexOf('jalr'))) {
              this.setVisibility(key, true);
            }
          }
        } else if (isJALR(instruction.name)) {
          this.setVisibility('s_c_jalr', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('jalr')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isLUI(instruction.name)) {
          this.setVisibility('s_c_lui', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('lui')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isAUIPC(instruction.name)) {
          this.setVisibility('s_c_auipc', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('auipc')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isIMM(instruction.name)) {
          this.setVisibility('s_c_imm', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('imm')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isOP(instruction.name)) {
          this.setVisibility('s_c_op', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('op')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isLOAD(instruction.name)) {
          this.setVisibility('s_c_load', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('load')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isSTORE(instruction.name)) {
          this.setVisibility('s_c_store', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('store')) {
              this.setVisibility(key, true);
            }
          }
        } else if (isBRANCH(instruction.name)) {
          this.setVisibility('s_c_branch', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('branch')) {
              this.setVisibility(key, true);
            }
          }

          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('beq') ||
              key.includes('mux') && key.includes('bne') ||
              key.includes('mux') && key.includes('blt') ||
              key.includes('mux') && key.includes('bge')) {
              this.setVisibility(key, false);
            }
          }

          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux_' + instruction.name.toLowerCase())) {
              this.setVisibility(key, true);
            }
          }
        }
      }
    });

    this.cpuInterface.bindings.branchResult.subscribe((result) => {
      console.log('Branch result changed');
      if (this.cpuInterface.bindings.instruction.value?.name ?
        (isBRANCH(this.cpuInterface.bindings.instruction.value.name)
        && this.cpuInterface.bindings.cpuState.value == CPU_STATES.DECODE_INSTRUCTION) : 0) {
        if (result) {
          this.setVisibility('mux_b_true', true);
          this.setVisibility('mux_b_false', false);
        } else {
          this.setVisibility('mux_b_false', true);
          this.setVisibility('mux_b_true', false);
        }
      }
    });

    this.cpuInterface.bindings.nextCpuState.subscribe((nextCpuState) => {
      for (const key of Object.keys(this.idFlat)) {
        const element = this.idFlat[key];
        if (nextCpuState === CPU_STATES.DECODE_INSTRUCTION) {
          // Hide all elements when the next decoding stage is incoming
          if (key.includes('mux') || key.includes('s_c')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 0.1;
            });
          }
        }
      }
    });

    this.cpuInterface.bindings.cpuState.subscribe((nextCpuState) => {
      for (const key of Object.keys(this.idFlat)) {
        const element = this.idFlat[key];

        // Show only state borders of active state
        if (key.includes('state')) {
          element.meshes.forEach((mesh) => {
            mesh.material.opacity = 0.1;
          });
        }

        if (nextCpuState === CPU_STATES.READ_DATA_FROM_MEMORY) {
          if (key.includes('state') && key.includes('fetch')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 1;
            });
          }
        }

        if (nextCpuState === CPU_STATES.DECODE_INSTRUCTION) {
          if (key.includes('state') && key.includes('decode')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 1;
            });
          }
        }

        if (nextCpuState === CPU_STATES.EXECUTE) {
          if (key.includes('state') && key.includes('execute')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 1;
            });
          }
        }

        if (nextCpuState === CPU_STATES.WRITE_BACK) {
          if (key.includes('state') && key.includes('writeback')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 1;
            });
          }
        }

        if (nextCpuState === CPU_STATES.ADVANCE_PC) {
          if (key.includes('state') && key.includes('advpc')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 1;
            });
          }
        }
      }

    });
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - (window.innerHeight - this.domElement.clientHeight)) / this.domElement.clientHeight) * 2 + 1;
  }


  setVisibility(id, on) {
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
      if (child.id) ids[child.id] = { meshes: meshes };
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

  getFirstGroup(regexp, str) {
    return Array.from(str.matchAll(regexp), m => m[1])[0];
  }

  stopRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
