import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import {byteToHex, range} from '../../globals';
import {Cpu} from '../../core/services/cpu.service';
import {InstructionsComponent} from './instructions/instructions.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DataKeys, DataService} from '../../core/services/data.service';
import {Router} from '@angular/router';
import {GraphService} from './graph/graph.service';
import RISCV_STAGES from '../../yamls/stages.yml';
import {Bindings} from '../../core/services/bindingSubjects';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;
  public byteToHex = byteToHex;
  public DataKeys = DataKeys;
  public range = range;
  private ngUnsubscribe = new Subject();
  public selectedTab = 'overview';

  public elaborateSteps = true;

  public stage = 'Initiate the simulation';
  public info;
  private instrCounter = 0;
  private infoCounter = 0;

  public stepDisabled = false;

  private currentArea = this.selectedTab;

  constructor(
    public cpu: Cpu,
    private dataService: DataService,
    private router: Router,
    private graphService: GraphService,
    private cd: ChangeDetectorRef
  ) {
    this.elaborateSteps = this.dataService.data[DataKeys.ELABORATE_STEPS].value;
  }

  onChangeElaborateSteps(newVal) {
    this.dataService.setSetting(DataKeys.ELABORATE_STEPS, newVal.checked);
    this.elaborateSteps = newVal.checked; // Set this only for the variable, does not affect the checkbox

    // Hide infos if not elaborate
    if (!this.elaborateSteps) {
      this.info = null;
    }
  }

  ngOnInit(): void {
    this.dataService.data[DataKeys.FOLDER_PATH].pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (value) {
        // Search for .elf in project
        fs.readdir(value, (err, files) => {
          for (const file of files) {
            if (file.split('.').pop().includes('elf')) {
              this.dataService.setSetting(DataKeys.ELF_PATH, path.join(value, file));
              break;
            }
          }
        });
      }
    });
  }

  focusArea(area) {
    this.graphService.goToArea(area, false);
    this.selectedTab = area;
  }

  initiateSimulation() {
    const elfPath = this.dataService.getSetting(DataKeys.ELF_PATH);

    if (elfPath) {
      if (elfPath.indexOf('.elf') > 0) {
        this.cpu.initSimulation(elfPath);
        // Wait for program counter to be 0 before reloading
        setTimeout(() => {
          this.instructionsComponent.reload();
        }, 100);
      }
    }

    this.instrCounter = 0;
    this.infoCounter = -1;
  }

  async stepSimulation() {
    if (!this.elaborateSteps) {
      this.stage = this.cpu.advanceSimulationClock();
      return;
    }

    // Disable step before animation
    this.stepDisabled = true;

    const info = this.getNextInfo(this.cpu.bindings);
    this.info = info.text;

    if (info.exec)
      this.stage = this.cpu.advanceSimulationClock();

    // Go to area which should be displayed if the area is not changing this time
    if (this.selectedTab !== this.currentArea && !info.area) {
      await this.graphService.goToArea(this.currentArea, true);
      this.selectedTab = this.currentArea;
    }

    // Animations to area
    if (info.area) {
      // First show area then focus element
      await this.graphService.goToArea(info.area, true)
      this.selectedTab = info.area;
      this.currentArea = info.area;
      if (info.focus) {
        await this.graphService.focusOnElement(info.focus);
      }
    } else if (info.focus) {
      await this.graphService.focusOnElement(info.focus);
    }

    // Enable step after animation
    this.stepDisabled = false;
  }


  getNextInfo(bindings: Bindings): { text: string; highlight: []; exec?: string; area?: string; focus?: string } {
    if (this.infoCounter + 1 >= RISCV_STAGES[this.instrCounter].infos.length) {
      // There is no info left in this instruction, go to first info of new instruction
      this.infoCounter = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Which is the new instruction?
        // First check if a instruction exits in this stage
        if (this.instrCounter + 1 >= RISCV_STAGES.length) {
          // No new instruction exits
          // Reset counter
          this.instrCounter = -1; // -1 because loop checks one more time of instruction complies
        } else {
          this.instrCounter++;
          // Check if this instruction fullfills the requirements
          const instr = RISCV_STAGES[this.instrCounter];

          const compliesWithIf = (instr.if !== undefined) ? instr.if(bindings) : true;
          let compliesWithInstruction = true;
          if (instr.instr?.length > 0 && bindings.instruction.value) {
            compliesWithInstruction = instr.instr.indexOf(bindings.instruction.value.opcodeName) >= 0;
          }

          if ((compliesWithIf && compliesWithInstruction)) {
            // Does comply, break out of loop with new instruction counter set
            break;
          }
        }
      }
    } else {
      this.infoCounter++;
    }
    return RISCV_STAGES[this.instrCounter].infos[this.infoCounter];
  }

  runSimulation() {
    this.cpu.runUntilBreak();
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
