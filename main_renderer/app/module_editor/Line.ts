import { CatmullRomCurve3, Vector3, Mesh, Object3D } from "three";
import { MeshLine, MeshLineMaterial } from './meshline/main.js';

export class GraphLine {
  public renderGroup: Object3D;
  private line: MeshLine;
  public from: Vector3;
  public to: Vector3;

  constructor(from: Vector3, to: Vector3) {
    this.from = from;
    this.to = to;

    this.line = new MeshLine();
    this.line.setPoints(this.getPoints());
    const material = new MeshLineMaterial({
      lineWidth: 0.05
    });

    const curveObject = new Mesh(this.line, material)
    this.renderGroup = curveObject;
  }

  public redraw() {
    this.line.setPoints(this.getPoints());
  }

  private getPoints() {
    const x0 = this.from.x;
    const x1 = this.to.x;
    const y0 = this.from.y;
    const y1 = this.to.y;
    const z0 = this.from.z;
    const z1 = this.to.z;
    const curve = new CatmullRomCurve3([
      new Vector3(x0, y0, z0),
      new Vector3(Math.max(x0 + (x1 - x0) / 2 - 0.03, x0 + 0.03), y0 < y1 ? Math.min(y0, y1) : Math.max(y0, y1), z0),
      new Vector3(Math.min(x0 + (x1 - x0) / 2 + 0.03, x1 - 0.03), y0 < y1 ? Math.max(y1, y0) : Math.min(y1, y0), z1),
      new Vector3(x1, y1, z1)
    ], false, 'catmullrom', 0.001);

    return curve.getPoints(50);
  }
}