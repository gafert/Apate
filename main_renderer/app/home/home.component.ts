import { AfterViewInit, Component } from '@angular/core';
import { byteToHex } from '../utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { DataKeys, DataService } from '../services/data.service';
import { ProjectService } from '../services/project.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {openSettingsDialog} from "../utils/helper";
import {CPUService} from "./simulation/services/cpu.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
@UntilDestroy()
export class HomeComponent  {
  public readonly byteToHex = byteToHex;
  public readonly DataKeys = DataKeys;
  public readonly openSettingsDialog = openSettingsDialog;
  public folderPath: string;

  constructor(public dataService: DataService,
    private router: Router,
    public projectService: ProjectService,
    private cpu: CPUService) {
    dataService.data[DataKeys.PROJECT_PATH].pipe(untilDestroyed(this)).subscribe((value) => {
      this.folderPath = value;
      this.cpu.reset();
    });
  }

  isSelectedButton(pathName) {
    return this.router.url.includes(pathName);
  }
}
