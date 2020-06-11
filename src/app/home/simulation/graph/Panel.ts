import * as THREE from 'three';
import {readStyleProperty} from "../../../utils/helper";
import {MeshText2D, textAlign} from "three-text2d";
import {byteToHex} from "../../../globals";
import F_SHADER from './shader.frag';
import V_SHADER from './shader.vert';
import {MeshLine, MeshLineMaterial} from '../../../utils/THREE.MeshLine'
import {SimLibInterfaceService} from "../../../core/services";
import {Object3D} from "three";

export class Panel {
  private _panelMesh: THREE.Mesh;
  private _headerLine: THREE.Mesh;
  private _headerText: MeshText2D;
  private _panelMaterial: THREE.Material;
  public ports: Port[] = [];

  constructor(private scene: THREE.Scene,
              private _x: number,
              private _y: number,
              private _z: number,
              private _name: string,
              private _width: number,
              private _height: number,
              private _globalUniforms: object,
              private _simLibInterfaceService: SimLibInterfaceService) {
    this._panelMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: {type: 'vec3', value: new THREE.Color(readStyleProperty('grey3'))},
        u_borderColor: {type: 'vec3', value: new THREE.Color(readStyleProperty('grey1'))},
        u_width: {type: 'f', value: this._width},
        u_height: {type: 'f', value: this._height},
        ...this._globalUniforms
      }
    });

    let geometry = new THREE.PlaneGeometry(this._width, this._height);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this._width / 2, this._height / 2, 0));
    this._panelMesh = new THREE.Mesh(geometry, this._panelMaterial);
    this._panelMesh.position.set(this._x, this._y, this._z);
    this._panelMesh.renderOrder = 0;
    scene.add(this._panelMesh);

    this._headerText = new MeshText2D(this._name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })
    // Scale 100 px font down
    this._headerText.scale.set(0.0005, 0.0005, 0);

    this._headerText.position.set(0.05, this._height - 0.05, 0);
    this._headerText.renderOrder = 1;
    this._panelMesh.add(this._headerText);

    // Line under the header
    let lineBasicMaterial = new MeshLineMaterial({
      color: new THREE.Color(readStyleProperty('grey1')),
      lineWidth: 0.005,
      sizeAttenuation: false
    });
    let points = new THREE.Geometry();
    points.vertices.push(new THREE.Vector3(0, this._height - 0.15, 0));
    points.vertices.push(new THREE.Vector3(this._width, this._height - 0.15, 0));
    let line = new MeshLine()
    line.setGeometry(points)

    this._headerLine = new THREE.Mesh(line.geometry, lineBasicMaterial);
    this._headerLine.renderOrder = 1;
    this._panelMesh.add(this._headerLine);
  }

  addPort(x, y, name, value, valueType, valueSubject) {
    let port = new Port(x, y, 0, name, value, this._globalUniforms);
    this._panelMesh.add(port.meshGroup)
    this.ports.push(port);

    this._simLibInterfaceService.bindings[valueSubject].subscribe((value) => {
      switch (valueType) {
        case "hex":
          port.setValue(byteToHex(value, 8));
          break;
        case "string":
          port.setValue(new Buffer(byteToHex(value, 0), 'hex'));
          break;
        case "dec":
        default:
          port.setValue(value);
      }
    });
  }

  get panelMesh(): THREE.Mesh {
    return this._panelMesh;
  }
}

export class Port {
  private _valueText: MeshText2D;
  public meshGroup: Object3D;

  constructor(private _x: number,
              private _y: number,
              private _z: number,
              private _name: string,
              private _value: any,
              private _globalUniforms: object) {
    this.meshGroup = new Object3D();

    let width = 0.4;
    let height = 0.08;
    let headerTextPadding = 0.02;

    let headerGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    // anchor left bottom
    headerGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width / 2, -height / 2, this._z));

    let inputMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: {type: 'vec3', value: new THREE.Color(readStyleProperty('grey2'))},
        u_borderColor: {type: 'vec3', value: new THREE.Color(readStyleProperty('grey1'))},
        u_width: {type: 'f', value: width},
        u_height: {type: 'f', value: height},
        ...this._globalUniforms
      }
    });

    let header = new THREE.Mesh(headerGeometry, inputMaterial);
    header.position.set(this._x, this._y, this._z);
    header.renderOrder = 50;
    this.meshGroup.add(header);

    let headerText = new MeshText2D(this._name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })

    // Scale 100 px font down
    headerText.scale.set(0.0005, 0.0005, 0);
    headerText.position.set(
      this._x + headerTextPadding,
      this._y - height / 2 + 0.05 / 2,
      this._z);
    headerText.renderOrder = 100;
    this.meshGroup.add(headerText);

    let valueDescText = new MeshText2D("Value:", {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })

    // Scale 100 px font down
    valueDescText.scale.set(0.0005, 0.0005, 0);
    valueDescText.position.set(
      this._x + headerTextPadding,
      this._y - height / 2 + 0.05 / 2 - height,
      this._z);
    valueDescText.renderOrder = 1;
    this.meshGroup.add(valueDescText);

    this._valueText = new MeshText2D(String(this._value), {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true,
    })

    // Scale 100 px font down
    this._valueText.scale.set(0.0005, 0.0005, 0);
    this._valueText.position.set(
      this._x + headerTextPadding + 0.15,
      this._y - height / 2 + 0.05 / 2 - height,
      this._z);
    valueDescText.renderOrder = 1;
    this.meshGroup.add(this._valueText);
  }

  setValue(value) {
    this._valueText.text = value;
    this._valueText.updateText();
  }
}
