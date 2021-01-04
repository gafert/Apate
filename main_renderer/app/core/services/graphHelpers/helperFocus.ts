import {Camera, Mesh} from "three";
import {animate, easeIn} from "popmotion";
import {getCenterOfMeshes, IdFlatInterface} from "./helpers";

// Stop the animation if it is already running
let focusAnimation: any;

export function focusCameraOnElement<B extends boolean>(camera: Camera, idFlat: IdFlatInterface, meshes: Mesh[], enableAnimation: B): B extends true ? Promise<unknown> : void;
export function focusCameraOnElement<B extends boolean>(camera: Camera, idFlat: IdFlatInterface, id: string, enableAnimation: B): B extends true ? Promise<unknown> : void;
export function focusCameraOnElement(camera, idFlat, idOrMesh, enableAnimation = false): Promise<unknown> | void {
  let meshes: Mesh[];
  if (typeof idOrMesh == "string") {
    meshes = idFlat[idOrMesh]?.meshes
  } else if (typeof idOrMesh == "object") {
    meshes = idOrMesh;
  }

  if (!meshes) return;

  const {center, size, box} = getCenterOfMeshes(meshes);

  const padding = 0;
  const w = size.x + padding;
  const h = size.y + padding;

  const fovX = camera.fov * camera.aspect;
  const fovY = camera.fov;

  // TODO: 1.1???
  const distanceX = (w / 2) / Math.tan(Math.PI * fovX / 360 / 1.1);
  const distanceY = (h / 2) / Math.tan(Math.PI * fovY / 360 / 1.1);

  const distance = Math.max(distanceX, distanceY);

  const newCameraPos = center.clone();
  newCameraPos.z = newCameraPos.z + distance;

  focusAnimation?.stop();
  // Lerp to new position if animate is true, otherwise move instantly
  if (enableAnimation) {
    return new Promise(resolve => {
      focusAnimation = animate({
        from: 0,
        to: 1,
        ease: easeIn,
        duration: 1000,
        onUpdate: (v) => {
          camera.position.lerp(newCameraPos, v);
        },
        onComplete: () => resolve()
      });
    });
  } else {
    camera.position.copy(newCameraPos);
  }
}
