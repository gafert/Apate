import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CPUComponent implements OnInit {
  @Input() cpuState: number;
  @Input() cpuRs1: number;
  @Input() cpuRs2: number;
  @Input() decodedRs1: number;
  @Input() decodedRs2: number;
  @Input() regOp1: number;
  @Input() regOp2: number;
  @Input() cpuOut: number;
  @Input() decodedRd: number;
  @Input() cpuLatchedRd: number;

  cpuStates = [];

  constructor() {
    this.cpuStates[0b10000000] = 'trap';
    this.cpuStates[0b01000000] = 'fetch';
    this.cpuStates[0b00100000] = 'ld_rs1';
    this.cpuStates[0b00010000] = 'ld_rs2';
    this.cpuStates[0b00001000] = 'exec';
    this.cpuStates[0b00000100] = 'shift';
    this.cpuStates[0b00000010] = 'stmem';
    this.cpuStates[0b00000001] = 'ldmem';
  }

  ngOnInit(): void {
  }

}
