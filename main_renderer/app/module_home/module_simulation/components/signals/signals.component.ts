import {Component, OnInit} from '@angular/core';
import {CPUService} from '../../../../services/cpu.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css']
})
export class SignalsComponent implements OnInit {
  public fromCharCode = String.fromCharCode;

  constructor(public cpu: CPUService) {
  }

  ngOnInit(): void {
  }

}
