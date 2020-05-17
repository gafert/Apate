import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SimLibInterfaceService} from "../../../core/services";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  public terminal = "";

  constructor(public SimLib: SimLibInterfaceService) {
    SimLib.bindings.addBufferWriteCallback((c) => this.printBuffer(c))
  }

  printBuffer(character) {
    this.terminal += String.fromCharCode(character);
  }

  ngOnInit(): void {

  }

}
