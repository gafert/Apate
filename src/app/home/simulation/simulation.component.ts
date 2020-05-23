import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import * as d3 from "d3";
import * as fs from "fs";
import * as path from "path";
import {byteToHex, range} from "../../globals";
import {DataService, SimLibInterfaceService} from "../../core/services";
import {InstructionsComponent} from "./instructions/instructions.component";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, AfterViewInit {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;

  public byteToHex = byteToHex;
  public range = range;
  public showRegisters = true;
  public showInstructions = true;
  private grid;

  /** Is set by loading settings input */
  public simulationElfPath;

  public stepOptions = {
    clock: {
      name: "Clock",
      selected: false
    },
    pc: {
      name: "Program Counter",
      selected: true
    }
  };

  constructor(public simLibInterfaceService: SimLibInterfaceService,
              private changeDetection: ChangeDetectorRef,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.folderPath.subscribe(value => {
      if (value) {
        // Search for .elf in project
        fs.readdir(value, (err, files) => {
          for (let file of files) {
            if (file.split('.').pop().indexOf("elf") >= 0) {
              this.simulationElfPath = path.join(value, file);
            }
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // Needs timeout so grid is rendered before it is initiated
    this.grid = window.GridStack.init({
      float: true,
      verticalMargin: 0,
      disableOneColumnMode: true
    });
    this.setSizeOfGrid();
    window.addEventListener('resize', () => this.setSizeOfGrid());
  }

  setSizeOfGrid() {
    this.grid.cellHeight((d3.select('#simulation-container').node() as HTMLElement)
      .getBoundingClientRect().height / 14);

    const width = (d3.select('#simulation-container').node() as HTMLElement).getBoundingClientRect().width;
    this.grid.column(Number((width / 130).toFixed(0)));
    console.log(Number((width / 130).toFixed(0)));
  }

  initiateSimulation() {
    if (this.simulationElfPath) {
      if (this.simulationElfPath.indexOf('.elf') > 0) {
        this.simLibInterfaceService.initSimulation(this.simulationElfPath);
        this.instructionsComponent.reload();
      }
    }
  }

  stepSimulation() {
    if (this.stepOptions.clock.selected) {
      this.simLibInterfaceService.advanceSimulationClock();
    } else {
      this.simLibInterfaceService.advanceSimulationPc();
    }
  }
}
