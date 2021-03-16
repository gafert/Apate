import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { byteToHex, range, readStyleProperty } from '../../utils/helper';
import { CPUService } from './services/cpu.service';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { BehaviorSubject } from 'rxjs';
import { DataKeys, DataService } from '../../services/data.service';
import { GraphService } from './services/graph.service';
import RISCV_STAGES from '../../yamls/stages.yml';
import { Bindings, CPU_STATE_NAMES, CPU_STATES } from './services/bindingSubjects';
import { Areas } from './services/graphServiceHelpers/helpers';
import { ProjectService } from '../../services/project.service';
import { animate, animation, sequence, state, style, transition, trigger, useAnimation } from '@angular/animations';

const closedStyle = style({
  maxHeight: '0',
  width: '0',
  paddingTop: '0.3em',
  paddingBottom: '0.3em',
  paddingLeft: '0',
  paddingRight: '0',
  right: '2em',
  background: 'white'
});

const hideAnimation = animation([
  sequence([
    style({
      maxHeight: '*',
      paddingTop: '*',
      paddingBottom: '*',
      right: '*'
    }), // Apparently these values are only known once it they are styled here
    animate('0.2s', style({ maxHeight: '0em' })),
    animate('0.1s', style({
      paddingTop: '0.3em',
      paddingBottom: '0.3em'
    })),
    animate('0.2s', closedStyle)
  ])
]);

const showAnimation = animation([
  sequence([
    closedStyle,
    animate('0.2s', style({
      width: '*',
      paddingLeft: '*',
      paddingRight: '*',
      background: '*',
      right: '*'
    })),
    animate('0.1s linear', style({
      paddingTop: '*',
      paddingBottom: '*'
    })),
    animate('0.2s linear')
  ])
]);

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
  animations: [
    trigger('openClose', [
      state('closed', closedStyle),
      state('open', style({})),
      transition('open => closed', [useAnimation(hideAnimation)]),
      transition('closed => open', [useAnimation(showAnimation)]),
      transition('open => void', [
        sequence([
          useAnimation(hideAnimation),
          animate('0.2s', style({ opacity: '0' })),
          style({ display: 'none' })
        ])
      ]),
      transition('closed => void', [
        sequence([
          animate('0.2s', style({ opacity: '0' })),
          style({ display: 'none' })
        ])
      ]),
      transition('void => open', [
        sequence([
          style({ display: 'block', opacity: '0' }),
          closedStyle,
          animate('0.2s', style({ opacity: '1' })),
          useAnimation(showAnimation),
        ])
      ])
    ])
  ]
})
export class SimulationComponent implements OnInit, OnDestroy {
  @ViewChild('instructionsComponent') instructionsComponent: InstructionsComponent;
  public byteToHex = byteToHex;
  public readStyleProperty = readStyleProperty;
  public range = range;
  public showInfo = true;
  // If step by step should be enabled
  public elaborateSteps = true;
  // Step may be disabled if animations are running
  public stepDisabled = false;
  public selectedTab: Areas = this.dataService.getVolatileData(this.constructor.name, 'selectedTab', 'overview');
  // Displayed on top
  public stageName = this.dataService.getVolatileData(this.constructor.name, 'stageName', 'Initiate the simulation');
  public stageSubject: BehaviorSubject<CPU_STATES> = this.dataService.getVolatileData(this.constructor.name, 'stageSubject', new BehaviorSubject<CPU_STATES>(null));
  // Infotext
  public infoText = this.dataService.getVolatileData(this.constructor.name, 'infoText', undefined);
  // Set by elaborate steps, will reset selectedTab to this
  private currentArea = this.dataService.getVolatileData(this.constructor.name, 'currentArea', this.selectedTab);
  private currentFocus = this.dataService.getVolatileData(this.constructor.name, 'currentFocus', undefined);
  // Used by getNextInfo()
  private instrCounter = this.dataService.getVolatileData(this.constructor.name, 'instrCounter', 0);
  private infoCounter = this.dataService.getVolatileData(this.constructor.name, 'infoCounter', 0);
  private stageExecuted = this.dataService.getVolatileData(this.constructor.name, 'stageExecuted', false);

  constructor(
    public cpu: CPUService,
    private dataService: DataService,
    private graphService: GraphService,
    private changeDetection: ChangeDetectorRef,
    private projectService: ProjectService
  ) {
    this.elaborateSteps = this.dataService.data[DataKeys.ELABORATE_STEPS].value;
    if (this.elaborateSteps === null) {
      // Set default value to true
      this.elaborateSteps = true;
      this.dataService.setSetting(DataKeys.ELABORATE_STEPS, true);
    }

    this.graphService.onChangeCurrentArea.subscribe(({ area, animate }) => {
      this.goToArea(area, animate);
      // Comes from other zone, call change detection manually
      this.changeDetection.detectChanges();
    });
  }

  private _stage: CPU_STATES;

  public get stage() {
    return this._stage;
  }

  public set stage(stage: CPU_STATES) {
    this._stage = stage;
    this.stageSubject.next(this._stage);
  }

  ngOnDestroy() {
    this.dataService.setVolatileData(this.constructor.name, 'selectedTab', this.selectedTab);
    this.dataService.setVolatileData(this.constructor.name, 'stageSubject', this.stageSubject);
    this.dataService.setVolatileData(this.constructor.name, 'stageName', this.stageName);
    this.dataService.setVolatileData(this.constructor.name, 'infoText', this.infoText);
    this.dataService.setVolatileData(this.constructor.name, 'currentArea', this.currentArea);
    this.dataService.setVolatileData(this.constructor.name, 'currentFocus', this.currentFocus);
    this.dataService.setVolatileData(this.constructor.name, 'instrCounter', this.instrCounter);
    this.dataService.setVolatileData(this.constructor.name, 'infoCounter', this.infoCounter);
    this.dataService.setVolatileData(this.constructor.name, 'stageExecuted', this.stageExecuted);
  }

  ngOnInit() {
    if (this.dataService.getSetting(DataKeys.PROJECT_PATH))
      this.projectService.searchForElfInProject();
  }

  onChangeElaborateSteps(newVal) {
    this.dataService.setSetting(DataKeys.ELABORATE_STEPS, newVal.checked);
    this.elaborateSteps = newVal.checked; // Set this only for the variable, does not affect the checkbox

    // Hide infos if not elaborate
    if (!this.elaborateSteps) {
      this.infoText = null;
      this.graphService.removeAllHighlights();
    } else {
      this.setNextInfoByStage(this.stage);
      this.stepSimulation();
    }
  }

  public goToArea(area, animate = false) {
    this.graphService.goToArea(area, animate);
    this.selectedTab = area;
  }

  initiateSimulation() {
    // Reset all cpu values
    this.cpu.bindings.clearAllValues();

    // For infoText getting
    this.instrCounter = 0;
    this.infoCounter = -1;

    // Set first stage text manually
    this.stageName = CPU_STATE_NAMES[CPU_STATES.FETCH];
    this.stage = CPU_STATES.FETCH;
    this.graphService.highlightStage(this.stage, false);

    // Load elf into CPU
    this.cpu.init(this.dataService.getSetting(DataKeys.ELF_PATH));
  }

  public async stepSimulation() {
    if (!this.elaborateSteps) {
      this.stage = this.cpu.advanceSimulationClock();
      this.stageExecuted = true;
      this.stageName = CPU_STATE_NAMES[this.stage];
      this.graphService.highlightStage(this.stage, true);
      console.log('%cCPU STATE: ' + this.stageName, 'color: #7827e0');
      return;
    }

    // Disable step before animation
    this.stepDisabled = true;

    const info = this.getNextInfo(this.cpu.bindings);
    this.infoText = info.text;
    this.showInfo = true;

    if (info.startOfStage) {
      this.stageExecuted = false;
      this.stage = info.startOfStage;
      this.stageName = CPU_STATE_NAMES[this.stage];
      this.graphService.highlightStage(this.stage, true);
    }

    if (info.exec) {
      console.log('%cCPU STATE: ' + this.cpu.advanceSimulationClock(), 'color: #7F2FeF');
      this.stageExecuted = true;
    }

    if (info.highlight) {
      this.graphService.removeAllHighlights();
      for (const id of info.highlight) {
        this.graphService.highlightElement(id);
      }
    }

    // New area --> focus area
    // New focus --> apply new focus
    // Animations to focusArea
    if (info.focusArea) {
      // First show focusArea then focusElement element
      await this.graphService.goToArea(info.focusArea, true);
      this.selectedTab = info.focusArea;
      this.currentArea = info.focusArea;
      this.currentFocus = null; // Assume that we dont focus inside of area
      if (info.focusElement) {
        await this.graphService.goToFocus(info.focusElement);
        this.currentFocus = info.focusElement;
      }
    } else {
      // No new area but area is not the same --> focus area
      // Go to focusArea which should be displayed if the focusArea is not changing this time
      if (this.selectedTab !== this.currentArea) {
        await this.graphService.goToArea(this.currentArea, true);
        this.selectedTab = this.currentArea;
      }

      // No new area but new focus
      if (info.focusElement) {
        await this.graphService.goToFocus(info.focusElement);
        this.currentFocus = info.focusElement;
      }

      // No new focus but there is a current focus
      if (!info.focusElement && this.currentFocus) {
        // No new focus and no area --> apply old focus
        await this.graphService.goToFocus(this.currentFocus);
      }
    }


    // Enable step after animation
    this.stepDisabled = false;
  }

  /**
   * Find point in RISCV_STAGES to continue from. Uses the 'exec' property and finds the first matching stage
   * @param stage From which stage to continue
   */
  public setNextInfoByStage(stage: CPU_STATES) {
    let focusElement, focusArea, instrCounter, infoCounter, reachedCurrentStart;

    for (instrCounter = 0; instrCounter < RISCV_STAGES.length; instrCounter++) {
      const infos = RISCV_STAGES[instrCounter].infos;

      if (stage === RISCV_STAGES[instrCounter].start) {
        reachedCurrentStart = true;
        if (!this.stageExecuted) {
          console.log('Current stage not executed yet, going to info before start of this stage');
          break;
        }
      } else if (reachedCurrentStart && RISCV_STAGES[instrCounter].start) {
        console.log('Current stage already executed, going to next info before next start');
        break;
      }

      // Get last focusArea and focusElement if needed
      for (infoCounter = 0; infoCounter < infos.length; infoCounter++) {
        const info = infos[infoCounter];
        focusArea = info.focusArea ? info.focusArea : focusArea;
        focusElement = info.focusElement ? info.focusElement : focusElement;
      }
    }

    instrCounter = instrCounter == 0 ? RISCV_STAGES.length - 1 : instrCounter - 1;
    infoCounter = RISCV_STAGES[instrCounter].infos.length - 1;

    this.currentArea = focusArea;
    this.currentFocus = focusElement;
    this.infoCounter = infoCounter;
    this.instrCounter = instrCounter;
  }

  /**
   * Run until a specific PC is reached and continue from there normally
   * @param pc
   */
  public runToPC(pc) {
    this.graphService.update.animations = false;
    this.graphService.update.updateVisibilities = false;
    this.graphService.update.updateSignalTexts = false;
    this.cpu.runUntilPC(pc).then(() => {
      this.graphService.update.animations = true;
      this.graphService.update.updateVisibilities = true;
      this.graphService.update.updateSignalTexts = true;
      this.graphService.updateGraph(true);
      this.stageExecuted = true;
      this.setNextInfoByStage(CPU_STATES.ADVANCE_PC);
      this.stepSimulation();
    });
  }

  /**
   * Reset simulation
   */
  public resetSimulation() {
    this.cpu.reset();
    this.infoText = undefined;
    this.instrCounter = 0;
    this.infoCounter = 0;
    this.currentFocus = undefined;
    this.currentFocus = undefined;
    this.stageExecuted = false;
    this.stageSubject.next(null);
    this.goToArea('overview');
    this.graphService.removeAllHighlights();
    this.stageName = 'Initiate the simulation';
  }

  /**
   * Get the next infoText text which fits current instruction and other {@link Bindings | Binding values} which can be checked by the 'if' property.
   *
   * Depends on {@link RISCV_STAGES | RISCV_STAGES}, this.infoCounter, this.instrCounter.
   *
   * Example {@link RISCV_STAGES | RISCV_STAGES} yaml:
   *
   * ```yaml
   * - instr: [branch]
   *   if: !!js/function  'function (bindings) { return bindings.branchResult.value == true; }'
   *   infos:
   * ```
   *
   * Checks:
   *
   * 1. 'bindings.instruction.value.opcodeName' needs to be inside the 'instr' array. <br>
   *
   * 2. If there is an 'if' parameter (optional, default true) this function will be executed.
   *
   * Both must equal true to display infos
   *
   * @param bindings Bin
   * @private
   */
  private getNextInfo(bindings: Bindings): { text: string; highlight: []; exec?: CPU_STATES; focusArea?: Areas; focusElement?: string; startOfStage?: CPU_STATES } {
    let startOfStage = null;

    if (this.infoCounter + 1 >= RISCV_STAGES[this.instrCounter].infos.length) {
      // There is no infoText left in this instruction, go to first infoText of new instruction
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

          if (instr.start) {
            // Start of new stage
            // But must not be executed
            startOfStage = instr.start;
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
    return { ...RISCV_STAGES[this.instrCounter].infos[this.infoCounter], startOfStage: startOfStage };
  }
}
