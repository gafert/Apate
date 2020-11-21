import { Component, OnInit } from '@angular/core';
import { CpuInterface } from '../../../core/services/cpu-interface/cpu-interface.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css']
})
export class SignalsComponent implements OnInit {
  public fromCharCode = String.fromCharCode;

  constructor(public cpuInterface: CpuInterface) { }

  ngOnInit(): void {
  }

}
