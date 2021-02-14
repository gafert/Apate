import { Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as electron from 'electron';

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
        const url = event.detail.url;

        // TODO: Make real wiki
        // Catch route changes with /wiki so at least something is displayed
        if(this.catchWikiURLs(url)) return;

        this.router.navigate([url], {relativeTo: this.route});
      })
  }

  /**
   * Opens browser if url contains a wiki path.
   * Will be replaced once wiki exists.
   * @returns true if url was opened
   * @param url
   */
  catchWikiURLs(url): boolean {
    if(url.startsWith("/home/wiki")) {
      const wikiSite = url.split("?")[1];
      let externalUrl;
      switch (wikiSite) {
        case "pc": externalUrl = "https://en.wikipedia.org/wiki/Program_counter"; break;
        case "fetchstage": externalUrl = "https://en.wikipedia.org/wiki/Classic_RISC_pipeline#Instruction_fetch"; break;
        case "decoderstage": externalUrl = "https://en.wikipedia.org/wiki/Classic_RISC_pipeline#Instruction_decode"; break;
        case "executionstage": externalUrl = "https://en.wikipedia.org/wiki/Classic_RISC_pipeline#Execute"; break;
        case "writebackstage": externalUrl = "https://en.wikipedia.org/wiki/Classic_RISC_pipeline#Writeback"; break;
        case "advpcstage": externalUrl = "https://en.wikipedia.org/wiki/Classic_RISC_pipeline"; break;
        case "opcode": externalUrl = "https://en.wikipedia.org/wiki/Opcode"; break;
        case "instructiontable": externalUrl = "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/gafert/Apate/master/main_renderer/static/riscv-card.pdf"; break;
        case "instructiontype": externalUrl = "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/gafert/Apate/master/main_renderer/static/riscv-card.pdf"; break;
      }

      if(externalUrl) {
        console.log("Caught wiki url, opening: ", externalUrl)
        electron.shell.openExternal(externalUrl);
      }
      return true;
    }

    return false;
  }
}
