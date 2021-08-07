import {SVGLoader} from './SVGLoader';
import RISC_SVG from '!!raw-loader!./riscv.svg';
import {
  Color,
  LineBasicMaterial,
  LineSegments,
  LoadingManager,
  Mesh,
  Object3D,
  PlaneGeometry,
  ShapeGeometry,
  TextureLoader,
  WireframeGeometry,
} from 'three';
import {checkNoneColor, flattenRootToIndexIdArray, IdFlatInterface, IdRootInterface, Signal} from './helpers';
import {getSName} from './helperNameMatch';
import * as d3 from 'd3';
import * as tinycolor from 'tinycolor2';
import {Bindings, CPU_STATES} from '../cpuServiceHelpers/bindingSubjects';
import {hideNonVisibleElements, setColor, setOpacity} from './helperVisibility';
import * as _ from 'lodash';
import {readStyleProperty} from '../../utils/helper';
import {IUniform} from 'three/src/renderers/shaders/UniformsLib';
import {MarkerMaterial} from './MarkerMaterial';
import SVG_IDS from '../../../bundled/yamls/ids.yml';
import {MSDFFont} from "./msdf/MSDFFont";


/**
 * Loads the SVG and generates meshes. Does not add anything to the scene.
 */
export default function initiateSVGObjects(globalUniforms: { [uniform: string]: IUniform }): { idRoot: IdRootInterface; idFlat: IdFlatInterface; renderGroup: Object3D } {
  const loader = new SVGLoader(new LoadingManager());
  const idRoot: IdRootInterface = loader.parse(RISC_SVG).root as IdRootInterface;
  const renderGroup = new Object3D();


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
              // computeUVsOfPlane(geometry);

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
              const geometry = loader.pointsToStroke(subPath.getPoints(), path.userData.style);
              if (geometry) {
                const mesh = new Mesh(geometry, shaderMaterial);
                childGroup.add(mesh);
                mesh.name = child.id;
                meshes.push(mesh);
              }
            }
          }
          child.meshes = meshes;
          // child.isGroup = false;
          child.group = childGroup;
          child.parent = parent;
        }
        if (child.text) {
          const style = child.text.userData.style;

          const text = new MSDFFont(child.text.text, 1, new Color(style.fill), style.fontSize, style.fontWeight);

          // @ts-ignore
          text.geometry.computeBoundingBox();
          child.text.userData.position.y -= style.fontSize / 1.5;
          text.position.copy(child.text.userData.position)
          text.scale.y *= -1;

          // Render that text
          childGroup.add(text);

          // Store it for us to
          child.meshes = [];
          child.meshes.push(text);
          // child.meshes.push(meshRect as unknown as Mesh<BufferGeometry, Material>);

          // child.isGroup = false;
          child.group = childGroup;
          child.parent = parent;
        }
      } else {
        const newChildGroup = new Object3D();
        newChildGroup.name = child.id;
        child.group = newChildGroup;
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
      if (key.startsWith(SVG_IDS.backgroundID)) {
        idFlat[key].meshes.forEach(mesh => {
          mesh.translateZ(-2);
          mesh.renderOrder = 3; // After all other things
        });
      }
    }
  };

  setBackBackgroundElements(idFlat);

  return {idFlat, idRoot, renderGroup};


}

/**
 * Get all meshes
 */
export function getAllMeshes(idFlat: IdFlatInterface) {
  // Deactivate all elements with 'mux_' which are currently not on if there are some to activate
  const allMeshes = [];
  for (const key of Object.keys(idFlat)) {
    allMeshes.push(...idFlat[key].meshes);
  }

  return _.uniq(allMeshes);
}

/**
 * Get all elements which are active and dependant on the current instruction
 * @param cpuBindings
 * @param idFlat
 */
export function getActiveMuxedMeshes(cpuBindings: Bindings, idFlat: IdFlatInterface) {

  if (!cpuBindings.instruction.value) {
    return []; // No instruction -> nothing can be active
  }

  /**
   * Checks the idFlat list for mux elements with the given element name.
   * @param element Name which should be included in the id -> 'add' to match 'mux_xor_add' or 'mux_add_lui'
   */
  const checkActiveElementsInGraph = (element: string) => {
    const activeMeshes = [];
    // Only match exact word -> 'add' -> match 'add' and not 'addi'
    const regex = new RegExp(`(\b|_)${element.toLowerCase()}(\b|_|$|-)`);
    for (const key of Object.keys(idFlat)) {
      const keySmall = key.toLowerCase();
      if (keySmall.startsWith(SVG_IDS.muxGroupID) && regex.test(keySmall)) {
        activeMeshes.push(...idFlat[key].meshes);
      }
    }
    return activeMeshes;
  };

  // Get list with meshes to activate
  const activeMeshes = [];
  activeMeshes.push(...checkActiveElementsInGraph(cpuBindings.instruction.value.opcodeName));
  activeMeshes.push(...checkActiveElementsInGraph(cpuBindings.instruction.value.instructionName));

  return _.uniq(activeMeshes);
}

/**
 * Get all meshes which are dependant on the instruciton
 */
export function getAllMuxedMeshes(idFlat: IdFlatInterface) {
  // Deactivate all elements with 'mux_' which are currently not on if there are some to activate
  const allMeshes = [];
  for (const key of Object.keys(idFlat)) {
    const keySmall = key.toLowerCase();
    if (keySmall.startsWith(SVG_IDS.muxGroupID)) {
      allMeshes.push(...idFlat[key].meshes);
    }
  }

  return _.uniq(allMeshes);
}


/**
 * Get all meshes which should be deactivated in the current instruction
 * @param cpuBindings
 * @param idFlat
 */
export function getDeactivatedMuxedMeshes(cpuBindings: Bindings, idFlat: IdFlatInterface) {
  return _.difference(getAllMuxedMeshes(idFlat), getActiveMuxedMeshes(cpuBindings, idFlat));
}

export function updateActiveElements(cpuBindings: Bindings, idFlat: IdFlatInterface, animateTransition: boolean) {
  // Show decoded active lines if the current executed state was decoding
  if (cpuBindings.instruction.value) {
    setOpacity(getActiveMuxedMeshes(cpuBindings, idFlat), 1, animateTransition);
    setOpacity(getDeactivatedMuxedMeshes(cpuBindings, idFlat), 0.05, animateTransition);
  } else {
    setOpacity(getAllMuxedMeshes(idFlat), 0.05, animateTransition);
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
      const geometry = meshOfSignal.geometry;
      const renderGroup = idFlat[key].group;

      const text = new MSDFFont(signalName, 1, new Color(0xffffff), 10);
      text.scale.y *= -1;

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

      text.position.set(positions[leftes].x + 3, positions[leftes].y + 5, positions[leftes].z);

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
      idFlat[key].rootRef.meshes.push(text);
      // Return list of texts for later reference
      // @ts-ignore
      signals.push({textElement: text, meshes: (idFlat[key].rootRef.meshes), binding: binding});
    }
  }

  // Replace all elements in idFlat but dont destroy its reference
  Object.keys(idFlat).forEach(function (key) {
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
    if (key.startsWith(SVG_IDS.stageBoxID) && !key.startsWith(SVG_IDS.stageBoxID + cpuStage)) {
      setColor(idFlat[key].meshes, colorGrey, animateTransition);
    } else if (key.startsWith(SVG_IDS.stageBoxID + cpuStage)) {
      setColor(idFlat[key].meshes, colorAccent, animateTransition);
    }
  }
}
