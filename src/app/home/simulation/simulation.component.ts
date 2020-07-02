import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as d3 from "d3";
import * as fs from "fs";
import * as path from "path";
import {byteToHex, range} from "../../globals";
import {DataService, SimLibInterfaceService} from "../../core/services";
import {InstructionsComponent} from "./instructions/instructions.component";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;
  private ngUnsubscribe = new Subject();

  public byteToHex = byteToHex;
  public range = range;
  public showRegisters = true;
  public showInstructions = true;

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
              private dataService: DataService,
              private ngZone: NgZone) {
    console.log("Dasd");
  }

  ngOnInit(): void {
    this.dataService.folderPath.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      if (value) {
        // Search for .elf in project
        fs.readdir(value, (err, files) => {
          for (let file of files) {
            if (file.split('.').pop().indexOf("elf") >= 0) {
              // Possible fix for elf not beeing loaded
              this.ngZone.run(() => {
                this.simulationElfPath = path.join(value, file);
              })
              break;
            }
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {

  }

  setSizeOfGrid() {
    document.getElementById('simulation-container').getBoundingClientRect().height;
  }

  initiateSimulation() {
    if (this.simulationElfPath) {
      if (this.simulationElfPath.indexOf('.elf') > 0) {
        this.simLibInterfaceService.initSimulation(this.simulationElfPath);
        // Wait for program counter to be 0 before reloading
        setTimeout(() => {
          this.instructionsComponent.reload();
        }, 100);
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
