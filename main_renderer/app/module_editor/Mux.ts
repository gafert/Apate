import { MarkerMaterial } from "./MarkerMaterial";
import { Vector3, BufferGeometry, BufferAttribute, TextureLoader, Color, Mesh, Group } from "three";
import { makeBox, setUVofVertex, triangleLeftBottom, triangleLeftTop } from "./3Dhelpers";
import MUX_IMAGE from './mux.png';
import { GraphLine } from "./Line";
import { animate, easeIn } from 'popmotion';

export class Mux {
  public position: Vector3;
  public name: string;
  public renderGroup: Group;
  public inPos: Vector3[] = [];
  public outPos: Vector3;
  private selectionLine;
  private numIn;
  private shaderMaterial;

  private MUX_WIDTH = 1;

  // Distance from fisrt and last stud to top and bottom edge of the mux
  private STUD_EDGE_DISTANCE = 0.5;

  // Distance between studs
  private STUD_DISTANCE = 0.2;

  private STUD_WIDTH = 0.15;
  private STUD_HEIGHT = 0.05;

  constructor(numIn, name, globalUniforms) {
    console.assert(numIn >= 2, "MUX component needs at least 2 inputs, currently has " + numIn);

    this.name = name;
    this.numIn = numIn;

    this.outPos = new Vector3(this.MUX_WIDTH + this.STUD_WIDTH, -this.STUD_DISTANCE * ((numIn - 2) / 2) - this.STUD_DISTANCE / 2 - this.STUD_EDGE_DISTANCE, 0);

    // To allow the uv to always have the right relation to the element
    // if this distance was absolute the texture might show wrong
    const bottomTopTriangleRectsToHelpTextureHeight = this.STUD_EDGE_DISTANCE / 8;

    const triangleTop = triangleLeftBottom(this.MUX_WIDTH, this.STUD_EDGE_DISTANCE);
    const triangleBottom = triangleLeftTop(this.MUX_WIDTH, this.STUD_EDGE_DISTANCE, 0, -this.STUD_DISTANCE * (numIn - 1) - this.STUD_EDGE_DISTANCE);
    const centerTop = makeBox(this.MUX_WIDTH, bottomTopTriangleRectsToHelpTextureHeight, 0, -this.STUD_EDGE_DISTANCE)
    const centerBottom = makeBox(this.MUX_WIDTH, bottomTopTriangleRectsToHelpTextureHeight, 0, -this.STUD_DISTANCE * (numIn - 1) - this.STUD_EDGE_DISTANCE + bottomTopTriangleRectsToHelpTextureHeight)
    const center = makeBox(this.MUX_WIDTH, this.STUD_DISTANCE * (numIn - 1) - bottomTopTriangleRectsToHelpTextureHeight * 2, 0, -(this.STUD_EDGE_DISTANCE + bottomTopTriangleRectsToHelpTextureHeight), 0);
    const studs = [...this.getInputStuds(numIn), ...makeBox(this.STUD_WIDTH, this.STUD_HEIGHT, this.outPos.x - this.STUD_WIDTH, this.outPos.y + this.STUD_HEIGHT / 2)];


    const vertices = new Float32Array([
      ...triangleTop,
      ...centerTop,
      ...triangleBottom,
      ...centerBottom,
      ...center,
      ...studs
    ]);


    const geometry = new BufferGeometry();

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    // Make UV coordinates to fit texture

    const uv = new Float32Array([
      ...setUVofVertex(0.125, 0.875, 0.75, 1, [...triangleTop, ...centerTop]),
      ...setUVofVertex(0.125, 0.875, 0, 0.25, [...triangleBottom, ...centerBottom]),
      ...setUVofVertex(0.125, 0.875, 0.25, 0.75, center),
      ...setUVofVertex(0, 0.125, 0, 1, studs),
    ]);

    // itemSize = 2 because there are 2 values (components) per vertex
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array([...uv]), 2));

    const loader = new TextureLoader();
    const backgroundTexture = loader.load(MUX_IMAGE);

    this.shaderMaterial = new MarkerMaterial({
      color: new Color(0xffffff),
      globalUniforms: globalUniforms,
      map: backgroundTexture
    });

    const mesh = new Mesh(geometry, this.shaderMaterial);

    // Debug with lines
    // var geo = new EdgesGeometry( geometry );
    // const mat = new LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    // const wireframe = new LineSegments( geo, mat );


    // Add indicator

    const selectionLinePos = this.getSelectionLinePosition(0);
    this.selectionLine = new GraphLine(selectionLinePos[0], selectionLinePos[1]);

    const group = new Group();
    group.add(mesh);
    group.add(this.selectionLine.renderGroup);

    this.position = group.position;
    this.renderGroup = group;
  }

  /**
   * setSelected
   */
  public setSelected(selected, animated) {
    if(selected >= this.numIn) {
      console.error("Selected mux input " + selected + ", but only " + this.numIn + " available");
      return;
    }
    if(selected < 0) {
      console.error("Cannot select mux input smaller than 0, you selected " + selected);
      return;
    }
    const selectionLinePos = this.getSelectionLinePosition(selected);

    if(animated)
      return new Promise<void>(resolve => {
        animate({
          from: 0,
          to: 1,
          ease: easeIn,
          duration: 1000,
          onUpdate: (v) => {
            this.selectionLine.from.lerp(selectionLinePos[0], v);
            this.selectionLine.redraw();
          },
          onComplete: () => resolve(),
          onStop:() => resolve()
        });
      });
    else {
      this.selectionLine.from.copy(selectionLinePos[0]);
      this.selectionLine.redraw();
    }
  }

  public setHighlight(on, animated = true) {
    if(animated)
      return new Promise<void>(resolve => {
        animate({
          from: on ? 0 : 1,
          to: on ? 0 : 1,
          ease: easeIn,
          duration: 1000,
          onUpdate: (v) => {
            this.shaderMaterial.highlight = v;
          },
          onComplete: () => resolve(),
          onStop:() => resolve()
        });
      });
    else {
      this.shaderMaterial.highlight = on;
    }
  }

  private getSelectionLinePosition(selected) {
    return [new Vector3( this.MUX_WIDTH / 5, - this.STUD_EDGE_DISTANCE - (this.STUD_DISTANCE * selected), 0 ), new Vector3( this.MUX_WIDTH - this.MUX_WIDTH / 5, - this.STUD_EDGE_DISTANCE - (this.STUD_DISTANCE * (this.numIn - 1)) / 2, 0 )];
  }

  private getInputStuds(numIn) {
    const studs = [];
    for (let index = 0; index < numIn; index++) {
      const pos = new Vector3(0 - this.STUD_WIDTH, -this.STUD_DISTANCE * (index) - this.STUD_EDGE_DISTANCE, 0);
      this.inPos.push(pos);
      studs.push(...makeBox(this.STUD_WIDTH, this.STUD_HEIGHT, pos.x, pos.y + this.STUD_HEIGHT / 2))
    }
    return studs;
  }
}