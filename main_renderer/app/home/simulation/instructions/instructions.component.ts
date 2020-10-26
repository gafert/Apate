import { AfterViewInit, Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { byteToHex } from '../../../globals';
import * as d3 from 'd3';
import { easing, styler, tween } from 'popmotion';
import { readStyleProperty } from '../../../utils/helper';
import { ELF } from '../../../core/services/sim-lib-interface/elfParser';
import { INSTRUCTIONS_DESCRIPTIONS } from '../../../core/services/sim-lib-interface/instructionParser';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';

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
export class InstructionsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  public byteToHex = byteToHex;
  @Input() public programCounter;
  @Input() public parsedElf: ELF;

  constructor(public simLibInterfaceService: SimLibInterfaceService) {
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

  public reload() {
    // Emitted when the elf changed and instructions needed to be renewed
    // Save instructions
    setTimeout(() => {
      this.setInstructionColor(0, this.programCounter);
    }, 100);
  }

  ngOnDestroy() {
  }

  private setInstructionColor(oldPC, newPC) {
    // Change colors accordingly
    const oldAssemblyDiv = document.getElementById('assembly-code-div-' + oldPC);
    if (oldAssemblyDiv) {
      tween({
        from: { backgroundColor: oldAssemblyDiv.style.backgroundColor },
        to: { backgroundColor: readStyleProperty('accent-dark') },
        ease: easing.easeOut,
        duration: 500
      }).start((v) => styler(oldAssemblyDiv).set(v));
    }
    const oldAssemblyPcDiv = document.getElementById('assembly-code-div-pc-' + oldPC);
    const oldAssemblyHexDiv = document.getElementById('assembly-code-div-hex-' + oldPC);
    if (oldAssemblyPcDiv && oldAssemblyHexDiv) {
      tween({
        from: { backgroundColor: oldAssemblyPcDiv.style.backgroundColor },
        to: { backgroundColor: readStyleProperty('accent') },
        ease: easing.easeOut,
        duration: 500
      }).start((v) => {
        styler(oldAssemblyPcDiv).set(v);
        styler(oldAssemblyHexDiv).set(v);
      });
    }
    d3.select('#assembly-code-div-' + newPC).style('background', readStyleProperty('accent'));
    d3.select('#assembly-code-div-' + newPC).style('border-color', 'transparent');
    d3.select('#assembly-code-div-pc-' + newPC).style('background', readStyleProperty('accent-dark'));
    d3.select('#assembly-code-div-pc-' + newPC).style('border-color', 'transparent');
    d3.select('#assembly-code-div-hex-' + newPC).style('background', readStyleProperty('accent-dark'));
    d3.select('#assembly-code-div-hex-' + newPC).style('border-color', 'transparent');
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
}
