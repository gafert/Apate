import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {byteToHex} from '../../../../globals';
import {animate, easeIn, easeInOut, easeOut} from 'popmotion';
import styler from 'stylefire';
import {readStyleProperty} from '../../../../utils/helper';

@Component({
  selector: 'app-memory-cell',
  templateUrl: './memory-cell.component.html',
  styleUrls: ['./memory-cell.component.css'],
})
export class MemoryCellComponent implements OnInit, OnChanges {
  @Input() public cellValue;
  @Input() public cellIndex;
  @ViewChild('memoryCell') memoryCell;

  public byteToHex = byteToHex;

  constructor() {
  }

  ngOnInit(): void {
    // Generate a hover element if there is none in the dom tree
    // This makes sure only one hover div exists and therefor improves the performance
    if (!document.getElementById('memory-cell-hover')) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = 'memory-cell-hover';
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

  hoverOverCell(event) {
    const top = this.memoryCell.nativeElement.getBoundingClientRect().y - 10 + 'px';
    const left =
      this.memoryCell.nativeElement.getBoundingClientRect().x + this.memoryCell.nativeElement.clientWidth + 10 + 'px';

    const memoryCellHoverStyler = styler(document.getElementById('memory-cell-hover'));
    animate({
      from: {
        top: document.getElementById('memory-cell-hover').style.top,
        left: document.getElementById('memory-cell-hover').style.left,
      },
      to: {top: top, left: left},
      ease: easeOut,
      duration: 100,
      onUpdate: (v) => memoryCellHoverStyler.set(v)
    });

    document.getElementById('memory-cell-hover').style.display = 'block';
    document.getElementById('memory-cell-hover').innerText = '= ' + this.cellValue;

    if (this.cellIndex !== undefined) {
      document.getElementById('memory-cell-hover').innerText =
        document.getElementById('memory-cell-hover').innerText + ' at ' + byteToHex(this.cellIndex, 2);
    }
  }

  mouseLeaveCell(event) {
    document.getElementById('memory-cell-hover').style.display = 'none';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cellValue.previousValue !== changes.cellValue.currentValue) {
      if (this.memoryCell) {
        const memoryCellStyler = styler(this.memoryCell.nativeElement);
        animate({
          from: {backgroundColor: readStyleProperty('accent'), color: '#ffffff'},
          to: {backgroundColor: 'rgba(0,0,0,0)', color: '#ffffff'},
          ease: easeOut,
          duration: 5000,
          onUpdate: (v) => memoryCellStyler.set(v)
        });
      }
    }
  }
}
