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
  @ViewChild('graph') graph: ElementRef<HTMLDivElement>;
  @Input() focus: string;

  constructor(private graphService: GraphService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.graphService.goToArea(changes.focus.currentValue);
  }

  ngAfterViewInit() {
    this.graphService.init(this.graph.nativeElement);
  }

  ngOnDestroy() {
    this.graphService.stopRender();
  }
}
