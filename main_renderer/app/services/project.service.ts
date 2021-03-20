import { Injectable } from '@angular/core';
import { DataKeys, DataService } from './data.service';
import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as Store from 'electron-store';
import * as isDev from 'electron-is-dev';
import { ActivatedRoute, Router } from '@angular/router';

const app = electron.remote.app;
const shell = electron.remote.shell;

export enum ProjectSettings {
  SOURCES = 'sources',
  GCC_FLAGS = 'gcc_flags'
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectStore: Store;
  private readonly exampleProjectPath;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    let appPath = path.join(app.getAppPath(), 'dist', 'main_renderer', 'static');
    if (isDev) appPath = path.join(app.getAppPath(), 'main_renderer', 'static');

    this.exampleProjectPath = path.join(appPath, 'example_project');

    const potentialProject = this.dataService.getSetting(DataKeys.PROJECT_PATH);
    if (potentialProject) {
      this.projectStore = new Store({
        cwd: potentialProject
      });
    }
  }

  public initiateNewProject(): Promise<string> {
    return new Promise<string>((resolve, rejected) => {
      electron.remote.dialog
        .showOpenDialog({
          properties: ['createDirectory', 'openDirectory']
        })
        .then((result) => {
          if (!result.canceled) {
            const folderPath = result.filePaths[0];

            fs.copySync(this.exampleProjectPath, folderPath);

            this.projectStore = new Store({
              cwd: folderPath
            });

            this.dataService.setSetting(DataKeys.PROJECT_PATH, folderPath);
            this.dataService.setSetting(DataKeys.ELF_PATH, null);

            this.dataService.setSetting(DataKeys.ACTIVE_FILE, null);
            this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, '');
            this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);

            resolve(folderPath);
          } else {
            rejected();
          }
        });
    });
  }

  public openExitingProjectDialog(): Promise<string> {
    return new Promise<string>((resolve, rejected) => {
      electron.remote.dialog
        .showOpenDialog({
          properties: ['openDirectory']
        })
        .then((result) => {
          if (!result.canceled) {
            const folderPath = result.filePaths[0];
            this.setProjectFolder(folderPath);
            resolve(folderPath);
          } else {
            rejected();
          }
        });
    });
  }

  public setProjectFolder(path) {
    this.projectStore = new Store({
      cwd: path
    });

    this.dataService.setSetting(DataKeys.PROJECT_PATH, path);
    this.dataService.setSetting(DataKeys.ELF_PATH, null);
    this.searchForElfInProject();

    this.dataService.setSetting(DataKeys.ACTIVE_FILE, null);
    this.dataService.setSetting(DataKeys.ACTIVE_FILE_CONTENT, '');
    this.dataService.setSetting(DataKeys.ACTIVE_FILE_IS_SAVEABLE, false);
  }

  public searchForElfInProject() {
    const project = this.dataService.data[DataKeys.PROJECT_PATH].value;
    const files = fs.readdirSync(project);
    for (const file of files) {
      if (file.split('.').pop().includes('elf')) {
        this.dataService.setSetting(DataKeys.ELF_PATH, path.join(project, file));
        break;
      }
    }
  }

  public closeProject() {
    this.dataService.setSetting(DataKeys.PROJECT_PATH, null);
    this.dataService.setSetting(DataKeys.ELF_PATH, null);
    ipcRenderer.send('main-window-wizard');
    this.router.navigate(['/wizard'], { relativeTo: this.route });
  }

  public openProjectInFileWindow() {
    shell.openPath(this.dataService.getSetting(DataKeys.PROJECT_PATH))
  }

  public getSetting(setting: ProjectSettings): any {
    return this.projectStore?.get(setting);
  }
}
