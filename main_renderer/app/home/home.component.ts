import { AfterViewInit, Component } from '@angular/core';
import { byteToHex } from '../utils/helper';
import * as electron from 'electron';
import { ActivatedRoute, Router } from '@angular/router';
import * as url from 'url';
import * as isDev from 'electron-is-dev';
import { DataKeys, DataService } from '../services/data.service';
import { ProjectService } from '../services/project.service';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
@UntilDestroy()
export class HomeComponent implements AfterViewInit {
  public byteToHex = byteToHex;
  public folderPath: string;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private projectService: ProjectService) {
    dataService.data[DataKeys.PROJECT_PATH].pipe(untilDestroyed(this)).subscribe((value) => {
      this.folderPath = value;
    });
  }

  isSelectedButton(pathName) {
    return this.router.url.includes(pathName);
  }

  openProjectDialog() {
    this.projectService.openExistingProject().then((folderPath) => {

    });
  }

  newProjectDialog() {
    this.projectService.initiateNewProject().then((folderPath) => {

    });
  }

  closeProject() {
    this.projectService.closeProject();
  }

  openSettingsDialog() {
    const child = new electron.remote.BrowserWindow({
      skipTaskbar: true,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      frame: true,
      parent: electron.remote.getCurrentWindow(),
      autoHideMenuBar: true,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      },
    });

    if (isDev) {
      child.loadURL('http://localhost:4200#/settings');
    } else {
      const webPath = url.format({
        pathname: __dirname,
        protocol: 'file:',
        slashes: true,
      });
      child.loadURL(webPath + '/index.html#settings');
    }

    //child.webContents.openDevTools();
    child.once('ready-to-show', () => {
      child.show();
    });
    child.once('close', () => {
      this.dataService.reloadSettings();
    });
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
}
