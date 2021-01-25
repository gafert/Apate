import {Component} from '@angular/core';
import {fromEvent} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {remote} from "electron";

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

    const win = remote.getCurrentWindow(); /* Note this is different to the html global `window` variable */

    function handleWindowControls() {
      function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
          document.body.classList.add('maximized');
        } else {
          document.body.classList.remove('maximized');
        }
      }

      // Make minimise/maximise/restore/close buttons work when they are clicked
      document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
      });

      document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
      });

      document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
      });

      document.getElementById('close-button').addEventListener("click", event => {
        win.close();
      });

      // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
      toggleMaxRestoreButtons();
      win.on('maximize', toggleMaxRestoreButtons);
      win.on('unmaximize', toggleMaxRestoreButtons);
    }

    // When document has loaded, initialise
    document.onreadystatechange = (event) => {
      if (document.readyState == "complete") {
        handleWindowControls();
      }
    };

    window.onbeforeunload = (event) => {
      /* If window is reloaded, remove win event listeners
      (DOM element listeners get auto garbage collected but not
      Electron win listeners as the win is not dereferenced unless closed) */
      win.removeAllListeners();
    }
  }
}
