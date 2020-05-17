import {Component, Input, OnInit} from '@angular/core';
import { byteToHex, range } from '../../../globals';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {
  public byteToHex = byteToHex;
  public range = range;

  @Input() mem_addr;
  @Input() mem_rdata;
  @Input() mem_wdata;
  @Input() mem_valid;
  @Input() memory;

  constructor() { }

  ngOnInit(): void {
  }

}
