import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { byteToHex, range } from '../../globals';
import { CpuInterface } from '../../core/services/cpu-interface/cpu-interface.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';
import { GraphService } from './graph/graph.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;
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
  private ngUnsubscribe = new Subject();
  public selectedTab = 'overview';

  constructor(
    public simLibInterfaceService: CpuInterface,
    private dataService: DataService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.dataService.folderPath.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (value) {
        // Search for .elf in project
        fs.readdir(value, (err, files) => {
          for (const file of files) {
            if (file.split('.').pop().includes('elf')) {
              this.simulationElfPath = path.join(value, file);
              break;
            }
          }
        });
      }
    });
  }

  isSelectedButton(pathName) {
    return this.router.url.includes(pathName);
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
