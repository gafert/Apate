import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {byteToHex, byteToBinary} from '../../../../utils/helper';
import {ELF, ElfSymbol, ELFSectionHeader, SHF_CONSTANTS} from '../../../../utils/elfParser';
import {Instruction, INSTRUCTIONS_DESCRIPTIONS} from '../../../../utils/instructionParser';
import {CPUService} from "../../services/cpu.service";
import {GraphService} from "../../services/graph.service";
import {VirtualScrollerComponent} from "ngx-virtual-scroller";
import {style, transition, trigger, animate} from "@angular/animations";

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
export class InstructionsComponent implements OnInit, OnChanges, AfterViewInit {
  public readonly byteToHex = byteToHex;
  public readonly byteToBinary = byteToBinary;

  @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;

  @Input() public programCounter;
  @Input() public parsedElf: ELF;

  public optimizedInstructionList: OptimizedList[] = [];

  constructor(public cpu: CPUService, public graphService: GraphService) {
    console.log(this);
  }

  ngOnInit(): void {
    // Reload instructions from last initiation
  }

  ngAfterViewInit(): void {
    // If the instructions were reloaded set the program counter
    // Needs to be after view loaded to access the relevant dom elements
    this.setInstructionColor(0, this.programCounter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.programCounter) {
      if (changes.programCounter.currentValue !== changes.programCounter.previousValue) {
        this.setInstructionColor(changes.programCounter.previousValue, changes.programCounter.currentValue);
      }
    }
    if (changes.parsedElf?.currentValue) {
      this.optimizedInstructionList = [];
      for (const sectionHeader of this.parsedElf.section_headers) {
        if (this.isSHFExecInstr(sectionHeader.sh_flags)) {
          this.optimizedInstructionList.push({section: sectionHeader});
          if (sectionHeader?.symbols) {
            for (const symbol of sectionHeader.symbols) {
              this.optimizedInstructionList.push({symbol: symbol});
              if (symbol?.instructions) {
                for (const instruction of symbol.instructions) {
                  this.optimizedInstructionList.push({instruction: instruction});
                }
              }
            }
          }
        }
      }
    }
  }

  reload() {
    // Emitted when the elf changed and instructions needed to be renewed
    // Save instructions
    setTimeout(() => {
      this.setInstructionColor(0, this.programCounter);
    }, 100);
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
    this.graphService.update.animations = false
    this.graphService.update.updateVisibilities = false;
    this.graphService.update.updateSignalTexts = false;
    this.cpu.runUntilPC(pc).then(() => {
      this.graphService.update.animations = true;
      this.graphService.update.updateVisibilities = true;
      this.graphService.update.updateSignalTexts = true;
      this.graphService.updateGraph(true);
    });
  }

  scrollToPc(pc) {
    if (!pc) return;
    const elements = this.optimizedInstructionList.filter((e) => e.instruction?.pc == pc)
    if (elements.length > 0)
      this.virtualScroller.scrollInto(elements[0], true, -100);
  }

  private setInstructionColor(oldPC, newPC) {
    this.scrollToPc(newPC);
    const elementsOld = this.optimizedInstructionList.filter((e) => e.instruction?.pc == oldPC)
    if (elementsOld.length > 0) {
      (elementsOld[0].instruction as any).wasActive = true;
      (elementsOld[0].instruction as any).active = false;
    }

    const elementsNew = this.optimizedInstructionList.filter((e) => e.instruction?.pc == newPC);
    if (elementsNew.length > 0) {
      (elementsNew[0].instruction as any).wasActive = false;
      (elementsNew[0].instruction as any).active = true;
    }
  }
}
