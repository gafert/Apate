import { Box3, Group, Mesh, Object3D, ShapePath, Vector3 } from 'three';
import * as d3 from 'd3';
import { MeshText2D } from 'three-text2d';
import { BehaviorSubject } from 'rxjs';

// Interfaces

export interface PathWithMore extends ShapePath {
  userData: any;
}

export interface TextWithMore {
  userData: { node: SVGElement; style: any; position: Vector3 };
  text: string;
}

/**
 * Holds the SVGs hierarchy. Some elements are filled by the SVGLoader and used to generated the meshes.
 * The meshes and groups are generated by "initiateSVGObjects(): { idRoot; idFlat; renderGroup }".
 */
export interface IdRootInterface {
  id: string; // Filled by SVGLoader
  node: Element; // Filled by SVGLoader
  path: PathWithMore; // Filled by SVGLoader
  text: TextWithMore; // Filled by SVGLoader

  parent: IdRootInterface; // Filled by initiateSVGObjects
  children: IdRootInterface[]; // Filled by initiateSVGObjects
  meshes: Mesh[]; // Filled by initiateSVGObjects
  group: Object3D; // Filled by initiateSVGObjects
  isGroup: boolean; // Filled by initiateSVGObjects
}

/**
 * Each key of the object contains all meshes which are hierarchical under this element.
 * Each mesh can be accessed by multiple ids corresponding to the hierarchies.
 * E.g. an element with id "s_pc" holds meshes of that signal and is a child of id "mux_imm-2"
 * To allow an easier way to access all element which correspond to the "multiplexer with imm" these are flattened here.
 * "s_pc" meshes can therefore be access by "mux_imm-2", "s_pc", etc.
 *
 * To generate this object use the function "flattenRootToIndexIdArray(): idFlatInterface".
 *
 * If the idRoot is changed this needs to be regenerated.
 */
export interface IdFlatInterface {
  [key: string]: { meshes: Mesh[]; group: Object3D; rootRef: IdRootInterface };
}

export interface Signal {
  textElement: MeshText2D;
  meshes: Mesh[];
  binding: BehaviorSubject<any>;
}

export type Areas = 'overview' | 'cu' | 'alu' | 'be';

// Functions

/**
 * Calculates the center of a list of meshes and returns the center, size and bounding box
 * @param meshes The meshes to calculate the center of
 */
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
    box.getCenter(center);
    box.getSize(size);
    return { center, size, box };
  } catch (e) {
    const v1 = new Vector3(100, 100, 100);
    const b = new Box3(v1, v1);
    return { center: v1, size: v1, box: b };
  }
}

export function separateAreas(idFlat: IdFlatInterface) {
  const areas: Areas[] = ['overview', 'cu', 'alu', 'be'];

  let y = 0;
  for (const area of areas) {
    if (!idFlat['area_' + area]) continue;
    const group = idFlat['area_' + area].group;
    group.position.set(0, y, 0);
    y += 1000;
  }
}

/**
 * Flattens a hierarchical view to a 1D object. Each key of the object contains all meshes which are hierarchical under this element.
 * @param idRoot The idRoot to flatten
 * @param idFlat If provided this object is populated and no new object is generated
 */
export function flattenRootToIndexIdArray(idRoot: IdRootInterface, idFlat?: IdFlatInterface): IdFlatInterface {
  let ids: IdFlatInterface = idFlat;

  // Create object if the old object should not be used
  if (!ids) ids = {};

  const traverseChildren = (child) => {
    const meshes = [];
    if (child.meshes) meshes.push(...child.meshes);
    if (child.children) for (const deeperChild of child.children) meshes.push(...traverseChildren(deeperChild));
    if (child.id) ids[child.id] = { meshes: meshes, group: child.group, rootRef: child };
    return meshes;
  };

  traverseChildren(idRoot);

  return ids;
}

/**
 * Simple color check if none or undefined return transparent
 * @param color The color to check
 */
export function checkNoneColor(color) {
  if (color == 'none' || color == undefined) {
    return 'rgba(255,255,255,0)';
  } else {
    return color;
  }
}


