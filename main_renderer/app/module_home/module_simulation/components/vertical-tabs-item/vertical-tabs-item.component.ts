import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.css']
})
export class VerticalTabsItemComponent implements OnInit {
  @ViewChild('title') title;
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {
  }

}
