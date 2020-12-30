import {AfterViewInit, Component, ElementRef, OnDestroy,} from '@angular/core';
import {GraphService} from '../../../core/services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef, private graphService: GraphService) {
  }

  ngAfterViewInit() {
    this.graphService.init(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.graphService.stopRender();
  }
}
