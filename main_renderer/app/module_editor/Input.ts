import { GraphNode } from './GraphNode';
import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { MSDFFont } from '../services/graphServiceHelpers/msdf/MSDFFont';

export class InputNode extends GraphNode {

  private FONT_SIZE = 0.5;
  private CIRCLE_RADIUS = 0.08;
  private CIRCLE_DISTANCE = 0.2;

  constructor(name: string, text: string) {
    super(name);

    const textMesh = new MSDFFont(text, 1, new Color(0xffffff), this.FONT_SIZE);

    const circle = new CircleGeometry(this.CIRCLE_RADIUS, 20);
    const mesh = new Mesh(circle, new MeshBasicMaterial({ color: new Color(0xffffff) }));

    this.outPos[0] = new Vector3(
      textMesh.geometry.layout.width / textMesh.geometry.layout.lineHeight * this.FONT_SIZE + this.CIRCLE_RADIUS + this.CIRCLE_DISTANCE,
      -textMesh.geometry.layout.height / textMesh.geometry.layout.lineHeight / 2 * this.FONT_SIZE + this.CIRCLE_RADIUS / 2,
      0);

    mesh.position.copy(this.outPos[0]);

    this.renderGroup.add(textMesh);
    this.renderGroup.add(mesh);
  }
}
