import {AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {MeshLine, MeshLineMaterial} from 'three.meshline'
import panzoom from './drag.js';
import {MeshText2D, textAlign} from 'three-text2d'
import F_SHADER from './shader.frag';
import V_SHADER from './shader.vert';
import {SimLibInterfaceService} from "../../../core/services";
import {byteToHex} from "../../../globals";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild('graph') graph: ElementRef<HTMLDivElement>;

  private camera;
  private renderer;
  private scene;

  private frameId;

  private time = 0;
  private clock = new THREE.Clock();
  private globalUniforms = {
    u_time: {type: 'f', value: 0},
    u_resolution: {type: 'vec2', value: new THREE.Vector2(0, 0)}
  }

  constructor(private simLibInterfaceService: SimLibInterfaceService,
              private ngZone: NgZone) {
  }

  resize() {
    let width = this.graph.nativeElement.clientWidth;
    let height = this.graph.nativeElement.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.globalUniforms.u_resolution.value = new THREE.Vector2(width, height);
  }

  ngAfterViewInit() {
    let width = this.graph.nativeElement.clientWidth;
    let height = this.graph.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.sortObjects = true;
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    this.graph.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 0, 10);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    panzoom(this.camera, this.graph.nativeElement);

    this.initiateObjects();
    this.resize();

    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  // Read the custom property of body section with given name:
  readStyleProperty(name: string): string {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue("--" + name);
  }

  initiateObjects() {
    this.addPanel("Instruction Decoder", 0, 0, 0, 0, 0, 0);
  }

  addPanel(name, x, y, z, inputs, outputs, additional) {
    let panelWidth = 1;
    let panelHeight = 1;

    let matBorderDark = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: {type: 'vec3', value: new THREE.Color(this.readStyleProperty('grey3'))},
        u_borderColor: {type: 'vec3', value: new THREE.Color(this.readStyleProperty('grey1'))},
        u_width: {type: 'f', value: panelWidth},
        u_height: {type: 'f', value: panelHeight},
        ...this.globalUniforms
      }
    });
    let geometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(panelWidth / 2, panelHeight / 2, 0));
    let gQuad = new THREE.Mesh(geometry, matBorderDark);
    gQuad.position.set(x, y, z);
    this.scene.add(gQuad);

    var text = new MeshText2D(name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })

    // Scale 100 px font down
    text.scale.set(0.0005, 0.0005, 1);
    text.position.set(x + 0.05, y + 0.95, z + 0.001);
    this.scene.add(text);

    let lineBasicMaterial = new MeshLineMaterial({
      color: new THREE.Color(this.readStyleProperty('grey1')),
      lineWidth: 0.005,
      sizeAttenuation: false
    });
    let points = new THREE.Geometry();
    points.vertices.push(new THREE.Vector3(x, y + 0.85, 0));
    points.vertices.push(new THREE.Vector3(x + panelWidth, y + 0.85, 0));
    let line = new MeshLine()
    line.setGeometry(points)

    let lineMesh = new THREE.Mesh(line.geometry, lineBasicMaterial);

    this.scene.add(lineMesh);

    let textCallback = this.addInput(0.05, 0.8, 0, "Opcode", 3).onSetText;
    this.simLibInterfaceService.bindings.uut__DOT__dbg_insn_opcode__subject.subscribe((instruction) => {
      textCallback(byteToHex(instruction, 8));
    })

    let immText = this.addInput(0.5, 0.6, 0, "Immediate", 3).onSetText;
    this.simLibInterfaceService.bindings.uut__DOT__decoded_imm__subject.subscribe((instruction) => {
      immText(byteToHex(instruction, 8));
    })

    let rs1Text = this.addInput(0.5, 0.4, 0, "RS1", 3).onSetText;
    this.simLibInterfaceService.bindings.uut__DOT__decoded_rs1__subject.subscribe((instruction) => {
      rs1Text(byteToHex(instruction, 8));
    })

    let rs2Text = this.addInput(0.5, 0.2, 0, "RS2", 3).onSetText;
    this.simLibInterfaceService.bindings.uut__DOT__decoded_rs2__subject.subscribe((instruction) => {
      rs2Text(byteToHex(instruction, 8));
    })

    let rdText = this.addInput(0.5, 0.8, 0, "RD", 3).onSetText;
    this.simLibInterfaceService.bindings.uut__DOT__decoded_rd__subject.subscribe((instruction) => {
      rdText(byteToHex(instruction, 8));
    })
  }

  addInput(x, y, z, name, value) {
    let width = 0.4;
    let height = 0.08;
    let headerTextPadding = 0.03;

    let headerGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    // anchor left bottom
    headerGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width / 2, -height / 2, 0));

    let inputMaterial = new THREE.ShaderMaterial({
      vertexShader: V_SHADER,
      fragmentShader: F_SHADER,
      uniforms: {
        u_backgroundColor: {type: 'vec3', value: new THREE.Color(this.readStyleProperty('grey2'))},
        u_borderColor: {type: 'vec3', value: new THREE.Color(this.readStyleProperty('grey1'))},
        u_width: {type: 'f', value: width},
        u_height: {type: 'f', value: height},
        ...this.globalUniforms
      }
    });

    let header = new THREE.Mesh(headerGeometry, inputMaterial);
    header.position.set(x, y, z + 0.001);
    this.scene.add(header);

    let headerText = new MeshText2D(name, {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })

    // Scale 100 px font down
    headerText.scale.set(0.0005, 0.0005, 1);
    headerText.position.set(x + headerTextPadding, y - height / 2 + 0.05 / 2, z + 0.002);
    this.scene.add(headerText);

    let valueDescText = new MeshText2D("Value:", {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true
    })

    // Scale 100 px font down
    valueDescText.scale.set(0.0005, 0.0005, 1);
    valueDescText.position.set(x + headerTextPadding, y - height / 2 + 0.05 / 2 - height, z + 0.002);
    this.scene.add(valueDescText);

    let valueText = new MeshText2D(String(value), {
      align: textAlign.left,
      font: '100px Roboto',
      fillStyle: '#ffffff',
      antialias: true,
    })

    // Scale 100 px font down
    valueText.scale.set(0.0005, 0.0005, 1);
    valueText.position.set(x + headerTextPadding + 0.15, y - height / 2 + 0.05 / 2 - height, z + 0.002);
    this.scene.add(valueText);

    return {
      onSetText: (text) => {
        valueText.text = text;
        valueText.updateText();
      }
    }
  }

  render() {
    this.frameId = requestAnimationFrame(this.render.bind(this));

    // update time
    this.time += this.clock.getDelta();
    this.globalUniforms.u_time.value = this.time;

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

}
