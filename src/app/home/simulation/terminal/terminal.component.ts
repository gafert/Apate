import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SimLibInterfaceService} from "../../../core/services";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit, OnDestroy {
  public terminal = "";

  constructor(public SimLib: SimLibInterfaceService) {
    SimLib.bindings.addBufferWriteCallback(this.printBuffer)
  }

  printBuffer(character) {
    this.terminal += String.fromCharCode(character);
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    const index = this.SimLib.bindings.bufferWriteCallbacks.indexOf(this.printBuffer);
    console.log("Removing: ", index);
    if (index > -1) {
      this.SimLib.bindings.bufferWriteCallbacks.splice(index, 1);
    }
  }

}
