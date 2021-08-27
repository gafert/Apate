import { CatmullRomCurve3, CircleGeometry, Color, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';
import { MeshLine, MeshLineMaterial } from './meshline/main.js';
import { animate, easeIn, linear } from 'popmotion';

export class GraphLine {
  public renderGroup: Object3D;
  public from: Vector3;
  public to: Vector3;
  private line: MeshLine;
  private followCircle: Mesh<CircleGeometry, MeshBasicMaterial>;

  constructor(from: Vector3, to: Vector3) {
    this.from = from;
    this.to = to;

    this.line = new MeshLine();
    this.line.setPoints(this.getPoints());
    const material = new MeshLineMaterial({
      lineWidth: 0.05
    });

    const curveObject = new Mesh(this.line, material);
    this.renderGroup = curveObject;

    this.followCircle = new Mesh(new CircleGeometry(0.1, 20), new MeshBasicMaterial({
      color: new Color(0xffffff),
      transparent: true,
      opacity: 0
    }));
    this.renderGroup.add(this.followCircle);

  }

  public redraw() {
    this.line.setPoints(this.getPoints());
  }

  public followLine(): Promise<any> {
    return new Promise(resolve => {
      this.followCircle.position.copy(this.line._points[0].clone());

      const points = [];
      // Copy points, start at 1 because 0 is the 'to' in animate
      for (let i = 1; i < this.line._points.length; i++) {
        points.push(this.line._points[i].clone());
      }

      animate({
        from: 0,
        to: 1,
        ease: easeIn,
        duration: 200,
        onUpdate: (v) => {
          console.log(v);
          this.followCircle.material.opacity = v;
        }
      });

      animate({
        from: this.followCircle.position,
        to: points,
        ease: linear,
        duration: 2000,
        onUpdate: (v) => {
          this.followCircle.position.copy(v);
        }
      });

      animate({
        from: 1,
        to: 0,
        ease: easeIn,
        duration: 200,
        elapsed: -1800,
        onUpdate: (v) => {
          this.followCircle.material.opacity = v;
        },
        onComplete: () => {
          resolve();
        }
      });
    });

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
