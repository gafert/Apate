import {AfterContentInit, AfterViewInit, Component, ContentChildren, OnInit, QueryList, ViewChild} from '@angular/core';
import {VerticalTabsItemComponent} from "../vertical-tabs-item/vertical-tabs-item.component";
import {fromEvent} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Component({
  selector: 'app-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss']
})
@UntilDestroy()
export class VerticalTabsComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(VerticalTabsItemComponent) tabs: QueryList<VerticalTabsItemComponent>;
  @ViewChild('tabsList') tabsList;
  @ViewChild('tabsContainer') tabsContainer;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  ngAfterViewInit() {
    // First event is not called
    this.tabsList.nativeElement.style.width = getComputedStyle(this.tabsContainer.nativeElement).height;
    fromEvent(window, 'resize').pipe(untilDestroyed(this)).subscribe(() => {
      this.tabsList.nativeElement.style.width = getComputedStyle(this.tabsContainer.nativeElement).height;
      console.log(getComputedStyle(this.tabsContainer.nativeElement).height);
    })
  }

  selectTab(tab: VerticalTabsItemComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
