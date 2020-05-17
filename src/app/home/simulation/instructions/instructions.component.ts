import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {byteToHex} from "../../../globals";
import * as d3 from "d3";
import * as Store from "electron-store";
import {easing, styler, tween} from "popmotion";
import isDev from "electron-is-dev";
import {spawn} from "child_process";

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
export class InstructionsComponent implements OnInit, OnChanges {
  @Input() private programCounter;
  @Input() private elfPath;
  public sections: Section[] = [];
  public byteToHex = byteToHex;
  private objdumpWorker = new Worker('./static/objdump.worker.js');
  private store = new Store();
  private toolchainPath = this.store.get('toolchainPath');
  private toolchainPrefix = this.store.get('toolchainPrefix');
  private objdumpPath = `${this.toolchainPath}/${this.toolchainPrefix}objdump`;

  constructor(private changeDetection: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.objdumpWorker.onmessage = e => {
      this.sections = e.data;
      this.changeDetection.detectChanges();
    };
  }

  loadDump() {
    this.objdumpWorker.postMessage({file: this.elfPath, isDev: isDev, objdumpPath: this.objdumpPath});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.programCounter)
      if (changes.programCounter.currentValue !== changes.programCounter.previousValue) {
        // Change colors accordingly
        const oldElement = document.getElementById('assembly-code-div-' + changes.programCounter.previousValue);
        if (oldElement) {
          tween({
            from: {
              backgroundColor: oldElement.style.backgroundColor,
            },
            to: {
              backgroundColor: "rgb(0,38,0)"
            },
            ease: easing.easeOut,
            duration: 500
          }).start(v => styler(oldElement).set(v));
        }
        d3.select('#assembly-code-div-' + changes.programCounter.currentValue).style('background', "#009000");
      }

    if (changes.elfPath)
      // Only load dump if the elf is truely an .elf and has changed
      if (changes.elfPath.currentValue !== changes.elfPath.previousValue &&
        changes.elfPath.currentValue.indexOf('.elf') > 0) {
        this.loadDump();
      }
  }
}
