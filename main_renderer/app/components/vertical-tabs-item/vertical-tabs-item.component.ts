import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.css']
})
export class VerticalTabsItemComponent implements OnInit {
  @Input('tabTitle') title: string;
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {
  }

}
