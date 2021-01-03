import {Color, Material, Mesh} from "THREE";
import {animate} from "popmotion";
import {IdFlatInterface} from "./helpers";

const nonVisibleMeshes: Mesh[] = [];

export function setOpacity<B extends boolean>(meshes: Mesh[], opacity, animateTransition: B): B extends true ? Promise<unknown> : void;
export function setOpacity(meshes, opacity, animateTransition = true): Promise<unknown> | void {
  if (animateTransition) {
    return new Promise((resolve) => {
      for (const mesh of meshes) {
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
    })
  } else {
    for (const mesh of meshes) {
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
    })
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
  if (typeof idOrMesh == "string") {
    meshes = idFlat[idOrMesh]?.meshes
  } else if (typeof idOrMesh == "object") {
    meshes = idOrMesh;
  }

  if (!meshes) {
    console.error("Could not find mesh or id", idOrMesh)
    return;
  }

  return setOpacity(meshes, 0, animate);
}

export function showElement<B extends boolean>(idFlat: IdFlatInterface, id: string, animate: B): B extends true ? Promise<unknown> : void;
export function showElement<B extends boolean>(idFlat: IdFlatInterface, meshes: Mesh[], animate: B): B extends true ? Promise<unknown> : void;
export function showElement(idFlat, idOrMesh, animate = false): Promise<unknown> | void {
  let meshes: Mesh[];
  if (typeof idOrMesh == "string") {
    meshes = idFlat[idOrMesh]?.meshes
  } else if (typeof idOrMesh == "object") {
    meshes = idOrMesh;
  }

  if (!meshes) {
    console.error("Could not find mesh or id", idOrMesh)
    return;
  }

  const meshesWithoutNonVisibleAreas = meshes.filter((mesh) => !nonVisibleMeshes.includes(mesh));

  return setOpacity(meshesWithoutNonVisibleAreas, 1, animate);
}

export function hideNonVisibleElements(idFlat: IdFlatInterface) {
  // Hide none visible elements
  for (const key of Object.keys(idFlat)) {
    if (key.startsWith('focus_') || key.startsWith('areaborder_')) {
      nonVisibleMeshes.push(...idFlat[key].meshes);
    }
  }

  for (const nonVisibleMesh of nonVisibleMeshes) {
    (nonVisibleMesh.material as Material).opacity = 0;
  }
}
