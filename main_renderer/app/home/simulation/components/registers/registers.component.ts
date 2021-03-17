import { Component, OnInit } from '@angular/core';
import { byteToHex } from '../../../../utils/helper';
import { CPUService } from '../../services/cpu.service';
import CPU_REGISTER_NAMES from '../../../../yamls/register.yml';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})
export class RegistersComponent implements OnInit {
  public readonly byteToHex = byteToHex;
  public readonly fromCharCode = String.fromCharCode;
  public readonly cpuRegDefinitions = CPU_REGISTER_NAMES;
  public dataAsDecimal = false;

  constructor(public cpu: CPUService) {
  }

  ngOnInit(): void {

  }
}
