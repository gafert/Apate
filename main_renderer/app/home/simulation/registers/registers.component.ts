import { Component, Input, OnInit } from '@angular/core';
import { easing, styler, tween } from 'popmotion';
import { byteToHex } from '../../../globals';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.css'],
})
export class RegistersComponent implements OnInit {
  @Input('registers') cpuRegisters;
  public byteToHex = byteToHex;
  public fromCharCode = String.fromCharCode;
  public cpuRegDefinitions = [
    ['zero', 'Always Zero'],
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
    ['t6', 'Temporary'],
  ];
  private hoverTooltipId = 'register-hover-id';

  constructor() {}

  ngOnInit(): void {
    // Generate a hover element if there is none in the dom tree
    // This makes sure only one hover div exists and therefor improves the performance
    if (!document.getElementById(this.hoverTooltipId)) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = this.hoverTooltipId;
      hoverDiv.style.position = 'absolute';
      hoverDiv.style.display = 'none';
      hoverDiv.style.padding = '0.5em';
      hoverDiv.style.borderRadius = '0.5em';
      hoverDiv.innerText = '';
      hoverDiv.style.backgroundColor = 'rgb(255,255,255)';
      hoverDiv.style.color = 'rgb(0,0,0)';
      hoverDiv.style.top = '0px';
      hoverDiv.style.left = '0px';
      document.getElementsByTagName('body')[0].appendChild(hoverDiv);
    }
  }

  hoverEnterRegister(event, i) {
    const top = event.target.getBoundingClientRect().y + 'px';
    const left = event.target.getBoundingClientRect().x + event.target.clientWidth + 'px';

    const hoverElement = document.getElementById(this.hoverTooltipId);
    tween({
      from: {
        top: hoverElement.style.top,
        left: hoverElement.style.left,
      },
      to: { top: top, left: left },
      ease: easing.easeOut,
      duration: 100,
    }).start((v) => styler(hoverElement).set(v));

    hoverElement.style.display = 'block';
    hoverElement.innerText = this.cpuRegDefinitions[i][1];
  }

  mouseOutRegister(event) {
    document.getElementById(this.hoverTooltipId).style.display = 'none';
  }
}
