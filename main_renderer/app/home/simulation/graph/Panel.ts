import * as THREE from 'three';
import { readStyleProperty } from '../../../utils/helper';
import { MeshText2D, textAlign } from 'three-text2d';
import F_SHADER from './shader.frag';
import V_SHADER from './shader.vert';
import { MeshLine, MeshLineMaterial } from '../../../utils/THREE.MeshLine';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';
import { byteToHex } from '../../../globals';
import { easing, styler, tween } from 'popmotion';

export class Port {
  public meshGroup: THREE.Object3D;
  private valueText: MeshText2D;
  private descriptorMesh: THREE.Mesh;

  constructor(
    private _x: number,
    private _y: number,
    private _z: number,
    private _name: string,
    private _value: any,
    private _globalUniforms: object
  ) {
    this.meshGroup = new THREE.Object3D();

    const width = 0.4;
    const height = 0.08;
    const headerTextPadding = 0.02;

    const headerGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    // anchor left bottom
    headerGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width / 2, -height / 2, this._z));

    const inputMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: { value: new THREE.Color(readStyleProperty('grey2')) },
        u_borderColor: { value: new THREE.Color(readStyleProperty('grey1')) },
        u_width: { value: width },
        u_height: { value: height },
        ...this._globalUniforms
      }
    });

    this.descriptorMesh = new THREE.Mesh(headerGeometry, inputMaterial);
    this.descriptorMesh.position.set(this._x, this._y, this._z);
    this.descriptorMesh.renderOrder = 50;
    this.meshGroup.add(this.descriptorMesh);

    const headerText = new MeshText2D(this._name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    });

    // Scale 100 px font down
    headerText.scale.set(0.0005, 0.0005, 0);
    // Z Because of render order issues
    headerText.position.set(this._x + headerTextPadding, this._y - height / 2 + 0.05 / 2, this._z + 0.01);
    headerText.renderOrder = 100;
    this.meshGroup.add(headerText);

    // const valueDescText = new MeshText2D('Value:', {
    //   align: textAlign.left,
    //   font: '100px Roboto',
    //   fillStyle: '#ffffff',
    //   antialias: true
    // });
    //
    // // Scale 100 px font down
    // valueDescText.scale.set(0.0005, 0.0005, 0);
    // valueDescText.position.set(this._x + headerTextPadding, this._y - height / 2 + 0.05 / 2 - height, this._z);
    // valueDescText.renderOrder = 1;
    // this.meshGroup.add(valueDescText);

    this.valueText = new MeshText2D(String(this._value), {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    });

    // Scale 100 px font down
    this.valueText.scale.set(0.0005, 0.0005, 0);
    this.valueText.position.set(this._x + headerTextPadding + 0.15, this._y - height / 2 + 0.05 / 2 - height, this._z);
    this.meshGroup.add(this.valueText);
  }

  setValue(value) {
    this.valueText.text = value;
    this.valueText.updateText();
  }

  setBorderColor(color: THREE.Color) {
    // @ts-ignore
    this.descriptorMesh.material.uniforms.u_borderColor.value = color;
  }

  getBorderColor() {
    // @ts-ignore
    return this.descriptorMesh.material.uniforms.u_borderColor.value;
  }

  setBackgroundColor(color: THREE.Color) {
    // @ts-ignore
    this.descriptorMesh.material.uniforms.u_backgroundColor.value = color;
  }

  getBackgroundColor() {
    // @ts-ignore
    return this.descriptorMesh.material.uniforms.u_backgroundColor.value;
  }
}

export class Icon {
  public meshGroup: THREE.Object3D;
  private descriptorMesh: THREE.Mesh;
  private valueText: MeshText2D;

  constructor(
    private _x: number,
    private _y: number,
    private _z: number,
    private _value: any,
    private _globalUniforms: object
  ) {
    this.meshGroup = new THREE.Object3D();

    const width = 0.2;
    const height = 0.08;
    const headerTextPadding = 0.02;

    const headerGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    // anchor left bottom
    headerGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width / 2, -height / 2, this._z));

    const inputMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: { value: new THREE.Color(readStyleProperty('grey2')) },
        u_borderColor: { value:  new THREE.Color(readStyleProperty('grey1')) },
        u_width: { value: width },
        u_height: { value: height },
        ...this._globalUniforms
      }
    });

    this.descriptorMesh = new THREE.Mesh(headerGeometry, inputMaterial);
    this.descriptorMesh.position.set(this._x, this._y, this._z);
    this.descriptorMesh.renderOrder = 50;
    this.meshGroup.add(this.descriptorMesh);

    const valueText = new MeshText2D(this._value, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    });

    // Scale 100 px font down
    valueText.scale.set(0.0005, 0.0005, 0);
    valueText.position.set(this._x + headerTextPadding, this._y - height / 2 + 0.05 / 2, this._z);
    valueText.renderOrder = 100;
    this.meshGroup.add(valueText);
  }

  setValue(value) {
    this.valueText.text = value;
    this.valueText.updateText();
  }

  setBorderColor(color: THREE.Color) {
    // @ts-ignore
    this.descriptorMesh.material.uniforms.u_borderColor.value = color;
  }

  getBorderColor() {
    // @ts-ignore
    return this.descriptorMesh.material.uniforms.u_borderColor.value;
  }

  setBackgroundColor(color: THREE.Color) {
    // @ts-ignore
    this.descriptorMesh.material.uniforms.u_backgroundColor.value = color;
  }

  getBackgroundColor() {
    // @ts-ignore
    return this.descriptorMesh.material.uniforms.u_backgroundColor.value;
  }
}


export class Panel {
  public ports: Port[] = [];
  private headerLine: THREE.Mesh;
  private headerText: MeshText2D;
  private panelMaterial: THREE.ShaderMaterial;
  private panelMesh: THREE.Mesh;

  constructor(
    private scene: THREE.Scene,
    private _x: number,
    private _y: number,
    private _z: number,
    private _name: string,
    private _width: number,
    private _height: number,
    private _globalUniforms: object,
    private _simLibInterfaceService: SimLibInterfaceService
  ) {
    this.panelMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: { value: new THREE.Color(readStyleProperty('grey3')) },
        u_borderColor: { value: new THREE.Color(readStyleProperty('grey1')) },
        u_width: { value: this._width },
        u_height: { value: this._height },
        ...this._globalUniforms
      }
    });

    const geometry = new THREE.PlaneGeometry(this._width, this._height);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this._width / 2, this._height / 2, 0));
    this.panelMesh = new THREE.Mesh(geometry, this.panelMaterial);
    this.panelMesh.position.set(this._x, this._y, this._z);
    this.panelMesh.renderOrder = 0;
    scene.add(this.panelMesh);

    this.headerText = new MeshText2D(this._name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    });
    // Scale 100 px font down
    this.headerText.scale.set(0.0005, 0.0005, 0);

    this.headerText.position.set(0.05, this._height - 0.05, 0);
    this.headerText.renderOrder = 1;
    this.panelMesh.add(this.headerText);

    // Line under the header
    const lineBasicMaterial = new MeshLineMaterial({
      color: new THREE.Color(readStyleProperty('grey1')),
      lineWidth: 0.005,
      sizeAttenuation: false
    });
    const points = new THREE.Geometry();
    points.vertices.push(new THREE.Vector3(0, this._height - 0.15, 0));
    points.vertices.push(new THREE.Vector3(this._width, this._height - 0.15, 0));
    const line = new MeshLine();
    line.setGeometry(points);

    this.headerLine = new THREE.Mesh(line.geometry, lineBasicMaterial);
    this.headerLine.renderOrder = 1;
    this.panelMesh.add(this.headerLine);
  }

  changeBorderColor(color: THREE.Color) {
    // @ts-ignore
    this._panelMesh.material.uniforms.u_borderColor.value = color;
    // @ts-ignore
    this.headerLine.material.color = color;
  }

  /**
   * Add a port to the panel. Starting 0,0 at left,top
   * @param x
   * @param y
   * @param name The name of the port
   * @param value Value to set
   * @param valueType hex, string, dec (representation of the subjects value)
   * @param valueSubject Subject to subscribe to for the value if changed
   */
  addPort(x, y, name, value, valueType, valueSubject?) {
    // Needs to be a little bit higher so the transparent items can be in between panel and port
    const port = new Port(x, y, 0.001, name, value, this._globalUniforms);
    this.panelMesh.add(port.meshGroup);
    this.ports.push(port);

    // If a subject is set subscribe to it
    if (valueSubject) {
      this._simLibInterfaceService.bindings[valueSubject].subscribe((value) => {
        tween({
          from: readStyleProperty('accent'),
          to: readStyleProperty('grey1'),
          ease: easing.easeOut,
          duration: 10000,
        }).start((v) => port.setBorderColor(new THREE.Color(v)));

        switch (valueType) {
          case 'hex':
            port.setValue(byteToHex(value, 8));
            break;
          case 'string':
            port.setValue(new Buffer(byteToHex(value, 0), 'hex'));
            break;
          case 'dec':
          default:
            port.setValue(value);
        }
      });
    }
  }

  /**
   * Add a icon to the panel. Starting 0,0 at left,top
   * @param x
   * @param y
   * @param value Value to set
   * @param compare A value to compare the subject to to activate the icon
   * @param valueSubject Subject to subscribe to for the value if changed
   */
  addIcon(x, y, value, compare?, valueSubject?) {
    const icon = new Icon(x, y, 0, value, this._globalUniforms);
    this.panelMesh.add(icon.meshGroup);

    // If a subject is set subscribe to it
    if (valueSubject && compare) {
      this._simLibInterfaceService.bindings[valueSubject].subscribe((value) => {
        console.log(value)

        if(value === compare) {
          tween({
            from: '#' + icon.getBorderColor().getHexString(),
            to: readStyleProperty('accent'),
            ease: easing.easeOut,
            duration: 500,
          }).start((v) => {
            icon.setBackgroundColor(new THREE.Color(v));
            icon.setBorderColor(new THREE.Color(v))
          });
        } else {
          tween({
            from: '#' +  icon.getBorderColor().getHexString(),
            to: readStyleProperty('grey1'),
            ease: easing.easeOut,
            duration: 500,
          }).start((v) => {
            icon.setBackgroundColor(new THREE.Color(v));
            icon.setBorderColor(new THREE.Color(v))
          });
        }
      });
    }
  }
}

