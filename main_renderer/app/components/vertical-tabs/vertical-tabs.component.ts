import {Component, ContentChildren, QueryList} from '@angular/core';
import {VerticalTabsItemComponent} from "../vertical-tabs-item/vertical-tabs-item.component";

@Component({
  selector: 'app-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss']
})
export class VerticalTabsComponent {
  @ContentChildren(VerticalTabsItemComponent) tabs: QueryList<VerticalTabsItemComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: VerticalTabsItemComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
