import { ChangeDetectorRef, Component } from '@angular/core';
import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import { DataKeys, DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { chmodRecursive, openSettingsDialog } from '../utils/helper';

import * as fs from 'fs-extra';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

const app = electron.remote.app;

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {
  public readonly DataKeys = DataKeys;
  public readonly openSettingsDialog = openSettingsDialog;
  private readonly demosFolderPath = path.join(app.getPath('userData'), 'demos');

  public introNotActive = this.dataService.getSetting(DataKeys.WIZARD_INTRO_NOT_ACTIVE);

  constructor(public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private projectService: ProjectService,) {

    // Copy demos to folder if demos folder does not exits
    fs.pathExists(this.demosFolderPath).then((exists) => {
      if(!exists) this.copyDemosToUserDataDirectory();
    })
  }

  /**
   * Copy static demos to user data
   * @private
   */
  private copyDemosToUserDataDirectory() {
    let appPath = path.join(app.getAppPath(), 'dist', 'main_renderer', 'static');
    if (isDev) appPath = path.join(app.getAppPath(), 'main_renderer', 'static');

    const staticDemosFolder = path.join(appPath, 'demos');

    fs.copySync(staticDemosFolder, this.demosFolderPath);
    // Make sure permissions are set so config.json is readable / executable
    chmodRecursive(this.demosFolderPath, 0o777);
  }

  openCustomELF() {
    electron.remote.dialog
      .showOpenDialog({
        properties: ['openFile']
      })
      .then((result) => {
        if (!result.canceled) {
          this.dataService.setSetting(DataKeys.ACTIVE_FILE, null);
          this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, null);
          this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);
          this.dataService.setSetting(DataKeys.PROJECT_PATH, null);
          this.dataService.setSetting(DataKeys.ELF_PATH, result.filePaths[0]);
          this.goToSimulation();
        }
      });
  }

  initiateNewProject() {
    this.projectService.initiateNewProject().then(() => {
      this.goToCompile();
    })
  }

  openExistingProject() {
    this.projectService.openExitingProjectDialog().then(() => {
      this.goToCompile();
    })
  }

  openDemo(demoName) {
    this.projectService.setProjectFolder(path.join(this.demosFolderPath, demoName));
    this.goToSimulation();
  }

  goToSimulation() {
    this.goToMain('simulation');
  }

  goToCompile() {
    this.goToMain('compile');
  }

  goToMain(path: string) {
    // Hide wizard as simulation loads a while a blocks
    document.getElementById('loading').style.display = 'block';
    ipcRenderer.send('main-window-home');
    this.router.navigate(['/home/' + path], {relativeTo: this.route});
  }

  setIntroActive(active) {
    this.dataService.setSetting(DataKeys.WIZARD_INTRO_NOT_ACTIVE, !active);
    this.introNotActive = !active;
  }
}
