import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CPUService} from '../../services/cpu.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements OnInit, OnDestroy, AfterViewInit {
  public terminal = '';

  constructor(private SimLib: CPUService) {
  }

  ngAfterViewInit() {
    this.SimLib.bindings.addBufferWriteCallback((c) => this.printBuffer(c));
  }

  printBuffer(character) {
    this.terminal += String.fromCharCode(character);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    // TODO: Find a way to remove a callback from a list
    this.SimLib.bindings.bufferWriteCallbacks = [];
  }
}
