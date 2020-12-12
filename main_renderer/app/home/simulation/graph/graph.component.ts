import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { GraphService } from './graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() focus: string;

  constructor(private el: ElementRef, private graphService: GraphService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.graphService.goToArea(changes.focus.currentValue);
  }

  ngAfterViewInit() {
    console.log(this);
    this.graphService.init(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.graphService.stopRender();
  }
}
