import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { byteToHex, range } from '../../globals';
import { SimLibInterfaceService } from '../../core/services/sim-lib-interface/sim-lib-interface.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataService } from '../../core/services/data.service';

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
  public showRegisters = true;
  public showInstructions = true;

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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cpuStateToString(cpuState) {
    switch (cpuState) {
      case 0b10000000:
        return 'trap';
      case 0b01000000:
        return 'fetch';
      case 0b00100000:
        return 'ld_rs1';
      case 0b00010000:
        return 'ld_rs2';
      case 0b00001000:
        return 'exec';
      case 0b00000100:
        return 'shift';
      case 0b00000010:
        return 'stmem';
      case 0b00000001:
        return 'ldmem';
    }
  }
}
