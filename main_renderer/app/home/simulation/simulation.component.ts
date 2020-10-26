import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { byteToHex, range } from '../../globals';
import { SimLibInterfaceService } from '../../core/services/sim-lib-interface/sim-lib-interface.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { CPU_STATES } from '../../core/services/sim-lib-interface/bindingSubjects';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;
  private ngUnsubscribe = new Subject();

  public byteToHex = byteToHex;
  public range = range;

  /** Is set by loading settings input */
  public simulationElfPath;

  public stepOptions = {
    clock: {
      name: 'Clock',
      selected: false
    },
    pc: {
      name: 'Program Counter',
      selected: true
    }
  };

  constructor(
    public simLibInterfaceService: SimLibInterfaceService,
    private dataService: DataService,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.dataService.folderPath.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (value) {
        // Search for .elf in project
        fs.readdir(value, (err, files) => {
          for (const file of files) {
            if (file.split('.').pop().includes('elf')) {
              // Possible fix for elf not beeing loaded
              this.ngZone.run(() => {
                this.simulationElfPath = path.join(value, file);
              });
              break;
            }
          }
        });
      }
    });
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

  runSimulation() {
    this.simLibInterfaceService.runUntilBreak();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cpuStateToString(cpuState) {
    switch (cpuState) {
      default:
        return cpuState;
    }
  }
}
