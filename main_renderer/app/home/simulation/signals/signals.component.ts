import {Component, OnInit} from '@angular/core';
import {Cpu} from '../../../core/services/cpu.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css']
})
export class SignalsComponent implements OnInit {
  public fromCharCode = String.fromCharCode;

  constructor(public cpu: Cpu) {
  }

  ngOnInit(): void {
  }

}
