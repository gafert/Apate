import { SVGLoader } from './SVGLoader';
import RISC_SVG from '!!raw-loader!./risc_test.svg';
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  ShapeGeometry,
  Vector2,
  Vector3
} from 'three';
import {
  checkNoneColor,
  flattenRootToIndexIdArray,
  IdFlatInterface,
  IdRootInterface,
  Signal
} from './helpers';
import { getSName } from './helperNameMatch';
import { MeshText2D, textAlign } from 'three-text2d';
import * as d3 from 'd3';
import * as tinycolor from 'tinycolor2';
import { Bindings, CPU_STATES } from '../bindingSubjects';
import { hideNonVisibleElements, setColor, setOpacity } from './helperVisibility';
import * as _ from 'lodash';
import { readStyleProperty } from '../../../../utils/helper';
import { IUniform } from 'three/src/renderers/shaders/UniformsLib';
import { MarkerMaterial } from './markerMaterial';
/**
 * Loads the SVG and generates meshes. Does not add anything to the scene.
 */
export default function initiateSVGObjects(globalUniforms: { [uniform: string]: IUniform }): { idRoot: IdRootInterface; idFlat: IdFlatInterface; renderGroup: Group } {
  const loader = new SVGLoader();
  const idRoot: IdRootInterface = loader.parse(RISC_SVG).root;
  const renderGroup = new Group();

  // SVG transforms -> boundingBox may not be accurate use centerOfMeshes instead
  renderGroup.scale.multiplyScalar(0.25);
  renderGroup.position.x = 0;
  renderGroup.position.y = 0;
  renderGroup.scale.y *= -1;

  idRoot.group = renderGroup;

  const generateChildren = (parent: IdRootInterface, childGroup) => {
    const children: IdRootInterface[] = parent.children;
    for (const child of children) {
      // Only generate meshes for non idRoot as in elements which have no children
      if (!child.children) {
        if (child.path) {
          const path = child.path;
          const meshes: Mesh[] = [];

          if (path.userData.style.fill && path.userData.style.fill !== 'none') { // && child.id === 'alu'
            const fillColor = tinycolor(checkNoneColor(path.userData.style.fill));

            const shapes = path.toShapes(true);
            for (let j = 0; j < shapes.length; j++) {
              const shape = shapes[j];
              const geometry = new ShapeGeometry(shape);
              // const geometry = new ExtrudeGeometry(shape, {depth: 50, bevelEnabled: false});

              // Compute uvscomputeUVsOfPlane(geometry);

              const shaderMaterial = new MarkerMaterial({
                color: new Color().setStyle(fillColor.toHexString()),
                globalUniforms: globalUniforms,
                opacity: (path.userData.style.fillOpacity !== undefined ? path.userData.style.fillOpacity : 1) * (path.userData.style.opacity !== undefined ? path.userData.style.opacity : 1) * fillColor.getAlpha(),
              });

              const mesh = new Mesh(geometry, shaderMaterial);
              // mesh.translateZ(-51); // Compensate depth of extruded element and behind strokes

              mesh.name = child.id;
              childGroup.add(mesh);
              meshes.push(mesh);
            }
          }
          if (path.userData.style.stroke && path.userData.style.stroke !== 'none') {
            const strokeColor = tinycolor(checkNoneColor(path.userData.style.stroke));

            const shaderMaterial = new MarkerMaterial({
              color: new Color().setStyle(strokeColor.toHexString()),
              globalUniforms: globalUniforms,
              opacity: path.userData.style.strokeOpacity * (path.userData.style.opacity ? path.userData.style.opacity : 1) * strokeColor.getAlpha(),
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
              const subPath = path.subPaths[j];
              const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
              if (geometry) {
                const mesh = new Mesh(geometry, shaderMaterial);
                childGroup.add(mesh);
                mesh.name = child.id;
                meshes.push(mesh);
              }
            }
          }
          child.meshes = meshes;
          child.isGroup = false;
          child.group = childGroup;
          child.parent = parent;
        }
        if (child.text) {
          const style = child.text.userData.style;
          const text = new MeshText2D(child.text.text, {
            align: new Vector2(1, 1.7), // Point is a bit further down
            font: (style.fontWeight ? style.fontWeight : '') + ' ' + style.fontSize * 4 + 'px ' + style.fontFamily,
            fillStyle: style.fill,
            antialias: true
          });

          text.scale.set(0.25, -0.25, 0.25);
          text.position.copy(child.text.userData.position);

          // Render that text
          childGroup.add(text);

          // Store it for us to
          child.meshes = [];
          child.meshes.push(text.mesh);
          child.isGroup = false;
          child.group = childGroup;
          child.parent = parent;
        }
      } else {
        const newChildGroup = new Group();
        newChildGroup.name = child.id;
        child.group = newChildGroup;
        child.isGroup = true;
        generateChildren(child, newChildGroup);
        childGroup.add(newChildGroup);
      }
    }
  };

  generateChildren(idRoot, renderGroup);

  const idFlat = flattenRootToIndexIdArray(idRoot);

  hideNonVisibleElements(idFlat);

  /**
   * Moves meshes inside a "bg_" element 2 units to the back
   * @param idFlat
   */
  const setBackBackgroundElements = (idFlat: IdFlatInterface) => {
    for (const key of Object.keys(idFlat)) {
      if (key.startsWith('bg_')) {
        idFlat[key].meshes.forEach(mesh => {
          mesh.position.multiply(new Vector3(0, 0, 2));
        });
      }
    }
  };

  setBackBackgroundElements(idFlat);

  return { idFlat, idRoot, renderGroup };
}

export function updateActiveElements(cpuBindings: Bindings, idFlat: IdFlatInterface, animateTransition: boolean) {
  const nextCpuState = cpuBindings.nextCpuState.value;

  // Reset all lines
  // Dont show any active lines
  if (nextCpuState === CPU_STATES.FETCH) {
    for (const key of Object.keys(idFlat)) {
      // Hide all elements when the next decoding stage is incoming
      if (key.startsWith('mux_')) {
        setOpacity(idFlat[key].meshes, 1, animateTransition);
      }
    }
    // Reset all values
    cpuBindings.clearAllVolatileValues();
  }

  // Show decoded active lines if the current executed state was decoding
  if (cpuBindings.instruction.value) {

    /**
     * Checks the idFlat list for mux elements with the given element name.
     * @param element Name which should be included in the id -> 'add' to match 'mux_xor_add' or 'mux_add_lui'
     */
    const checkActiveElementsInGraph = (element: string) => {
      const meshesToActivate = [];
      for (const key of Object.keys(idFlat)) {
        // Only match exact word -> 'add' -> match 'add' and not 'addi'
        const regex = new RegExp(`(\b|_)${element.toLowerCase()}(\b|_|$|-)`);
        const keySmall = key.toLowerCase();
        if (keySmall.startsWith('mux_') && regex.test(keySmall)) {
          meshesToActivate.push(...idFlat[key].meshes);
        }
      }
      return meshesToActivate;
    };

    // Get list with meshes to activate
    const meshesToActivate = [];
    meshesToActivate.push(...checkActiveElementsInGraph(cpuBindings.instruction.value?.opcodeName));
    meshesToActivate.push(...checkActiveElementsInGraph(cpuBindings.instruction.value?.instructionName));
    // Deactivate all elements with 'mux_' which are currently not on if there are some to activate
    const allMeshes = [];
    for (const key of Object.keys(idFlat)) {
      const keySmall = key.toLowerCase();
      if (keySmall.startsWith('mux_')) {
        allMeshes.push(...idFlat[key].meshes);
      }
    }
    setOpacity(_.difference(allMeshes, meshesToActivate), 0.05, animateTransition);
  }
}

/**
 * Add text meshes to all signals with ids "s_*" and updates them if that said signal is changed and inside the {@link Bindings.allValues | cpu.bindings.allValues}
 * @param cpuBindings CPU Bindings to subscribe to
 * @param idFlat idFlat to lookup signals. Attention: This object will be refilled after the signal texts were added.
 * @param idRoot idRoot to regenerate idFlat after mesh was added.
 * @param updateTexts Pass object with update property. Object so it can be references.
 * @return Returns a list of all signals with test, meshes and binding
 */
export function addSignalTextsAndUpdate(cpuBindings: Bindings, idFlat: IdFlatInterface, idRoot: IdRootInterface, updateTexts: { updateSignalTexts: boolean }): Signal[] {
  const signals: Signal[] = [];

  for (const key of Object.keys(idFlat)) {

    if (!idFlat[key]?.meshes[0]) {
      continue;
    }

    let signalName = getSName(key);

    if (signalName) {
      // This is a string, tell typescript
      signalName = signalName as string;
      const meshOfSignal = idFlat[key].meshes[0];
      const geometry = (meshOfSignal.geometry as BufferGeometry);
      const renderGroup = idFlat[key].group;

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

      const binding = cpuBindings.allValues[signalName];
      if (binding) {
        binding.subscribe((value) => {
          if (updateTexts.updateSignalTexts)
            text.text = (value === null || value === undefined) ? 'NaN' : value.toString();
        });
      }

      // Render it
      renderGroup.add(text);
      // Get position at root ref
      idFlat[key].rootRef.meshes.push(text.mesh);
      // Return list of texts for later reference
      signals.push({ textElement: text, meshes: (idFlat[key].rootRef.meshes), binding: binding });
    }
  }

  // Replace all elements in idFlat but dont destroy its reference
  Object.keys(idFlat).forEach(function(key) {
    delete idFlat[key];
  });
  flattenRootToIndexIdArray(idRoot, idFlat);

  return signals;
}

/**
 * Update all signal texts manually.
 * Used if automatic updating was disabled previously
 * @param signals List of all signals
 */
export function updateSignalTexts(signals: Signal[]) {
  for (const signal of signals) {
    if (signal.binding) {
      const value = signal.binding.value;
      signal.textElement.text = (value === null || value === undefined) ? 'NaN' : value.toString();
    }
  }
}

export function highlightStage(idFlat: IdFlatInterface, cpuStage: CPU_STATES | boolean, animateTransition: boolean) {
  const colorAccent = readStyleProperty('accent');
  const colorGrey = readStyleProperty('grey1');

  for (const key of Object.keys(idFlat)) {
    if (key.startsWith('stagebox_') && !key.startsWith('stagebox_' + cpuStage)) {
      setColor(idFlat[key].meshes, colorGrey, animateTransition);
    } else if (key.startsWith('stagebox_' + cpuStage)) {
      setColor(idFlat[key].meshes, colorAccent, animateTransition);
    }
  }
}
