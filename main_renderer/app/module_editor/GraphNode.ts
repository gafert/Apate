import { Camera, Group, Vector3 } from 'three';
import { GraphLine } from './Line';
import { focusCameraOnElement } from '../services/graphServiceHelpers/helperFocus';
import *  as _ from 'lodash';

export interface ConnectionInterface {
  line: GraphLine;
  targetNode: GraphNode;
  targetPortIndex: number;
  sourceNode: GraphNode;
  sourcePortIndex: number;
}

export interface PortInterface {
  connections: ConnectionInterface[];
  value: number;
}

export abstract class GraphNode {
  protected static readonly FONT_SIZE = 0.5;

  public position: Vector3;
  public name: string;
  public renderGroup: (Group & { node?: GraphNode });
  public inPos: Vector3[] = [];
  public outPos: Vector3[] = [];

  public inputs: PortInterface[] = [];
  public outputs: PortInterface[] = [];

  protected mainMesh;

  protected constructor(name: string) {
    this.name = name;
    this.renderGroup = new Group();
    this.renderGroup.node = this;
    this.position = this.renderGroup.position;
  }

  public getAbsolutePortPosition(direction: 'in' | 'out', num: number) {
    const positions = this.getPortPositions(this, direction);

    if (!positions) return new Vector3(0, 0, 0);
    if (this.checkPortPosition(positions, num)) return new Vector3(0, 0, 0);

    return new Vector3().add(this.position).add(positions[num]);
  }

  public connectToInput(targetNode: GraphNode, targetNum: number, sourceNum: number) {
    // Add line and subtract this position as we do not need it because we add it to this renderGroup
    const line = new GraphLine(
      this.getAbsolutePortPosition('out', sourceNum).sub(this.position),
      targetNode.getAbsolutePortPosition('in', targetNum).sub(this.position));

    // Setup arrays if undefined
    if (!this.outputs[sourceNum])
      this.outputs[sourceNum] = {
        connections: [],
        value: null
      };

    if (!targetNode.inputs[targetNum])
      targetNode.inputs[targetNum] = {
        connections: [],
        value: null
      };

    const connection = {
      line: line,
      sourcePortIndex: sourceNum,
      sourceNode: this,
      targetNode: targetNode,
      targetPortIndex: targetNum
    }

    this.outputs[sourceNum].connections.push(connection);
    targetNode.inputs[targetNum].connections.push(connection);

    this.renderGroup.add(line.renderGroup);
  }

  protected onSetInputPortValue(portNum, value) {
    console.log("Set input " + this.name + ":" + portNum + " to " + value)
    this.inputs[portNum].value = value;
  }

  public compute() {
    console.log("Computing " + this.name)
  }

  public centerOn(camera: Camera) {
    return focusCameraOnElement(camera, null, [this.mainMesh], true);
  }

  public forwardValuesToNextNodes() {
    const nextNodes = [];
    console.log(this.outputs);
    this.outputs.forEach((output) => {
      output.connections.forEach((conn) => {
        const connection = conn;
        connection.line.followLine().then(() => {
          connection.targetNode.onSetInputPortValue(connection.targetPortIndex, output.value);
        });
        nextNodes.push(connection.targetNode);
      });
    });

    return _.uniq(nextNodes);
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
