import { AfterViewInit, Component } from '@angular/core';
import { byteToHex, openSettingsDialog } from '../utils/helper';
import { Router } from '@angular/router';
import { DataKeys, DataService } from '../services/data.service';
import { ProjectService } from '../services/project.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SimulationComponent } from './module_simulation/simulation.component';
import { skip } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DemoProjectDescriptionComponent } from './components/demo-project-description/demo-project-description.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
@UntilDestroy()
export class HomeComponent implements AfterViewInit {
  private simulationComponent: SimulationComponent;
  public readonly byteToHex = byteToHex;
  public readonly DataKeys = DataKeys;
  public readonly openSettingsDialog = openSettingsDialog;
  public folderPath: string;

  constructor(public dataService: DataService,
    private router: Router,
    public projectService: ProjectService,
    public dialog: MatDialog) {

    if(this.projectService.isDemo()) {
      this.dialog.open(DemoProjectDescriptionComponent);
    }
  }

  ngAfterViewInit() {
    this.dataService.data[DataKeys.PROJECT_PATH].pipe(untilDestroyed(this)).subscribe((value) => {
      this.folderPath = value;
    });
  }

  routerActivate(componentRef) {
    if (componentRef instanceof SimulationComponent) {
      this.simulationComponent = componentRef;
      this.dataService.data[DataKeys.PROJECT_PATH].pipe(untilDestroyed(this), skip(1)).subscribe((value) => {
        this.simulationComponent?.resetSimulation();
      });
    }
  }

  isSelectedButton(pathName) {
    return this.router.url.includes(pathName);
  }
}
