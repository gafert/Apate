import {Component} from '@angular/core';
import {fromEvent} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    // See dynamicHTMLRouter
    // Used to allow dynamic HTML to use Router
    fromEvent<Event>(window, 'navigate_in_angular')
      .subscribe((event) => {
        // @ts-ignore
        this.router.navigate([event.detail.url], {relativeTo: this.route});
      })
  }
}
