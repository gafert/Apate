import { ChangeDetectorRef, Component } from '@angular/core';
import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import { DataKeys, DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {

  constructor(private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private projectService: ProjectService) {
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
    this.projectService.openExistingProject().then(() => {
      this.goToCompile();

    })
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
    this.router.navigate(['/home/' + path], { relativeTo: this.route });
  }
}