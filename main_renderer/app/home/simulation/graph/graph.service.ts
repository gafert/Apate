import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from '../../../utils/THREE.MeshLine';
import panzoom from '../../../utils/drag.js';
import { Panel } from './Panel';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';

@Injectable()
export class GraphService {
  public initiated = false;
  private domElement;

  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  private frameId;

  private time = 0;
  private clock = new THREE.Clock();
  private globalUniforms = {
    u_time: { type: 'f', value: 0 },
    u_resolution: { type: 'vec2', value: new THREE.Vector2(0, 0) }
  };

  private panels: Panel[] = [];

  private renderLoopFunctions: ((time: number, deltaTime: number) => void)[] = [];
  runInRenderLoop(func: (time: number, deltaTime: number) => void): void {
    this.renderLoopFunctions.push(func);
  }

  constructor(private ngZone: NgZone, private simLibInterfaceService: SimLibInterfaceService) {
    process.on('exit', () => {
      console.log('Exit GraphService');
      this.stopRender();
      this.scene.dispose();
      this.renderer.dispose();
      this.camera = null;
      this.scene = null;
      this.clock = null;
    });

    // this.runInRenderLoop((time, deltaTime) => {
    //   this.panels.forEach((panel, index) => {
    //     panel.changeBorderColor(new THREE.Color(Math.sin(time + index), Math.sin(time * 2.3 + index), Math.sin(time * 5.2 + index)))
    //   });
    // })
  }

  resize() {
    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.globalUniforms.u_resolution.value = new THREE.Vector2(width, height);
  }

  init(domElement: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
      this.domElement = domElement;
      if (this.initiated) {
        domElement.appendChild(this.renderer.domElement);
        this.resize();
        this.render();
        panzoom(this.camera, domElement);
      } else {
        const width = domElement.clientWidth;
        const height = domElement.clientHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.sortObjects = true;
        this.renderer.setPixelRatio(2);
        domElement.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

        this.initiateObjects();
        this.resize();
        panzoom(this.camera, domElement);

        if (document.readyState !== 'loading') {
          this.render();
        } else {
          window.addEventListener('DOMContentLoaded', this.render.bind(this));
        }
        window.addEventListener('resize', this.resize.bind(this));

        this.initiated = true;
      }
    });
  }

  initiateObjects() {
    const panelInstantiation: any = [
      {
        name: 'Instruction Decoder',
        position: { x: 0, y: 0, z: 0 },
        size: { width: 0.95, height: 1.2 },
        ports: [
          {
            name: 'Opcode',
            position: { x: 0.05, y: 0 },
            valueSubject: 'uut__DOT__dbg_insn_opcode__subject',
            valueType: 'hex',
          },
          {
            name: 'Instruction',
            position: { x: 0.5, y: 0 },
            valueSubject: 'uut__DOT__dbg_ascii_instr__subject',
            valueType: 'string',
          },
          {
            name: 'RD',
            position: { x: 0.5, y: 0.2 },
            valueSubject: 'uut__DOT__decoded_rd__subject',
            valueType: 'hex',
          },
          {
            name: 'Immediate',
            position: { x: 0.5, y: 0.4 },
            valueSubject: 'uut__DOT__decoded_imm__subject',
            valueType: 'hex',
          },
          {
            name: 'RS1',
            position: { x: 0.5, y: 0.6 },
            valueSubject: 'uut__DOT__decoded_rs1__subject',
            valueType: 'hex',
          },
          {
            name: 'RS2',
            position: { x: 0.5, y: 0.8 },
            valueSubject: 'uut__DOT__decoded_rs2__subject',
            valueType: 'hex',
          },
        ],
      },
      {
        name: 'Arithmetic Logic Unit',
        position: { x: 2, y: 0.5, z: 0 },
        size: { width: 0.95, height: 1.2 },
        ports: [
          {
            name: 'Instruction',
            position: { x: 0.05, y: 0 },
            valueSubject: 'uut__DOT__dbg_ascii_instr__subject',
            valueType: 'string',
          },
          {
            name: 'Operator 1',
            position: { x: 0.05, y: 0.2 },
            valueSubject: 'uut__DOT__reg_op1__subject',
            valueType: 'hex',
          },
          {
            name: 'Operator 2',
            position: { x: 0.05, y: 0.4 },
            valueSubject: 'uut__DOT__reg_op2__subject',
            valueType: 'hex',
          },
          {
            name: 'Reg out',
            position: { x: 0.05, y: 0.6 },
            valueSubject: 'uut__DOT__reg_out__subject',
            valueType: 'hex',
          },
          {
            name: 'ALU out',
            position: { x: 0.05, y: 0.8 },
            valueSubject: 'uut__DOT__alu_out__subject',
            valueType: 'hex',
          },
        ],
      },
      {
        name: 'Registers',
        position: { x: 1, y: 2, z: 0 },
        size: { width: 0.95, height: 1.4 },
        ports: [
          {
            name: 'Writing Data',
            position: { x: 0.05, y: 0 },
            valueSubject: 'uut__DOT__cpuregs_write__subject',
            valueType: 'hex',
          },
          {
            name: 'Address (RD)',
            position: { x: 0.05, y: 0.2 },
            valueSubject: 'uut__DOT__decoded_rd__subject',
            valueType: 'hex',
          },
          {
            name: 'Data to write',
            position: { x: 0.05, y: 0.4 },
            valueSubject: 'uut__DOT__cpuregs_wrdata__subject',
            valueType: 'hex',
          },
          {
            name: 'Read register at address (RS 1)',
            position: { x: 0.5, y: 0 },
            valueSubject: 'uut__DOT__cpuregs_rs1__subject',
            valueType: 'hex',
          },
          {
            name: 'RS 2 (only in dual port)',
            position: { x: 0.5, y: 0.2 },
            valueSubject: 'uut__DOT__cpuregs_rs2__subject',
            valueType: 'hex',
          }
        ],
      },
    ];

    for (const panel of panelInstantiation) {
      const _panel = new Panel(
        this.scene,
        panel.position.x,
        panel.position.y,
        panel.position.z,
        panel.name,
        panel.size.width,
        panel.size.height,
        this.globalUniforms,
        this.simLibInterfaceService
      );

      for (const port of panel.ports) {
        _panel.addPort(port.position.x  , panel.size.height - port.position.y - 0.2, port.name, undefined, port.valueType, port.valueSubject);
      }

      this.panels.push(_panel);
    }

    const links = [
      {
        from: {
          panel: panelInstantiation[0],
          port: panelInstantiation[0].ports[1],
        },
        to: {
          panel: panelInstantiation[1],
          port: panelInstantiation[1].ports[0],
        },
      },
    ];

    // for (const link of links) {
    //   this.addLink(
    //     link.from.panel.position.x + link.from.port.position.x + 0.4,
    //     link.from.panel.position.y + link.from.port.position.y - 0.04,
    //     link.to.panel.position.x + link.to.port.position.x,
    //     link.to.panel.position.y + link.to.port.position.y - 0.04
    //   );
    // }
  }



  addLink(x0, y0, x1, y1) {
    let strokeTexture: THREE.Texture;

    const init = () => {
      const curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(x0 - 0.05, y0, 0),
          new THREE.Vector3(x0 + (x1 - x0) / 2 - 0.2, y0 + 0.05, 0),
          new THREE.Vector3(x0 + (x1 - x0) / 2 + 0.2, y1 - 0.05, 0),
          new THREE.Vector3(x1 + 0.05, y1, 0)
        ],
        false,
        'chordal'
      );

      const points = curve.getPoints(50);

      let length = 0;
      for (let i = 1; i < points.length; i++) {
        length += Math.sqrt(Math.pow(points[i].y - points[i - 1].y, 2) + Math.pow(points[i].x - points[i - 1].x, 2));
      }

      const lineBasicMaterial = new MeshLineMaterial({
        // color: new THREE.Color(readStyleProperty('grey1')),
        lineWidth: 0.08,
        sizeAttenuation: true,
        useMap: true,
        map: strokeTexture,
        repeat: new THREE.Vector2(length * 10, 1),
        offset: new THREE.Vector2(0.5, 0)
      });

      this.runInRenderLoop((time, deltaTime) => lineBasicMaterial.offset.add(new THREE.Vector2(3 * deltaTime, 0)));

      const line = new MeshLine();
      const geometry = new THREE.Geometry();
      for (const point of points) {
        geometry.vertices.push(point);
      }

      line.setGeometry(geometry, function(p) {
        return 1 - Math.sin(p * Math.PI) / 2.5;
      });

      const lineMesh = new THREE.Mesh(line.geometry, lineBasicMaterial);
      lineMesh.renderOrder = 1;
      this.scene.add(lineMesh);
    };

    const loader = new THREE.TextureLoader();
    loader.load('assets/Arrow.png', function (texture) {
      strokeTexture = texture;
      strokeTexture.wrapS = strokeTexture.wrapT = THREE.RepeatWrapping;
      init();
    });
  }

  render() {
    this.ngZone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.render.bind(this));
      // update time
      const deltaTime = this.clock.getDelta();
      this.time += deltaTime;
      for (const func of this.renderLoopFunctions) {
        func(this.time, deltaTime);
      }
      this.globalUniforms.u_time.value = this.time;
      this.renderer.render(this.scene, this.camera);
    });
  }

  stopRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
