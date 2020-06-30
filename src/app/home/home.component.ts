import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {DataService} from "../core/services";
import {byteToHex} from "../globals";
import electron from "electron";
import {Router} from "@angular/router";
import * as url from "url";
import isDev from "electron-is-dev";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  public byteToHex = byteToHex;
  public folderPath: string;

  private ngUnsubscribe = new Subject();

  constructor(private dataService: DataService, private router: Router) {
    dataService.folderPath.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.folderPath = value;
    });
  }

  isSelectedButton(pathName) {
    return this.router.url.indexOf(pathName) >= 0
  }

  openFolderPathDialog() {
    electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((result) => {
      if (!result.canceled) {
        this.dataService.folderPath.next(result.filePaths[0]);
      }
    })
  }

  openSettingsDialog() {
    let child = new electron.remote.BrowserWindow({
      skipTaskbar: true,
      minimizable: false,
      maximizable: false,
      frame: false,
      parent: electron.remote.getCurrentWindow(),
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      },
    });

    if (isDev) {
      child.loadURL('http://localhost:4200#/settings');
    } else {
      let webPath = url.format({
        pathname: __dirname,
        protocol: 'file:',
        slashes: true
      });
      child.loadURL(webPath + "/index.html#settings")
    }

    //child.webContents.openDevTools();
    child.once('ready-to-show', () => {
      child.show();
    });
    child.once('close', () => {
      this.dataService.loadSettings();
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.clickCompileTab();
    }, 2000);
  }

  clickCompileTab() {
    document.getElementById('button-tab-compile').click();
    setTimeout(() => {
      this.clickSimulateTab();
    }, 500);
  }

  clickSimulateTab() {
    document.getElementById('button-tab-simulate').click();
    setTimeout(() => {
      this.clickCompileTab();
    }, 500);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
