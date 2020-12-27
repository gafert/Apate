import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {animate, easeIn, easeInOut, easeOut} from 'popmotion';
import styler from 'stylefire';
import {readStyleProperty} from '../../../utils/helper';

@Component({
  selector: 'app-changing-value',
  templateUrl: './changing-value.component.html',
  styleUrls: ['./changing-value.component.css'],
})
export class ChangingValueComponent implements OnChanges {
  @Input() public cellValue;
  @ViewChild('changingValue') changingValue;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cellValue.previousValue !== changes.cellValue.currentValue) {
      if (this.changingValue) {
        const memoryCellStyler = styler(this.changingValue.nativeElement);
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
