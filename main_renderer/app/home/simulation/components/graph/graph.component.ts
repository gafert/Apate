import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { GraphService } from '../../services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  public loaded = false;

  constructor(private el: ElementRef, private graphService: GraphService) {
  }

  ngAfterViewInit() {
    this.graphService.init(this.el.nativeElement).then(() => {
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    this.graphService.stopRender();
  }
}
