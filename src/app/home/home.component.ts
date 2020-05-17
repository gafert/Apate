import {Component} from '@angular/core';
import {DataService} from "../core/services";
import {byteToHex} from "../globals";
import {Subject} from "rxjs";
import electron from "electron";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public byteToHex = byteToHex;
  public folderPath: string;

  constructor(private dataService: DataService) {
    dataService.folderPath.subscribe((value) => {
       this.folderPath = value;
    });
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
}
