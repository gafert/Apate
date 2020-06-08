import {AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {MeshLine, MeshLineMaterial} from 'three.meshline'
import panzoom from './drag.js';
import {SimLibInterfaceService} from "../../../core/services";
import {readStyleProperty} from "../../../utils/helper";
import {Panel} from './Panel';

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

  private panels: Panel[] = [];

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

  initiateObjects() {
    const panelInstantiation: any = [
      {
        name: "Instruction Decoder",
        position: {x: 0, y: 0, z: 0},
        size: {width: 0.95, height: 1.2},
        ports: [
          {
            name: "Opcode",
            position: {x: 0.05, y: 1},
            valueSubject: "uut__DOT__dbg_insn_opcode__subject",
            valueType: "hex"
          },
          {
            name: "Instruction",
            position: {x: 0.5, y: 1},
            valueSubject: "uut__DOT__dbg_ascii_instr__subject",
            valueType: "string"
          },
          {
            name: "RD",
            position: {x: 0.5, y: 0.8},
            valueSubject: "uut__DOT__decoded_rd__subject",
            valueType: "hex"
          },
          {
            name: "Immediate",
            position: {x: 0.5, y: 0.6},
            valueSubject: "uut__DOT__decoded_imm__subject",
            valueType: "hex"
          },
          {
            name: "RS1",
            position: {x: 0.5, y: 0.4},
            valueSubject: "uut__DOT__decoded_rs1__subject",
            valueType: "hex"
          },
          {
            name: "RS2",
            position: {x: 0.5, y: 0.2},
            valueSubject: "uut__DOT__decoded_rs2__subject",
            valueType: "hex"
          }
        ]
      },
      {
        name: "Arithmetic Logic Unit",
        position: {x: 2, y: 0.5, z: 0},
        size: {width: 0.95, height: 1.2},
        ports: [
          {
            name: "Instruction",
            position: {x: 0.05, y: 1},
            valueSubject: "uut__DOT__dbg_ascii_instr__subject",
            valueType: "string"
          },
        ]
      }
    ]

    for (const panel of panelInstantiation) {
      let _panel = new Panel(
        this.scene,
        panel.position.x,
        panel.position.y,
        panel.position.z,
        panel.name,
        panel.size.width,
        panel.size.height,
        this.globalUniforms,
        this.simLibInterfaceService);

      for (const port of panel.ports) {
        _panel.addPort(port.position.x, port.position.y, port.name, undefined, port.valueType, port.valueSubject)
      }

      this.panels.push(_panel);
    }

    const links = [
      {
        from: {
          panel: panelInstantiation[0],
          port: panelInstantiation[0].ports[1]
        },
        to: {
          panel: panelInstantiation[1],
          port: panelInstantiation[1].ports[0]
        }
      }
    ]

    for (const link of links) {
      this.addLink(
        link.from.panel.position.x + link.from.port.position.x + 0.4,
        link.from.panel.position.y + link.from.port.position.y - 0.04,
        link.to.panel.position.x + link.to.port.position.x,
        link.to.panel.position.y + link.to.port.position.y - 0.04)
    }
  }

  addLink(x0, y0, x1, y1) {
    let lineBasicMaterial = new MeshLineMaterial({
      color: new THREE.Color(readStyleProperty('grey1')),
      lineWidth: 0.1,
      sizeAttenuation: true
    });

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x0 - 0.05, y0, 0),
      new THREE.Vector3(x0 + (x1 - x0) / 2, y0 + 0.07, 0),
      new THREE.Vector3(x0 + (x1 - x0) / 2, y1 - 0.07, 0),
      new THREE.Vector3(x1 + 0.05, y1, 0)], false, 'chordal');

    const points = curve.getPoints(50);

    let line = new MeshLine()
    const geometry = new THREE.Geometry();
    for (const point of points) {
      geometry.vertices.push(point);
    }

    line.setGeometry(geometry, function (p) {
      console.log(p);
      return 1 - (Math.sin(p * Math.PI) / 1.5);
    });

    let lineMesh = new THREE.Mesh(line.geometry, lineBasicMaterial);
    lineMesh.renderOrder = 1;
    this.scene.add(lineMesh);
  }

  render() {
    this.frameId = requestAnimationFrame(this.render.bind(this));

    // update time
    this.time += this.clock.getDelta();
    this.globalUniforms.u_time.value = this.time;

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

}
