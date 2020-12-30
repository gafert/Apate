import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {byteToHex} from '../../../globals';
import * as d3 from 'd3';
import {animate, easeOut} from 'popmotion';
import styler from 'stylefire';
import {readStyleProperty} from '../../../utils/helper';
import {ELF, SHF_CONSTANTS} from '../../../core/services/elfParser';
import {INSTRUCTIONS_DESCRIPTIONS} from '../../../core/services/instructionParser';
import {CPUService} from "../../../core/services/cpu.service";
import {GraphService} from "../../../core/services/graph.service";

class Assembly {
  opcode: string;
  hex: string;
  pc: number;
}

class SectionSymbol {
  name?: string;
  hex?: string;
  code?: {
    code?: string;
    line?: number;
    file?: string;
    assembly?: Assembly[] | Assembly;
  }[];
}

class Section {
  name: string;
  symbols: SectionSymbol[];
}

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit, OnChanges, AfterViewInit {
  public readonly byteToHex = byteToHex;

  @Input() public programCounter;
  @Input() public parsedElf: ELF;

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
    if (changes.programCounter)
      if (changes.programCounter.currentValue !== changes.programCounter.previousValue) {
        this.setInstructionColor(changes.programCounter.previousValue, changes.programCounter.currentValue);
      }
  }

  reload() {
    // Emitted when the elf changed and instructions needed to be renewed
    // Save instructions
    setTimeout(() => {
      this.setInstructionColor(0, this.programCounter);
    }, 100);
  }

  expandInfo(pc) {
    const infoElement = document.getElementById('assembly-info-div-' + pc);
    if (infoElement.classList.contains('assembly-info-open')) {
      infoElement.classList.remove('assembly-info-open');
    } else {
      infoElement.classList.add('assembly-info-open');
    }
  }

  getInfoOfInstruction(instructionName) {
    return INSTRUCTIONS_DESCRIPTIONS[instructionName];
  }

  isSHFExecInstr(flags) {
    return flags & SHF_CONSTANTS.SHF_EXECINSTR;
  }

  runUntilPC(pc: number) {
    this.graphService.globalAnimationDisabled = true
    this.cpu.runUntilPC(pc).then(() => {
      this.graphService.globalAnimationDisabled = false;
    });
  }

  private setInstructionColor(oldPC, newPC) {
    // Change colors accordingly
    const oldAssemblyDiv = document.getElementById('assembly-code-div-' + oldPC);
    if (oldAssemblyDiv) {
      const oldAssemblyStyler = styler(oldAssemblyDiv);
      animate({
        from: {backgroundColor: oldAssemblyStyler.get('background-color')},
        to: {backgroundColor: readStyleProperty('accent-dark')},
        ease: easeOut,
        duration: 500,
        onUpdate: (v) => oldAssemblyStyler.set(v)
      });
    }
    const oldAssemblyPcDiv = document.getElementById('assembly-code-div-pc-' + oldPC);
    const oldAssemblyHexDiv = document.getElementById('assembly-code-div-hex-' + oldPC);
    if (oldAssemblyPcDiv && oldAssemblyHexDiv) {
      const oldAssemblyPcStyler = styler(oldAssemblyPcDiv);
      const oldAssemblyHexStyler = styler(oldAssemblyHexDiv);
      animate({
        from: {backgroundColor: oldAssemblyPcStyler.get('background-color')},
        to: {backgroundColor: readStyleProperty('accent')},
        ease: easeOut,
        duration: 500,
        onUpdate: (v) => {
          oldAssemblyPcStyler.set(v);
          oldAssemblyHexStyler.set(v);
        }
      });
    }
    d3.select('#assembly-code-div-' + newPC).style('background', readStyleProperty('accent'));
    d3.select('#assembly-code-div-' + newPC).style('border-color', 'transparent');
    d3.select('#assembly-code-div-pc-' + newPC).style('background', readStyleProperty('accent-dark'));
    d3.select('#assembly-code-div-pc-' + newPC).style('border-color', 'transparent');
    d3.select('#assembly-code-div-hex-' + newPC).style('background', readStyleProperty('accent-dark'));
    d3.select('#assembly-code-div-hex-' + newPC).style('border-color', 'transparent');
  }
}
