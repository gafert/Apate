import { Component, OnInit } from '@angular/core';
import { byteToHex, cpuRegDefinitions } from '../../../../utils/helper';
import { CPUService } from '../../services/cpu.service';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})
export class RegistersComponent implements OnInit {
  public readonly byteToHex = byteToHex;
  public readonly fromCharCode = String.fromCharCode;
  public readonly cpuRegDefinitions = cpuRegDefinitions;

  constructor(public cpu: CPUService) {
  }

  ngOnInit(): void {

  }
}
