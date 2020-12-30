import {Injectable, NgZone} from '@angular/core';
import {
  Box3,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShapeBufferGeometry,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'THREE';
import panzoom from '../../utils/drag.js';
import {CPUService} from './cpu.service';
import {SVGLoader} from './graphHelpers/SVGLoader';
import RISC_SVG from '!!raw-loader!./graphHelpers/risc_test.svg';
import * as tinycolor from 'tinycolor2';
import {animate, easeIn, linear} from 'popmotion';
import * as _ from 'lodash';
import {CPU_STATES} from './bindingSubjects';
import {MeshText2D, textAlign} from 'three-text2d';
import * as d3 from 'd3';
import tippy, {Instance, Props} from 'tippy.js';
import RISCV_DEFINITIONS from '../../yamls/risc.yml';
import TABS from '../../yamls/tabs.yml';

interface THREENode {
  meshes: Mesh[];
  id: string;
  node: Element;
  children: THREENode[];
  group: Group;
}

interface IdFlatInterface {
  [key: string]: { meshes: Mesh[]; group: Group };
}

type areas = 'overview' | 'decoder' | 'alu' | 'memory' | 'registers';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  public initiated = false;

  // Target where the canvas will be put
  // Canvas will fill this dom
  private renderDom;

  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private scene: Scene;

  // Set by requestAnimationFrame to render next frame
  private frameId: number;

  private time = 0;
  private clock = new Clock();
  private globalUniforms = {
    u_time: {type: 'f', value: 0},
    u_resolution: {type: 'vec2', value: new Vector2(0, 0)}
  };

  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];

  private renderGroup; // Holds the meshes in js groups named according to svg names
  private idRoot: THREENode; // Holds the parsed svg and adds meshes to each element
  private idFlat: IdFlatInterface; // Takes the parsed svg with meshes and flattens all names to be a 1D array
  private idMaterials = [];
  private nonVisibleMeshes = [];

  // Intersection related
  // centeredMouse is update once the mouse is moved, so set start to value which never could be to prevent
  // intersection on 0,0 before mouse is moved
  private centeredMouse = new Vector2(-10000, -10000);
  private mouse = new Vector2(-10000, -10000);
  private intersectedElement;
  private raycaster: Raycaster;
  private tippyTooltip: Instance<Props>;

  public currentArea: areas;

  private focusAnimation;

  public globalAnimationDisabled = false;

  constructor(private ngZone: NgZone, private cpu: CPUService) {
    console.log("Initiated GraphService");
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

    this.globalUniforms.u_resolution.value = new Vector2(width, height);
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
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.outline = 'none';
        domElement.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
        this.camera.position.z = 50;

        // Setup scene with light
        const color = 0xffffff;
        const intensity = 1;
        const light = new DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

        // Initiate objects from svg
        this.initiateObjects();

        // For intersection
        this.raycaster = new Raycaster();
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
        // this.separateAreas();
        this.goToArea('overview');

        // Set initiated to true to not reload settings if init was called again by component using the service
        this.initiated = true;

        // for (const key of Object.keys(this.idFlat)) {
        //   if (key === 'area_cu')
        //     if (this.idFlat[key].meshes.length !== 0) {
        //       const {center, box} = this.getCenterOfMeshes(this.idFlat[key].meshes);
        //
        //       // Test sphere
        //       const geometry = new SphereGeometry(1, 10);
        //       const material = new MeshLambertMaterial({
        //         color: 0xffff00
        //       });
        //       const sphere = new Mesh(geometry, material);
        //       sphere.position.copy(center);
        //       this.scene.add(sphere);
        //
        //       // Test sphere
        //       const size = new Vector3();
        //       box.getSize(size);
        //       const geometry1 = new PlaneGeometry(size.x, size.y);
        //       const material1 = new MeshLambertMaterial({
        //         color: 0xffff00
        //       });
        //       material1.transparent = true;
        //       material1.opacity = 0.05;
        //       const sphere1 = new Mesh(geometry1, material1);
        //       sphere1.position.copy(center);
        //       this.scene.add(sphere1);
        //     }
        // }
      }
    });
  }

  public focusOnElement(state): Promise<unknown> {
    // Block if change comes too early
    if (!this.idFlat) return;
    return this.focusCameraOnElement('focus_' + state, true);
  }

  public async goToArea(newArea, animateTransition?) {
    // Block if change comes too early
    if (!this.idFlat || newArea === this.currentArea) return;

    animateTransition = animateTransition && !this.globalAnimationDisabled;

    // If one goes back to the overview the reverse animation will be shown
    const reverse = newArea == 'overview';
    // If the transition is from sub to another sub disable animation
    if (!reverse && this.currentArea !== 'overview') animateTransition = false;
    // Get the animation element if animateTransitions is on
    const animationElement = animateTransition ? TABS[reverse ? this.currentArea : newArea] : null;

    // Hide elements of current area only if there is one selected, else skip this and only show
    this.hideElement('area_' + newArea, false);

    if (animationElement && !reverse) {
      await Promise.all([new Promise((resolve) => {
        const {center} = this.getCenterOfMeshes(this.idFlat[animationElement].meshes);
        animate({
          from: 0,
          to: 1,
          ease: linear,
          duration: 1000,
          onUpdate: (v) => this.camera.position.lerp(center, v),
          onComplete: () => resolve()
        });
      }), this.hideElement('area_' + this.currentArea, true)]);

      // Focus on new area
      this.focusCameraOnElement('areaborder_' + newArea, false);

      // This can be async as the camera can move now
      // Show meshes at new location
      this.showElement('area_' + newArea, true).then(() => this.updateActiveElements())

    } else if (animationElement && reverse) {
      await this.hideElement('area_' + this.currentArea, true);
      this.focusCameraOnElement('areaborder_' + newArea, false);

      // Show meshes at new location async
      this.showElement('area_' + newArea, true).then(() => this.updateActiveElements())

      // Lerp camera from center of animationElement to full view
      const {center} = this.getCenterOfMeshes(this.idFlat[animationElement].meshes);
      this.camera.position.copy(center);
      await this.focusCameraOnElement('areaborder_' + newArea, true);
    } else {
      if (this.globalAnimationDisabled)
        this.hideElement('area_' + this.currentArea, false);
      else
        await this.hideElement('area_' + this.currentArea, true);
      this.focusCameraOnElement('areaborder_' + newArea, false);
      this.showElement('area_' + newArea, true).then(() => this.updateActiveElements())
    }

    this.currentArea = newArea;
  }

  initiateObjects() {
    const loader = new SVGLoader();
    this.idRoot = loader.parse(RISC_SVG).root;

    this.renderGroup = new Group();
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
            const meshes: Mesh[] = [];
            if (path.userData.style.fill && path.userData.style.fill !== 'none') {
              const fillColor = tinycolor(this.checkColor(path.userData.style.fill));
              const material = new MeshBasicMaterial({
                color: new Color().setStyle(fillColor.toHexString()),
                opacity: path.userData.style.fillOpacity * (path.userData.style.opacity ? path.userData.style.opacity : 1) * fillColor.getAlpha(),
                transparent: true,
                side: DoubleSide,
                depthWrite: false
              });
              const shapes = path.toShapes(true);
              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new ShapeBufferGeometry(shape);
                const mesh = new Mesh(geometry, material);
                mesh.name = child.id;
                childGroup.add(mesh);
                meshes.push(mesh);
              }
            }
            if (path.userData.style.stroke && path.userData.style.stroke !== 'none') {
              const strokeColor = tinycolor(this.checkColor(path.userData.style.stroke));
              const material1 = new MeshBasicMaterial({
                color: new Color().setStyle(strokeColor.toHexString()),
                opacity: path.userData.style.strokeOpacity * (path.userData.style.opacity ? path.userData.style.opacity : 1) * strokeColor.getAlpha(),
                transparent: true,
                side: DoubleSide,
                depthWrite: false
              });

              for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                const subPath = path.subPaths[j];
                const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                if (geometry) {
                  const mesh = new Mesh(geometry, material1);
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

                    const binding = this.cpu.bindings.allValues[signalName];
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

  setOpacity<B extends boolean>(meshes: Mesh[], opacity, animateTransition: B): B extends true ? Promise<unknown> : void;
  setOpacity(meshes, opacity, animateTransition = true): Promise<unknown> | void {
    if (animateTransition) {
      return new Promise((resolve) => {
        for (const mesh of meshes) {
          animate({
            from: mesh.material.opacity,
            to: opacity,
            duration: 200,
            elapsed: -Math.random() * 200,
            onUpdate: (v) => mesh.material.opacity = v,
            onComplete: () => {
              resolve();
            }
          });
        }
      })
    } else {
      for (const mesh of meshes) {
        mesh.material.opacity = opacity;
      }
    }
  }

  hideElement<B extends boolean>(id: string, animate: B): B extends true ? Promise<unknown> : void;
  hideElement<B extends boolean>(meshes: Mesh[], animate: B): B extends true ? Promise<unknown> : void;
  hideElement(idOrMesh, animate = false): Promise<unknown> | void {
    let meshes: Mesh[];
    if (typeof idOrMesh == "string") {
      meshes = this.idFlat[idOrMesh]?.meshes
    } else if (typeof idOrMesh == "object") {
      meshes = idOrMesh;
    }

    if (!meshes) {
      console.error("Could not find mesh or id", idOrMesh)
      return;
    }

    return this.setOpacity(meshes, 0, animate);
  }

  showElement<B extends boolean>(id: string, animate: B): B extends true ? Promise<unknown> : void;
  showElement<B extends boolean>(meshes: Mesh[], animate: B): B extends true ? Promise<unknown> : void;
  showElement(idOrMesh, animate = false): Promise<unknown> | void {
    let meshes: Mesh[];
    if (typeof idOrMesh == "string") {
      meshes = this.idFlat[idOrMesh]?.meshes
    } else if (typeof idOrMesh == "object") {
      meshes = idOrMesh;
    }

    if (!meshes) {
      console.error("Could not find mesh or id", idOrMesh)
      return;
    }

    const meshesWithoutNonVisibleAreas = meshes.filter((mesh) => !this.nonVisibleMeshes.includes(mesh));

    return this.setOpacity(meshesWithoutNonVisibleAreas, 1, animate);
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
      console.log(intersects);

      const getName = (i) => {
        if (i?.parent?.parent?.name?.startsWith('p_')) return {name: i.parent.parent.name, type: 'p'};
        if (i?.parent?.parent?.name?.startsWith('m_')) return {name: i.parent.parent.name, type: 'm'};
        if (i?.parent?.parent?.name?.startsWith('w_')) return {name: i.parent.parent.name, type: 'w'};
        if (i?.parent?.name?.startsWith('p_')) return {name: i.parent.name, type: 'p'};
        if (i?.parent?.name?.startsWith('m_')) return {name: i.parent.name, type: 'm'};
        if (i?.parent?.name?.startsWith('w_')) return {name: i.parent.name, type: 'w'};
        if (i?.name?.startsWith('s_')) return {name: i.name, type: 's'};
        if (i?.name?.startsWith('w_')) return {name: i.name, type: 'w'};
        if (i?.name?.startsWith('m_')) return {name: i.name, type: 'm'};
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
              prevalue = this.cpu.bindings.allValues[id]?.value === undefined ? id : this.cpu.bindings.allValues[id]?.value;
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
              prevalue = this.cpu.bindings.allValues[id]?.value === undefined ? id : this.cpu.bindings.allValues[id]?.value;
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

  initHighlightingUsedPaths() {
    this.cpu.bindings.cycleComplete.subscribe(() => this.updateActiveElements());
  }

  updateActiveElements() {
    const nextCpuState = this.cpu.bindings.nextCpuState.value;

    console.log("WHat is ths", this.globalAnimationDisabled);

    // Reset all lines
    // Dont show any active lines
    if (nextCpuState === CPU_STATES.FETCH) {
      for (const key of Object.keys(this.idFlat)) {
        // Hide all elements when the next decoding stage is incoming
        if (key.startsWith('mux_')) {
          this.setOpacity(this.idFlat[key].meshes, 1, !this.globalAnimationDisabled);
          console.log(this.globalAnimationDisabled);
        }
      }
      // Reset all values
      // @ts-ignore
      Object.values(this.cpu.bindings.volatileValues).forEach((value) => value.next(null));
    }

    // Show decoded active lines if the current executed state was decoding
    if (this.cpu.bindings.instruction.value) {

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
      meshesToActivate.push(...checkActiveElementsInGraph(this.cpu.bindings.instruction.value?.opcodeName));
      meshesToActivate.push(...checkActiveElementsInGraph(this.cpu.bindings.instruction.value?.instructionName));
      // Deactivate all elements with 'mux_' which are currently not on if there are some to activate
      const allMeshes = [];
      for (const key of Object.keys(this.idFlat)) {
        const keySmall = key.toLowerCase();
        if (keySmall.startsWith('mux_')) {
          allMeshes.push(...this.idFlat[key].meshes);
        }
      }
      this.setOpacity(_.difference(allMeshes, meshesToActivate), 0.05, !this.globalAnimationDisabled);
    }
    console.log("Updated active elements with instruction ", this.cpu.bindings.instruction.value);
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
    const ids: IdFlatInterface = {};

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

  getCenterOfMeshes(meshes: Mesh[]): { center: Vector3; size: Vector3; box: Box3 } {
    const bboxes = [];

    for (const mesh of meshes) {
      mesh.geometry.computeBoundingBox();
      bboxes.push(new Box3().setFromObject(mesh));
      // console.log(mesh.geometry.boundingBox)
    }

    const minX = bboxes[d3.scan(bboxes, (a, b) => a.min.x - b.min.x)].min.x;
    const maxX = bboxes[d3.scan(bboxes, (a, b) => b.max.x - a.max.x)].max.x;
    const minY = bboxes[d3.scan(bboxes, (a, b) => a.min.y - b.min.y)].min.y;
    const maxY = bboxes[d3.scan(bboxes, (a, b) => b.max.y - a.max.y)].max.y;
    const minZ = bboxes[d3.scan(bboxes, (a, b) => a.min.z - b.min.z)].min.z;
    const maxZ = bboxes[d3.scan(bboxes, (a, b) => b.max.z - a.max.z)].max.z;

    const center = new Vector3();
    const size = new Vector3();
    const box = new Box3(new Vector3(minX, minY, minZ), new Vector3(maxX, maxY, maxZ));
    box.getCenter(center)
    box.getSize(size);
    return {center, size, box}
  }

  private focusCameraOnElement<B extends boolean>(meshes: Mesh[], enableAnimation: B): B extends true ? Promise<unknown> : void;
  private focusCameraOnElement<B extends boolean>(id: string, enableAnimation: B): B extends true ? Promise<unknown> : void;
  private focusCameraOnElement(idOrMesh, enableAnimation = false): Promise<unknown> | void {
    let meshes: Mesh[];
    if (typeof idOrMesh == "string") {
      meshes = this.idFlat[idOrMesh]?.meshes
    } else if (typeof idOrMesh == "object") {
      meshes = idOrMesh;
    }

    if (!meshes) return;

    const {center, size, box} = this.getCenterOfMeshes(meshes);

    const padding = 0;
    const w = size.x + padding;
    const h = size.y + padding;

    const fovX = this.camera.fov * this.camera.aspect;
    const fovY = this.camera.fov;

    // TODO: 1.1???
    const distanceX = (w / 2) / Math.tan(Math.PI * fovX / 360 / 1.1);
    const distanceY = (h / 2) / Math.tan(Math.PI * fovY / 360 / 1.1);

    const distance = Math.max(distanceX, distanceY);

    const newCameraPos = center.clone();
    newCameraPos.z = newCameraPos.z + distance;

    this.focusAnimation?.stop();
    // Lerp to new position if animate is true, otherwise move instantly
    if (enableAnimation) {
      return new Promise(resolve => {
        this.focusAnimation = animate({
          from: 0,
          to: 1,
          ease: easeIn,
          duration: 1000,
          onUpdate: (v) => {
            this.camera.position.lerp(newCameraPos, v);
          },
          onComplete: () => resolve()
        });
      });
    } else {
      this.camera.position.copy(newCameraPos);
    }
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
