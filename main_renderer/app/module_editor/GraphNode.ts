import { Group, Vector3 } from 'three';
import { GraphLine } from './Line';

export interface PortInterface {
  connection: GraphLine;
  accessor: GraphNode;
}

export class GraphNode {
  public position: Vector3;
  public name: string;
  public renderGroup: Group;
  public inPos: Vector3[] = [];
  public outPos: Vector3[] = [];

  public inputs: PortInterface[] = [];
  public outputs: PortInterface[] = [];

  constructor(name: string) {
    this.name = name;
    this.renderGroup = new Group();
    this.position = this.renderGroup.position;
  }

  public getAbsolutePortPosition(direction: 'in' | 'out', num: number) {
    const positions = this.getPortPositions(this, direction);

    if(!positions) return new Vector3(0,0,0);
    if(this.checkPortPosition(positions, num)) return new Vector3(0,0,0);

    return new Vector3().add(this.position).add(positions[num]);
  }

  public connectToInput(targetNode: GraphNode, targetNum: number, sourceNum: number) {
    // Add line and subtract this position as we do not need it because we add it to this renderGroup
    const line = new GraphLine(
      this.getAbsolutePortPosition('out', sourceNum).sub(this.position),
      targetNode.getAbsolutePortPosition('in', targetNum).sub(this.position));

    this.outputs[sourceNum] = {
      accessor: targetNode,
      connection: line
    };

    targetNode.inputs[targetNum] = {
      accessor: this,
      connection: line
    }

    this.renderGroup.add(line.renderGroup);
  }

  private getPortPositions(node: GraphNode, direction: 'in' | 'out') {
    const positions = (direction === 'in' ? node.inPos : (direction === 'out' ? node.outPos : 0));

    if (positions === 0) {
      console.error(`No direction '${direction}' of '${node.name}'.`);
      return false;
    }

    return positions;
  }

  private checkPortPosition(positions: Vector3[], num: number) {
    if (num >= positions.length || num < 0) {
      console.error(`Cannot get absolute position of port '${num}' of '${this.name}'.`);
      return false;
    }
  }
}
