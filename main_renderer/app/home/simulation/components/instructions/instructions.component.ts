import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { byteToBinary, byteToHex } from '../../../../utils/helper';
import { ELF, ELFSectionHeader, ElfSymbol, SHF_CONSTANTS } from '../../../../utils/elfParser';
import { Instruction, INSTRUCTIONS_DESCRIPTIONS } from '../../../../utils/instructionParser';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataKeys, DataService } from '../../../../services/data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { skipWhile, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import CPU_REGISTER_NAMES from '../../../../yamls/register.yml';

interface OptimizedList {
  instruction?: Instruction;
  section?: ELFSectionHeader;
  symbol?: ElfSymbol;
}

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  animations: [
    trigger(
      'infoAnimation',
      [
        transition(
          ':enter',
          [
            style({ maxHeight: 0 }),
            animate('1s ease-out',
              style({ maxHeight: 500 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ maxHeight: 500 }),
            animate('0.5s ease-out',
              style({ maxHeight: 0 }))
          ]
        )
      ]
    )
  ]
})
@UntilDestroy()
export class InstructionsComponent implements OnChanges, AfterViewInit {
  public readonly byteToHex = byteToHex;
  public readonly byteToBinary = byteToBinary;
  public readonly DataKeys = DataKeys;
  public readonly cpuRegDefinitions = CPU_REGISTER_NAMES;
  @Input() public programCounter;
  @Input() public parsedElf: ELF;
  @Output() onRunToPC: EventEmitter<number> = new EventEmitter();
  @Output() onLoadElf: EventEmitter<any> = new EventEmitter();
  public optimizedInstructionList: OptimizedList[] = [];
  @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;
  private viewInitiated = new BehaviorSubject(false);

  constructor(public dataService: DataService) {

  }

  ngAfterViewInit() {
    this.viewInitiated.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parsedElf?.currentValue) {
      this.optimizedInstructionList = [];
      for (const sectionHeader of this.parsedElf.section_headers) {
        if (this.isSHFExecInstr(sectionHeader.sh_flags)) {
          this.optimizedInstructionList.push({ section: sectionHeader });
          if (sectionHeader?.symbols) {
            for (const symbol of sectionHeader.symbols) {
              this.optimizedInstructionList.push({ symbol: symbol });
              if (symbol?.instructions) {
                for (const instruction of symbol.instructions) {
                  this.optimizedInstructionList.push({ instruction: instruction });
                  // Set pc once the view is initiated
                  this.viewInitiated.pipe(
                    untilDestroyed(this),
                    skipWhile((viewInitiated) => viewInitiated === false),
                    take(1)).subscribe(() => {
                    this.setInstructionColor(0, this.programCounter);
                  });
                }
              }
            }
          }
        }
      }
    }

    // Set the on each change, but only after view is initiated
    if (changes.programCounter && this.viewInitiated.value === true) {
      if (changes.programCounter.currentValue !== changes.programCounter.previousValue) {
        this.setInstructionColor(changes.programCounter.previousValue, changes.programCounter.currentValue);
      }
    }
  }

  initiateSimulation() {
    this.onLoadElf.emit();
  }

  expandInfo(instruction: Instruction) {
    (instruction as any).infoExpanded = !(instruction as any).infoExpanded;
  }

  getInfoOfInstruction(instructionName) {
    return INSTRUCTIONS_DESCRIPTIONS[instructionName];
  }

  isSHFExecInstr(flags) {
    return flags & SHF_CONSTANTS.SHF_EXECINSTR;
  }

  runUntilPC(pc: number) {
    this.onRunToPC.emit(pc);
  }

  scrollToPc(pc) {
    if (!pc) return;
    const elements = this.optimizedInstructionList.filter((e) => e.instruction?.pc == pc);
    if (elements.length > 0)
      this.virtualScroller.scrollInto(elements[0], true, -100);
  }

  private setInstructionColor(oldPC, newPC) {
    this.scrollToPc(newPC);
    const elementsOld = this.optimizedInstructionList.filter((e) => e.instruction?.pc == oldPC);
    if (elementsOld[0]?.instruction) {
      (elementsOld[0].instruction as any).wasActive = true;
      (elementsOld[0].instruction as any).active = false;
    }

    const elementsNew = this.optimizedInstructionList.filter((e) => e.instruction?.pc == newPC);
    if (elementsNew[0]?.instruction) {
      (elementsNew[0].instruction as any).wasActive = false;
      (elementsNew[0].instruction as any).active = true;
    }
  }
}
