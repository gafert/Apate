import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as d3 from "d3";
import * as Store from "electron-store";
import * as fs from "fs";
import * as path from "path";
import {byteToHex, range} from "../../globals";
import {SimLibInterfaceService} from "../../core/services";
import {spawn} from "child_process";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, AfterViewInit {
  public byteToHex = byteToHex;
  public range = range;
  public showRegisters = true;
  public showInstructions = true;
  private grid;

  /** Is set by loading settings input */
  public simulationElfPath = "unset";

  private store = new Store();
  private toolchainPath = this.store.get('toolchainPath');
  private toolchainPrefix = this.store.get('toolchainPrefix');
  private folderPath = this.store.get('folderPath');
  private objdumpPath = `${this.toolchainPath}/${this.toolchainPrefix}objdump`;
  private objcopyPath = `${this.toolchainPath}/${this.toolchainPrefix}objcopy`;
  private simulationHexPath = `${this.folderPath}/program.hex`;
  private objcopyFlags = "-O verilog";

  constructor(public simLibInterfaceService: SimLibInterfaceService, private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if(this.folderPath) {
      // Search for .elf in project
      fs.readdir(this.folderPath, (err, files) => {
        for (let file of files) {
          console.log(file.split('.').pop());
          if (file.split('.').pop().indexOf("elf") >= 0) {
            this.simulationElfPath = this.folderPath + "/" + file;
            this.changeDetection.detectChanges();
            console.log(this.simulationElfPath);
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // Needs timeout so grid is rendered before it is initiated
      this.grid = window.GridStack.init({
        float: true,
        verticalMargin: 0,
        disableOneColumnMode: true
      });
      this.setHeightOfGrid();
      window.addEventListener('resize', () => this.setHeightOfGrid());
  }

  setHeightOfGrid() {
    this.grid.cellHeight((d3.select('#simulation-container').node() as HTMLElement)
      .getBoundingClientRect().height / 14);
  }

  changeFont(event) {
    d3.select('html').style('font-size', event.target.value + "pt");
    this.setHeightOfGrid();
  }

  initiateSimulation() {
    this.generateHexFromElf().then(() => {
      this.simLibInterfaceService.initSimulation(this.simulationHexPath);
    })
  }

  generateHexFromElf() {
    return new Promise((resolve, reject) => {
      const gcc = spawn(this.objcopyPath, [...`${this.objcopyFlags} ${this.simulationElfPath} ${this.simulationHexPath}`.split(' ')]);
      gcc.on('error', (err) => {
        console.error('Failed to start gcc', err);
        reject()
      });
      gcc.on('close', (code) => {
        console.log('Exited objcopy with code', code);
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
}
