import {Color, Geometry, Material, Mesh, MeshBasicMaterial} from 'three';
import {animate} from 'popmotion';
import {IdFlatInterface} from './helpers';
import SVG_IDS from '../../../bundled/yamls/ids.yml';
import * as _ from "lodash";

const nonVisibleMeshes: Mesh[] = []; // Set once
let highlightedElements = []; // Cleared sometimes

/**
 * Set the render to the opacity
 * @param mesh
 * @param newOpacity
 */
function setZIndexOnOpacityChange(mesh: Mesh<Geometry, Material>, newOpacity) {
  mesh.renderOrder = newOpacity;
}

export function setOpacity<B extends boolean>(meshes: Mesh[], opacity, animateTransition: B): B extends true ? Promise<unknown> : void;
export function setOpacity(meshes, opacity, animateTransition = true): Promise<unknown> | void {
  meshes = _.uniq(meshes);
  if (animateTransition) {
    return new Promise((resolve) => {
      for (const mesh of meshes) {
        setZIndexOnOpacityChange(mesh, opacity);
        animate({
          from: mesh.material.opacity,
          to: opacity,
          duration: 200,
          elapsed: 0,
          onUpdate: (v) => mesh.material.opacity = v,
          onComplete: () => {
            resolve();
          }
        });
      }
    });
  } else {
    for (const mesh of meshes) {
      setZIndexOnOpacityChange(mesh, opacity);
      mesh.material.opacity = opacity;
    }
  }
}

/**
 * Set the material color of meshes
 * @param meshes The meshes to change material color of
 * @param color Hex color value like "#fefefe"
 * @param animateTransition If the transition should be animated
 */
export function setColor<B extends boolean>(meshes: Mesh[], color, animateTransition: B): B extends true ? Promise<unknown> : void;
export function setColor(meshes, color, animateTransition = true): Promise<unknown> | void {
  meshes = _.uniq(meshes);
  if (animateTransition) {
    return new Promise((resolve) => {
      for (const mesh of meshes) {
        animate({
          from: '#' + mesh.material.color.getHexString(),
          to: color,
          duration: 200,
          onUpdate: (v) => mesh.material.color = new Color(v),
          onComplete: () => {
            resolve();
          }
        });
      }
    });
  } else {
    for (const mesh of meshes) {
      mesh.material.color = new Color(color);
    }
  }
}

export function hideElement<B extends boolean>(idFlat: IdFlatInterface, id: string, animate: B): B extends true ? Promise<unknown> : void;
export function hideElement<B extends boolean>(idFlat: IdFlatInterface, meshes: Mesh[], animate: B): B extends true ? Promise<unknown> : void;
export function hideElement(idFlat: IdFlatInterface, idOrMesh, animate = false): Promise<unknown> | void {
  let meshes: Mesh[];
  if (typeof idOrMesh == 'string') {
    meshes = idFlat[idOrMesh]?.meshes;
  } else if (typeof idOrMesh == 'object') {
    meshes = idOrMesh;
  }

  if (!meshes) {
    console.error('Could not find mesh or id', idOrMesh);
    return;
  }

  return setOpacity(meshes, 0, animate);
}

export function showElement<B extends boolean>(idFlat: IdFlatInterface, id: string, animate: B, opacity?: number): B extends true ? Promise<unknown> : void;
export function showElement<B extends boolean>(idFlat: IdFlatInterface, meshes: Mesh[], animate: B, opacity?: number): B extends true ? Promise<unknown> : void;
export function showElement(idFlat, idOrMesh, animate = false, opacity = 1): Promise<unknown> | void {
  let meshes: Mesh[];
  if (typeof idOrMesh == 'string') {
    meshes = idFlat[idOrMesh]?.meshes;
  } else if (typeof idOrMesh == 'object') {
    meshes = idOrMesh;
  }

  if (!meshes) {
    console.error('Could not find mesh or id', idOrMesh);
    return;
  }

  const meshesWithoutNonVisibleAreas = meshes.filter((mesh) => !nonVisibleMeshes.includes(mesh));

  return setOpacity(meshesWithoutNonVisibleAreas, opacity, animate);
}


export function highLightElement(idFlat: IdFlatInterface, id: string, temporary?: boolean): void;
export function highLightElement(idFlat: IdFlatInterface, meshes: Mesh[], temporary?: boolean): void;

/**
 * Highlight specific meshes in the graph
 * @param idFlat
 * @param idOrMesh String of the mesh id or a list of meshes
 * @param temporary If temporary is true everything can be reset with resetHighlights
 */
export function highLightElement(idFlat, idOrMesh, temporary = false): void {
  let meshes: Mesh[];
  if (typeof idOrMesh == 'string') {
    meshes = idFlat[idOrMesh]?.meshes;
  } else if (typeof idOrMesh == 'object') {
    meshes = idOrMesh;
  }

  if (!meshes) {
    console.error('Could not find mesh or id', idOrMesh);
    return;
  }

  // Save which are currently highlighted
  if(!temporary) highlightedElements.push(..._.uniq(meshes));

  for (const mesh of meshes) {
    if ((mesh.material as any).isMarkerMaterial) {
      (mesh.material as any).highlight = 1;
    }
  }
}

/**
 * Remove all highlights from the graph
 * @param idFlat
 * @param temporary If temporary is true everything can be reset with resetHighlights
 */
export function removeAllHighlights(idFlat: IdFlatInterface, temporary = false): void {
  if(!temporary) highlightedElements = [];
  for (const key of Object.keys(idFlat)) {
    for (const mesh of idFlat[key].meshes) {
      if ((mesh.material as any).isMarkerMaterial && (mesh.material as any).highlight > 0) {
        (mesh.material as any).highlight = 0;
      }
    }
  }
}

/**
 * Reset highlights as before temporary = true was called
 * @param idFlat
 */
export function resetHighlights(idFlat: IdFlatInterface) {
  removeAllHighlights(idFlat, true);
  highLightElement(idFlat, highlightedElements, true);
}

export function hideNonVisibleElements(idFlat: IdFlatInterface) {
  const ignore = (id) => SVG_IDS.ignore.find((start) => id?.startsWith(start))

  // Hide none visible elements
  for (const key of Object.keys(idFlat)) {
    if (ignore(key)) {
      nonVisibleMeshes.push(...idFlat[key].meshes);
    }
  }

  for (const nonVisibleMesh of nonVisibleMeshes) {
    (nonVisibleMesh.material as Material) = new MeshBasicMaterial({
      transparent: true,
      opacity: 0
    });
    (nonVisibleMesh.geometry as Geometry).uvsNeedUpdate = true;
  }
}
