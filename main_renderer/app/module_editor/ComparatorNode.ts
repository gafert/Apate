import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector3
} from 'three';
import { makeBox, setUVofVertex } from './3Dhelpers';
import NODE_IMAGE from './node.png';
import { MarkerMaterial } from './MarkerMaterial';
import { GraphNode } from './GraphNode';
import { MSDFFont } from '../services/graphServiceHelpers/msdf/MSDFFont';
import { byteToHex } from '../utils/helper';

export class ComparatorNode extends GraphNode {
  private static readonly BORDER = 0.15;
  private static readonly WIDTH = 1;
  private static readonly HEIGHT = 1;
  private static readonly STUD_WIDTH = 0.15;
  private static readonly STUD_HEIGHT = 0.05;
  private static readonly STUD_DISTANCE = 0.15;
  private static readonly CIRCLE_RADIUS = 0.08;

  constructor(name: string, constValue: number, private globalUniforms) {
    super(name);

    // Bottom
    this.inPos[0] = new Vector3(-ComparatorNode.STUD_WIDTH, -ComparatorNode.HEIGHT / 2 - ComparatorNode.STUD_DISTANCE, 0);
    // Top connected to fixed number and should not be used
    this.inPos[999] = new Vector3(-ComparatorNode.STUD_WIDTH, -ComparatorNode.HEIGHT / 2 + ComparatorNode.STUD_DISTANCE, 0);
    this.outPos[0] = new Vector3(ComparatorNode.WIDTH + ComparatorNode.STUD_WIDTH, -ComparatorNode.HEIGHT / 2, 0);

    this.mainMesh = this.makeMainMesh();
    this.renderGroup.add(this.mainMesh);

    const textMesh = new MSDFFont('0x' + byteToHex(constValue, 2), 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'normal', 'right', 'mono');

    // align center
    textMesh.position.setX(-0.1 + -(textMesh.geometry.layout.width / textMesh.geometry.layout._opt.font.info.size * textMesh.fontSize + ComparatorNode.STUD_WIDTH + 0.1));
    textMesh.position.setY(-ComparatorNode.HEIGHT / 2 + ComparatorNode.STUD_DISTANCE + textMesh.geometry.layout.height / textMesh.geometry.layout._opt.font.info.size * textMesh.fontSize / 2);
    this.renderGroup.add(textMesh);

    // Add equal text
    const equalSymbol = new MSDFFont('==', 1, new Color(0xffffff), GraphNode.FONT_SIZE, 'bold');
    equalSymbol.position.setX(ComparatorNode.WIDTH / 2 - equalSymbol.geometry.layout.width / equalSymbol.geometry.layout._opt.font.info.size * equalSymbol.fontSize / 2);
    equalSymbol.position.setY(-ComparatorNode.HEIGHT / 2 + equalSymbol.geometry.layout.height / equalSymbol.geometry.layout._opt.font.info.size * equalSymbol.fontSize / 2);

    // Add circle to
    const circle = new CircleGeometry(ComparatorNode.CIRCLE_RADIUS, 20);
    const mesh = new Mesh(circle, new MeshBasicMaterial({ color: new Color(0xffffff) }));
    mesh.position.copy(this.inPos[999]);
    this.renderGroup.add(mesh);

    this.renderGroup.add(equalSymbol);
  }

  protected onSetInputPortValue(portNum, value) {
    super.onSetInputPortValue(portNum, value);


  }

  private makeMainMesh() {
    const geometry = new BufferGeometry();

    const b = ComparatorNode.BORDER;
    const w = ComparatorNode.WIDTH;
    const h = ComparatorNode.HEIGHT;

    // Top
    const cornerLeftTop = makeBox(b, b);
    const top = makeBox(w - b - b, b, b);
    const cornerRightTop = makeBox(b, b, w - b);

    // Middle
    const left = makeBox(b, h - b - b, 0, -b);
    const middle = makeBox(w - b - b, h - b - b, b, -b);
    const right = makeBox(b, h - b - b, w - b, -b);

    // Bottom
    const cornerLeftBottom = makeBox(b, b, 0, -h + b);
    const bottom = makeBox(w - b - b, b, b, -h + b);
    const cornerRightBottom = makeBox(b, b, w - b, -h + b);
    // Input studs
    const studs = [
      ...makeBox(ComparatorNode.STUD_WIDTH, ComparatorNode.STUD_HEIGHT, this.inPos[999].x, this.inPos[999].y + ComparatorNode.STUD_HEIGHT / 2),
      ...makeBox(ComparatorNode.STUD_WIDTH, ComparatorNode.STUD_HEIGHT, this.inPos[0].x, this.inPos[0].y + ComparatorNode.STUD_HEIGHT / 2),
      ...makeBox(ComparatorNode.STUD_WIDTH, ComparatorNode.STUD_HEIGHT, this.outPos[0].x - ComparatorNode.STUD_WIDTH, this.outPos[0].y + ComparatorNode.STUD_HEIGHT / 2)
    ];


    const vertices = [
      ...cornerLeftTop, ...top, ...cornerRightTop, ...left, ...middle, ...right, ...cornerLeftBottom, ...bottom, ...cornerRightBottom, ...studs
    ];
    // const uv = setUVofVertex(0, 1, 0, 1, vertices);

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array([
      // Top
      ...setUVofVertex(0, 0.125, 0.875, 1, cornerLeftTop),
      ...setUVofVertex(0.125, 0.875, 0.875, 1, top),
      ...setUVofVertex(0.875, 1, 0.875, 1, cornerRightTop),
      // Middle
      ...setUVofVertex(0, 0.125, 0.125, 0.875, left),
      ...setUVofVertex(0.125, 0.875, 0.125, 0.875, middle),
      ...setUVofVertex(0.875, 1, 0.125, 0.875, right),
      // Bottom
      ...setUVofVertex(0, 0.125, 0, 0.125, cornerLeftBottom),
      ...setUVofVertex(0.125, 0.875, 0, 0.125, bottom),
      ...setUVofVertex(0.875, 1, 0, 0.125, cornerRightBottom),
      ...setUVofVertex(0.2, 0.201, 0, 0.001, studs)
    ]), 2));

    const loader = new TextureLoader();
    const backgroundTexture = loader.load(NODE_IMAGE);

    const mesh = new Mesh(geometry, new MarkerMaterial({
      color: new Color(0xffffff),
      globalUniforms: this.globalUniforms,
      map: backgroundTexture
    }));

    return mesh;
  }

}
