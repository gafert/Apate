import {Injectable, NgZone} from '@angular/core';
import * as THREE from 'three';
import {Group, MathUtils} from 'three';
import panzoom from '../../../utils/drag.js';
import {CpuInterface} from '../../../core/services/cpu-interface/cpu-interface.service';
import {SVGLoader} from './SVGLoader';
import RISC_SVG from '!!raw-loader!./risc_test.svg';
import * as tinycolor from 'tinycolor2';
import {animate, easeIn} from 'popmotion';
import anime from 'animejs/lib/anime.es.js';
import * as _ from 'lodash';
import {CPU_STATES} from '../../../core/services/cpu-interface/bindingSubjects';
import {MeshText2D, textAlign} from 'three-text2d';
import * as d3 from 'd3';
import DEG2RAD = MathUtils.DEG2RAD;
import tippy, {Instance, Props, Tippy} from 'tippy.js';
import RISCV_DEFINITIONS from './risc.yml';

interface ThreeNode {
  meshes: THREE.Mesh[];
  id: string;
  node: Element;
  children: ThreeNode[];
}

type areas = 'overview' | 'decoder' | 'alu' | 'memory' | 'registers';

@Injectable()
export class GraphService {
  public initiated = false;

  // Target where the canvas will be put
  // Canvas will fill this dom
  private renderDom;

  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  // Set by requestAnimationFrame to render next frame
  private frameId: number;

  private time = 0;
  private clock = new THREE.Clock();
  private globalUniforms = {
    u_time: {type: 'f', value: 0},
    u_resolution: {type: 'vec2', value: new THREE.Vector2(0, 0)}
  };

  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];

  private renderGroup; // Holds the meshes in Three.js groups named according to svg names
  private idRoot; // Holds the parsed svg and adds meshes to each element
  private idFlat; // Takes the parsed svg with meshes and flattens all names to be a 1D array
  private idMaterials = [];
  private nonVisibleMeshes = [];

  // Intersection related
  // centeredMouse is update once the mouse is moved, so set start to value which never could be to prevent
  // intersection on 0,0 before mouse is moved
  private centeredMouse = new THREE.Vector2(-10000, -10000);
  private mouse = new THREE.Vector2(-10000, -10000);
  private intersectedElement;
  private raycaster: THREE.Raycaster;
  private tippyTooltip: Instance<Props>;

  private activeArea: areas;

  private focusAnimation;

  constructor(private ngZone: NgZone, private cpuInterface: CpuInterface) {
    process.on('exit', () => {
      console.log('Exit GraphService');
      this.stopRender();
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
    const width = this.renderDom.clientWidth;
    const height = this.renderDom.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.globalUniforms.u_resolution.value = new THREE.Vector2(width, height);
  }

  init(domElement: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
      this.renderDom = domElement;
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
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
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

        // Add tooltips
        this.tippyTooltip = tippy(this.renderer.domElement, {
          content: 'Context menu',
          trigger: 'manual',
          theme: 'light',
          interactive: true,
          arrow: true,
          allowHTML: true,
          offset: [0, 10]
        });

        // Start rendering
        if (document.readyState !== 'loading') this.render();
        else window.addEventListener('DOMContentLoaded', this.render.bind(this));

        // Split areas in world and focus on the first
        // This needs to be away from initiateObjects
        this.separateAreas();
        this.goToArea('overview');

        // Set initiated to true to not reload settings if init was called again by component using the service
        this.initiated = true;
      }
    });
  }

  public focusOnElement(state) {
    // Block if change comes too early
    if (!this.idFlat) return;
    this.focusCameraOnMesh(this.idFlat['focus_' + state]?.meshes[0], true);
  }

  public async goToArea(name) {
    // Block if change comes too early
    if (!this.idFlat || name === this.activeArea) return;

    // Hide elements of current area only if there is one selected, else skip this and only show
    if (this.activeArea) await this.hideMeshes(this.idFlat['area_' + this.activeArea].meshes, true);


    // Hide elements where we will jump to
    await this.hideMeshes(this.idFlat['area_' + name].meshes, false);
    // Focus on new area
    this.focusCameraOnMesh(this.idFlat['areaborder_' + name].meshes[0], false);

    // This can be async as the camera can move now
    // Show meshes at new location
    this.showMeshes(this.idFlat['area_' + name].meshes).then(() => {
      // Hide all which are not active
      this.updateActiveElements();
    })

    this.activeArea = name;
  }

  private focusCameraOnMesh(mesh, enableAnimation = false) {
    if (!mesh) return;

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

    this.focusAnimation?.stop();
    // Lerp to new position if animate is true, otherwise move instantly
    if (enableAnimation) {
      this.focusAnimation = animate({
        from: 0,
        to: 1,
        ease: easeIn,
        duration: 1000,
        onUpdate: (v) => {
          this.camera.position.lerp(newCameraPos, v);
        }
      });
    } else {
      this.camera.position.copy(newCameraPos);
    }
  }

  separateAreas() {
    const areas: areas[] = ['overview', 'decoder', 'alu', 'memory', 'registers'];

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

                  const signalName = this.getSName(child.id);
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

    // Hide none visible elements
    for (const key of Object.keys(this.idFlat)) {
      if (key.startsWith('focus_') || key.startsWith('areaborder_')) {
        this.nonVisibleMeshes.push(...this.idFlat[key].meshes);
      }
    }

    for (const nonVisibleMesh of this.nonVisibleMeshes) {
      nonVisibleMesh.material.opacity = 0;
    }

    this.scene.add(this.renderGroup);
    this.initHighlightingUsedPaths();
  }

  hideMeshes(meshes, animate = false) {
    if (animate) {
      return this.animateOpacity(meshes, 0);
    } else {
      return new Promise((resolve, reject) => {
        meshes.forEach((mesh) => {
          mesh.material.opacity = 0;
        });
        resolve();
      });
    }
  }

  showMeshes(meshes) {
    const meshesWithoutNonVisibleAreas = meshes.filter((mesh) => !this.nonVisibleMeshes.includes(mesh));
    return this.animateOpacity(meshesWithoutNonVisibleAreas, 1);
  }

  animateOpacity(meshes, opacity) {
    return new Promise((resolve, reject) => {
      const materials = [];
      for (const mesh of meshes) {
        mesh.material ? materials.push(mesh.material) : 0;
      }

      if (materials.length === 0) {
        resolve();
      } else {
        anime({
          targets: materials,
          opacity: opacity,
          duration: 100,
          delay: (el, i, t) => {
            return Math.random() * 200;
          },
          complete: () => {
            resolve();
          }
        });
      }
    })
  }

  initHighlightingUsedPaths() {
    this.cpuInterface.bindings.cycleComplete.subscribe(() => this.updateActiveElements());
  }

  updateActiveElements() {
    const nextCpuState = this.cpuInterface.bindings.nextCpuState.value;

    // Reset all lines
    // Dont show any active lines
    if (nextCpuState === CPU_STATES.FETCH) {
      for (const key of Object.keys(this.idFlat)) {
        const element = this.idFlat[key];
        // Hide all elements when the next decoding stage is incoming
        if (key.startsWith('mux_')) {
          this.animateOpacity(this.idFlat[key].meshes, 0.05);
        }
      }
      // Reset all values
      // @ts-ignore
      Object.values(this.cpuInterface.bindings.volatileValues).forEach((value) => value.next(null));
    }

    // Show decoded active lines if the current executed state was decoding
    if (this.cpuInterface.bindings.instruction.value) {

      /**
       * Checks the idFlat list for mux elements with the given element name.
       * @param element Name which should be included in the id -> 'add' to match 'mux_xor_add' or 'mux_add_lui'
       */
      const checkActiveElementsInGraph = (element: string) => {
        const meshesToActivate = [];
        for (const key of Object.keys(this.idFlat)) {
          // Only match exact word -> 'add' -> match 'add' and not 'addi'
          const regex = new RegExp(`(\b|_)${element.toLowerCase()}(\b|_|$|-)`);
          const keySmall = key.toLowerCase();
          if (keySmall.startsWith('mux_') && regex.test(keySmall)) {
            meshesToActivate.push(...this.idFlat[key].meshes)
          }
        }
        return meshesToActivate;
      };

      // Get list with meshes to activate
      const meshesToActivate = [];
      meshesToActivate.push(...checkActiveElementsInGraph(this.cpuInterface.bindings.instruction.value?.opcodeName));
      meshesToActivate.push(...checkActiveElementsInGraph(this.cpuInterface.bindings.instruction.value?.instructionName));
      // Deactivate all elements with 'mux_' which are currently not on if there are some to activate
      const allMeshes = [];
      for (const key of Object.keys(this.idFlat)) {
        const keySmall = key.toLowerCase();
        if (keySmall.startsWith('mux_')) {
          allMeshes.push(...this.idFlat[key].meshes);
        }
      }
      this.animateOpacity(_.difference(allMeshes, meshesToActivate), 0.05);
    }
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    // TODO: Depends on where the dom is in relation to the other elements
    // Offset left because the dom does not start on the left border
    this.centeredMouse.x = ((event.clientX + this.renderDom.offsetLeft - (window.innerWidth - this.renderDom.clientWidth)) / this.renderDom.clientWidth) * 2 - 1;
    // Offset top because the dom does not start on the edge, additional - offset top because there is a header over all simulation elements
    this.centeredMouse.y = -((event.clientY - this.renderDom.offsetTop - (window.innerHeight - this.renderDom.clientHeight - this.renderDom.offsetTop)) / this.renderDom.clientHeight) * 2 + 1;
  }

  flattenRootToIndexIdArray(root) {
    const ids = [];

    const traverseChildren = (child) => {
      const meshes = [];
      if (child.meshes) meshes.push(...child.meshes);
      if (child.children) for (const deeperChild of child.children) meshes.push(...traverseChildren(deeperChild));
      if (child.id) ids[child.id] = {meshes: meshes, group: child.group};
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

      // Set uniforms for shaders
      this.globalUniforms.u_time.value = this.time;

      // Handle interactability via intersections
      this.handleIntersection();

      this.renderer.render(this.scene, this.camera);
    });
  }

  handleIntersection() {
    // Intersection
    this.raycaster.setFromCamera(this.centeredMouse, this.camera);

    // Show Tooltip on intersection
    const removeTooltip = () => {
      if (this.intersectedElement) {
        // this.intersectedElement.material.color.setHex(this.intersectedElement.currentHex);
        this.tippyTooltip.hide();
      }
      this.tippyTooltip.hide();
      this.intersectedElement = null;
    };
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      const getName = (i) => {
        if (i.parent.parent.name.startsWith('p_')) return {name: i.parent.parent.name, type: 'p'};
        if (i.parent.parent.name.startsWith('m_')) return {name: i.parent.parent.name, type: 'm'};
        if (i.parent.parent.name.startsWith('w_')) return {name: i.parent.parent.name, type: 'w'};
        if (i.parent.name.startsWith('p_')) return {name: i.parent.name, type: 'p'};
        if (i.parent.name.startsWith('m_')) return {name: i.parent.name, type: 'm'};
        if (i.parent.name.startsWith('w_')) return {name: i.parent.name, type: 'w'};
        if (i.name.startsWith('s_')) return {name: i.name, type: 's'};
        if (i.name.startsWith('w_')) return {name: i.name, type: 'w'};
        if (i.name.startsWith('m_')) return {name: i.name, type: 'm'};
      }

      let object;
      for (const intersection of intersects) {
        object = getName(intersection.object);
        if (object) break;
      }

      if (object) {
        if (JSON.stringify(this.intersectedElement) != JSON.stringify(object)) {
          if (this.intersectedElement) {
            this.tippyTooltip.hide();
          }
          this.intersectedElement = object;

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

          let name;
          let id;
          let prevalue;
          let value;
          let desc;
          switch (object.type) {
            case 'w':
            case 's':
              id = this.getSName(object.name) || this.getWName(object.name);
              prevalue = this.cpuInterface.bindings.allValues[id]?.value === undefined ? id : this.cpuInterface.bindings.allValues[id]?.value;
              name = RISCV_DEFINITIONS.signals[id]?.name;
              value = (prevalue === null || prevalue === undefined) ? 'NaN' : prevalue.toString();
              desc = RISCV_DEFINITIONS.signals[id]?.desc;
              this.tippyTooltip.setContent('<strong>' + name + '</strong><br>Value: ' + value + (desc ? '<br>' + desc : ''));
              console.log(object.name, id, name, prevalue, value);
              break;
            case 'm':
              id = this.getModuleName(object.name);
              name = RISCV_DEFINITIONS.modules[id]?.name;
              desc = RISCV_DEFINITIONS.modules[id]?.desc;
              this.tippyTooltip.setContent('<strong>' + name + '</strong>' + (desc ? '<br>' + desc : ''));
              console.log(object.name, id, name);
              break;
            case 'p':
              id = this.getPortName(object.name);
              prevalue = this.cpuInterface.bindings.allValues[id]?.value === undefined ? id : this.cpuInterface.bindings.allValues[id]?.value;
              name = RISCV_DEFINITIONS.ports[id]?.name;
              value = (prevalue === null || prevalue === undefined) ? 'NaN' : prevalue.toString();
              desc = RISCV_DEFINITIONS.ports[id]?.desc;
              this.tippyTooltip.setContent('<strong>' + name + '</strong><br>Value: ' + value + (desc ? '<br>' + desc : ''));
              console.log(object.name, id, name, prevalue, value);
              break;
          }

          this.tippyTooltip.show();
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
  }

  getCenterOfMeshes(meshes: THREE.Mesh[]): THREE.Vector3 {
    for (const mesh of meshes) {
      mesh.geometry.computeBoundingBox();
    }

    const minX = d3.scan(meshes, (a, b) => a.geometry.boundingBox.min.x - b.geometry.boundingBox.min.x);
    const maxX = d3.scan(meshes, (a, b) => b.geometry.boundingBox.max.x - a.geometry.boundingBox.max.x);
    const minY = d3.scan(meshes, (a, b) => a.geometry.boundingBox.min.y - b.geometry.boundingBox.min.y);
    const maxY = d3.scan(meshes, (a, b) => b.geometry.boundingBox.max.y - a.geometry.boundingBox.max.y);
    const minZ = d3.scan(meshes, (a, b) => a.geometry.boundingBox.min.z - b.geometry.boundingBox.min.z);
    const maxZ = d3.scan(meshes, (a, b) => b.geometry.boundingBox.max.z - a.geometry.boundingBox.max.z);

    return new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2)
  }

  getPortName(id) {
    const regex = /(?:p_)(.*?)(?:-|$)/g;
    return this.getFirstGroup(regex, id);
  }

  getSName(id) {
    const regex = /(?:s_)(.*?)(?:-|$)/g;
    return this.getFirstGroup(regex, id);
  }

  getWName(id) {
    const regex = /(?:w_)(.*?)(?:-|$)/g;
    return this.getFirstGroup(regex, id);
  }

  getModuleName(id) {
    const regex = /(?:m_)(.*?)(?:-|$)/g;
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
