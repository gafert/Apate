import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {byteToHex} from "../../../globals";
import * as d3 from "d3";
import * as Store from "electron-store";
import {easing, styler, tween} from "popmotion";
import isDev from "electron-is-dev";
import {DataService, SimLibInterfaceService} from "../../../core/services";

class Assembly {
  opcode: string;
  hex: string;
  pc: number;
}

class SectionSymbol {
  name?: string;
  hex?: string;
  code?: {
    code?: string
    line?: number
    file?: string
    assembly?: Assembly[] | Assembly
  }[];
}

class Section {
  name: string;
  symbols: SectionSymbol[]
}

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() private programCounter;
  @Input() private elfPath;
  public sections: Section[] = [];
  public byteToHex = byteToHex;
  private objdumpWorker = new Worker('./static/objdump.worker.js');
  private store = new Store();
  private toolchainPath = this.store.get('toolchainPath');
  private toolchainPrefix = this.store.get('toolchainPrefix');
  private objdumpPath = `${this.toolchainPath}/${this.toolchainPrefix}objdump`;

  constructor(private changeDetection: ChangeDetectorRef,
              private simLibInterfaceService: SimLibInterfaceService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    // Reload instructions from last initiation
    if (this.dataService.instructionsSections) {
      this.sections = this.dataService.instructionsSections;
    }

    this.objdumpWorker.onmessage = e => {
      // Emitted when the elf changed and instructions needed to be renewed
      this.sections = e.data;
      // Save instructions
      this.dataService.instructionsSections = this.sections;
      this.changeDetection.detectChanges();
      this.setInstructionColor(0, this.programCounter);
    };
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
    if (this.elfPath.indexOf('.elf') > 0) {
      this.objdumpWorker.postMessage({file: this.elfPath, isDev: isDev, objdumpPath: this.objdumpPath});
    }
  }

  private setInstructionColor(oldPC, newPC) {
    // Change colors accordingly
    const oldAssemblyDiv = document.getElementById('assembly-code-div-' + oldPC);
    if (oldAssemblyDiv) {
      tween({
        from: {backgroundColor: oldAssemblyDiv.style.backgroundColor,},
        to: {backgroundColor: "rgb(0,38,0)"},
        ease: easing.easeOut,
        duration: 500
      }).start(v => styler(oldAssemblyDiv).set(v));
    }
    const oldAssemblyPcDiv = document.getElementById('assembly-code-div-pc-' + oldPC);
    const oldAssemblyHexDiv = document.getElementById('assembly-code-div-hex-' + oldPC);
    if (oldAssemblyPcDiv && oldAssemblyHexDiv) {
      tween({
        from: {backgroundColor: oldAssemblyPcDiv.style.backgroundColor,},
        to: {backgroundColor: "rgb(0,83,0)"},
        ease: easing.easeOut,
        duration: 500
      }).start(v => {
        styler(oldAssemblyPcDiv).set(v);
        styler(oldAssemblyHexDiv).set(v);
      });
    }
    d3.select('#assembly-code-div-' + newPC).style('background', "#009000");
    d3.select('#assembly-code-div-' + newPC).style('border-color', "transparent");
    d3.select('#assembly-code-div-pc-' + newPC).style('background', "#007400");
    d3.select('#assembly-code-div-pc-' + newPC).style('border-color', "transparent");
    d3.select('#assembly-code-div-hex-' + newPC).style('background', "#007400");
    d3.select('#assembly-code-div-hex-' + newPC).style('border-color', "transparent");
  }
}
