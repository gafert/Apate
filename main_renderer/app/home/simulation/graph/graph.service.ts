import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Group } from 'three';
import panzoom from '../../../utils/drag.js';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';
import { SVGLoader } from './SVGLoader';
import RISC_SVG from '!!raw-loader!./risc_test.svg';
import * as tinycolor from 'tinycolor2';
import { INSTRUCTIONS } from '../../../core/services/sim-lib-interface/instructionParser';
import { CPU_STATES } from '../../../core/services/sim-lib-interface/bindingSubjects';
import { MeshText2D, textAlign } from 'three-text2d';

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
                  console.log(geometry);

                  if(this.getSignalName(child.id)) {
                    geometry.computeBoundingBox(); // Used later for positioning / may remove
                    // TODO: Set text to variable value dynamically --> subscribe
                    const text = new MeshText2D(child.id, {
                      align: textAlign.left,
                      font: '20px Roboto',
                      fillStyle: '#ffffff',
                      antialias: true
                    });
                    // Scale 100 px font down
                    text.scale.set(0.5,-0.5,0.5);
                    // TODO: Get right position from buffer geometry
                    text.position.set(geometry.boundingBox.min.x, geometry.boundingBox.max.y, 0);
                    childGroup.add(text);
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

    console.log(this.idRoot);
    this.idFlat = this.flattenRootToIndexIdArray(this.idRoot);
    console.log(this.idFlat);

    // Show groups which are active according to the opcode
    this.simLibInterfaceService.bindings.instruction.subscribe((instruction) => {
      if (instruction) {
        this.setVisibility('s_c_instr', true);

        if (instruction.name === INSTRUCTIONS.JAL) {
          this.setVisibility('s_c_jal', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.search(new RegExp('/(jal)([^r])/g')) >= 0) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.JALR) {
          this.setVisibility('s_c_jalr', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('jalr')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.LUI) {
          this.setVisibility('s_c_lui', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('lui')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.AUIPC) {
          this.setVisibility('s_c_auipc', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('auipc')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.ADDI ||
          instruction.name === INSTRUCTIONS.XORI ||
          instruction.name === INSTRUCTIONS.ORI ||
          instruction.name === INSTRUCTIONS.ANDI ||
          instruction.name === INSTRUCTIONS.SLLI ||
          instruction.name === INSTRUCTIONS.SRLI ||
          instruction.name === INSTRUCTIONS.SRAI ||
          instruction.name === INSTRUCTIONS.SLTI ||
          instruction.name === INSTRUCTIONS.SLTIU
        ) {
          this.setVisibility('s_c_imm', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('imm')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.ADD ||
          instruction.name === INSTRUCTIONS.SUB ||
          instruction.name === INSTRUCTIONS.XOR ||
          instruction.name === INSTRUCTIONS.OR ||
          instruction.name === INSTRUCTIONS.AND ||
          instruction.name === INSTRUCTIONS.SLL ||
          instruction.name === INSTRUCTIONS.SRL ||
          instruction.name === INSTRUCTIONS.SRA ||
          instruction.name === INSTRUCTIONS.SLT ||
          instruction.name === INSTRUCTIONS.SLTU) {
          this.setVisibility('s_c_op', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('op')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.LB ||
          instruction.name === INSTRUCTIONS.LH ||
          instruction.name === INSTRUCTIONS.LW ||
          instruction.name === INSTRUCTIONS.LBU ||
          instruction.name === INSTRUCTIONS.LHU) {
          this.setVisibility('s_c_load', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('load')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.SB ||
          instruction.name === INSTRUCTIONS.SH ||
          instruction.name === INSTRUCTIONS.SW) {
          this.setVisibility('s_c_store', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('store')) {
              this.setVisibility(key, true);
            }
          }
        } else if (instruction.name === INSTRUCTIONS.BEQ ||
          instruction.name === INSTRUCTIONS.BNE ||
          instruction.name === INSTRUCTIONS.BLT ||
          instruction.name === INSTRUCTIONS.BGE ||
          instruction.name === INSTRUCTIONS.BLTU ||
          instruction.name === INSTRUCTIONS.BGEU) {
          this.setVisibility('s_c_branch', true);
          for (const key of Object.keys(this.idFlat)) {
            if (key.includes('mux') && key.includes('branch')) {
              this.setVisibility(key, true);
            }
          }
        }
      }
    });

    // Hide all elements when the next decoding stage is incoming
    this.simLibInterfaceService.bindings.nextCpuState.subscribe((nextCpuState) => {
      if (nextCpuState === CPU_STATES.DECODE_INSTRUCTION) {
        for (const key of Object.keys(this.idFlat)) {
          const element = this.idFlat[key];
          if (key.includes('mux') || key.includes('s_c')) {
            element.meshes.forEach((mesh) => {
              mesh.material.opacity = 0.1;
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
      mesh.material.opacity = on ? 1 : 0.2;
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
                console.log('Program Counter: ' + this.simLibInterfaceService.bindings.pc.getValue());
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
