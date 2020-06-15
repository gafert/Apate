import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {SimLibInterfaceService} from "../../../core/services";
import {GraphService} from "./graph.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild('graph') graph: ElementRef<HTMLDivElement>;

  constructor(private graphService: GraphService) {
  }

  ngAfterViewInit() {
    this.graphService.init(this.graph.nativeElement);
  }

  ngOnDestroy() {
    this.graphService.stopRender();
  }
}
