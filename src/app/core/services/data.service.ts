import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as Store from 'electron-store';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private store = new Store();

  // Temporary Variables set by the application
  public instructionsSections: any;

  toolchainPath: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  folderPath: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  toolchainDownloaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  activeFile: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  activeFileContent: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  activeFileIsSaveable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  toolchainPrefix: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public loadFile() {
    this.toolchainPath.next(this.store.get('toolchainPath'));
    this.folderPath.next(this.store.get('folderPath'));
    this.toolchainDownloaded.next(this.store.get('toolchainDownloaded'));
    this.activeFileContent.next(this.store.get('activeFileContent'));
    this.activeFile.next(this.store.get('activeFile'));
    this.activeFileIsSaveable.next(this.store.get('activeFileIsSaveable'));
    this.toolchainPrefix.next(this.store.get('toolchainPrefix'));
  }

  constructor() {
    this.loadFile();
    this.toolchainPrefix.subscribe((newValue) => {
      console.log("Saving toolchainPrefix", newValue);
      if (newValue !== undefined)
        this.store.set('toolchainPrefix', newValue)
    });
    this.toolchainPath.subscribe((newValue) => {
      console.log("Saving toolchainPath", newValue);
      if (newValue !== undefined)
        this.store.set('toolchainPath', newValue)
    });
    this.folderPath.subscribe((newValue) => {
      console.log("Saving folderPath", newValue);
      if (newValue !== undefined)
        this.store.set('folderPath', newValue);
    });
    this.toolchainDownloaded.subscribe((newValue) => {
      console.log("Saving toolchainDownloaded", newValue);
      if(newValue !== undefined)
        this.store.set('toolchainDownloaded', newValue);
      }
    );
    this.activeFile.subscribe((newValue) => {
        console.log("Saving activeFile", newValue);
        if(newValue !== undefined)
          this.store.set('activeFile', newValue);
      }
    );
    this.activeFileContent.subscribe((newValue) => {
        console.log("Saving activeFileContent");
        if(newValue !== undefined)
          this.store.set('activeFileContent', newValue);
      }
    );
    this.activeFileIsSaveable.subscribe((newValue) => {
        console.log("Saving activeFileIsSaveable", newValue);
        if(newValue !== undefined)
          this.store.set('activeFileIsSaveable', newValue);
      }
    );
  }
}
