import {Box3, Group, Mesh, Vector3} from "THREE";
import * as d3 from "d3";

// Interfaces

export interface IdRootInterface {
  meshes: Mesh[];
  id: string;
  node: Element;
  children: IdRootInterface[];
  group: Group;
}

export interface IdFlatInterface {
  [key: string]: { meshes: Mesh[]; group: Group };
}

export type Areas = 'overview' | 'decoder' | 'alu' | 'memory' | 'registers';

// Functions

export function getCenterOfMeshes(meshes: Mesh[]): { center: Vector3; size: Vector3; box: Box3 } {
  const bboxes = [];

  try {
    for (const mesh of meshes) {
      mesh.geometry.computeBoundingBox();
      bboxes.push(new Box3().setFromObject(mesh));
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
  } catch (e) {
    const v1 = new Vector3(100, 100, 100);
    const b = new Box3(v1, v1);
    return {center: v1, size: v1, box: b}
  }
}

export function separateAreas(idFlat: IdFlatInterface) {
  const areas: Areas[] = ['overview', 'decoder', 'alu', 'memory', 'registers'];

  let y = 0;
  for (const area of areas) {
    if (!idFlat['area_' + area]) continue;
    const group = idFlat['area_' + area].group;
    group.position.set(0, y, 0);
    y += 1000;
  }
}

export function flattenRootToIndexIdArray(root) {
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

export function checkColor(color) {
  if (color == 'none' || color == undefined) {
    return 'rgba(255,255,255,0)';
  } else {
    return color;
  }
}


