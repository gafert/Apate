import { GraphNode } from './GraphNode';
import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { MSDFFont } from '../services/graphServiceHelpers/msdf/MSDFFont';
import { byteToHex, cycleArray } from '../utils/helper';
import sync, { cancelSync, Process } from 'framesync';

export class InputNode extends GraphNode {

  private static readonly CIRCLE_RADIUS = 0.08;
  private static readonly CIRCLE_DISTANCE = 0.2;

  private valueMesh: MSDFFont;
  private unkownAnimationSync: Process;

  constructor(name: string, text: string) {
    super(name);

    this.valueMesh = new MSDFFont('??????????', 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'normal', 'left', 'mono');
    this.unknownAnimation();

    const textMesh = new MSDFFont(text, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.5);

    textMesh.position.setY(textMesh.height / 2);
    textMesh.position.setX(this.valueMesh.width - textMesh.width);

    this.mainMesh = [textMesh, this.valueMesh];

    this.renderGroup.add(this.valueMesh);
    this.renderGroup.add(textMesh);

    const circle = new CircleGeometry(InputNode.CIRCLE_RADIUS, 20);
    const mesh = new Mesh(circle, new MeshBasicMaterial({ color: new Color(0xffffff) }));

    this.outPos[0] = new Vector3(
      this.valueMesh.width + InputNode.CIRCLE_DISTANCE,
      -this.valueMesh.height / 2,
      0);

    mesh.position.copy(this.outPos[0]);

    this.renderGroup.add(mesh);
  }

  public get value() {
    return this.outputs[0].value;
  }

  public set value(value) {
    if (value === null) {
      this.unknownAnimation();
    } else {
      this.stopUnknownAnimation();
      this.valueMesh.text = '0x' + byteToHex(value, 8);
    }
    this.outputs[0].value = value;
  }

  compute() {
    super.compute();
  }

  private stopUnknownAnimation() {
    cancelSync.update(this.unkownAnimationSync);
    console.log('Canceled sync');
  }

  private unknownAnimation() {
    if (this.unkownAnimationSync) {
      return;
    }

    let counter = '????0000';

    let time = 0;
    this.unkownAnimationSync = sync.update(({ delta }) => {
      time += delta;
      if (time >= 100) {
        time = 0;
        counter = cycleArray(Array.from(counter)).join('');
        this.valueMesh.text = "0x" + counter;
        cancelSync.render(this.unkownAnimationSync);
      }
    }, true);
  }
}
