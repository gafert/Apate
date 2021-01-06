import {Component, OnInit} from '@angular/core';
import {byteToHex} from '../../../../globals';
import {CPUService} from '../../services/cpu.service';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})
export class RegistersComponent implements OnInit {
  public byteToHex = byteToHex;
  public fromCharCode = String.fromCharCode;
  public cpuRegDefinitions = [
    ['zero', 'Fixed Zero'],
    ['ra', 'Return address'],
    ['sp', 'Stack pointer'],
    ['gp', 'Global pointer'],
    ['tp', 'Thread pointer'],
    ['t0', 'Temporary / alternate return address'],
    ['t1', 'Temporary'],
    ['t2', 'Temporary'],
    ['s0', 'Saved register / frame pointer'],
    ['s1', 'Saved register'],
    ['a0', 'Function argument / return value'],
    ['a1', 'Function argument / return value'],
    ['a2', 'Function argument'],
    ['a3', 'Function argument'],
    ['a4', 'Function argument'],
    ['a5', 'Function argument'],
    ['a6', 'Function argument'],
    ['a7', 'Function argument'],
    ['s2', 'Saved register'],
    ['s3', 'Saved register'],
    ['s4', 'Saved register'],
    ['s5', 'Saved register'],
    ['s6', 'Saved register'],
    ['s7', 'Saved register'],
    ['s8', 'Saved register'],
    ['s9', 'Saved register'],
    ['s10', 'Saved register'],
    ['s11', 'Saved register'],
    ['t3', 'Temporary'],
    ['t4', 'Temporary'],
    ['t5', 'Temporary'],
    ['t6', 'Temporary']
  ];
  private hoverTooltipId = 'register-hover-id';

  constructor(public cpu: CPUService) {
  }

  ngOnInit(): void {

  }
}
