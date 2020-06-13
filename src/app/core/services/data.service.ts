import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as Store from 'electron-store';
import fs from "fs";

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

  constructor() {
    this.loadSettings();
    this.subscribeToSetting(this.toolchainPrefix, 'toolchainPrefix');
    this.subscribeToSetting(this.toolchainPath, 'toolchainPath');
    this.subscribeToSetting(this.folderPath, 'folderPath');
    this.subscribeToSetting(this.toolchainDownloaded, 'toolchainDownloaded');
    this.subscribeToSetting(this.activeFile, 'activeFile');
    this.subscribeToSetting(this.activeFileContent, 'activeFileContent');
    this.subscribeToSetting(this.activeFileIsSaveable, 'activeFileIsSaveable');
  }

  public loadSettings() {
    this.toolchainPath.next(this.store.get('toolchainPath'));
    this.folderPath.next(this.store.get('folderPath'));
    this.toolchainDownloaded.next(this.store.get('toolchainDownloaded'));
    this.activeFileContent.next(this.store.get('activeFileContent'));
    this.activeFile.next(this.store.get('activeFile'));
    this.activeFileIsSaveable.next(this.store.get('activeFileIsSaveable'));
    this.toolchainPrefix.next(this.store.get('toolchainPrefix'));
  }

  public clearSettingsFile() {
    fs.unlink(this.store.path, () => null);
  }

  private subscribeToSetting(setting, settingString) {
    if(!oldValue) var oldValue = this.store.get(settingString);
    setting.subscribe((newValue) => {
      if (newValue !== undefined && oldValue !== newValue) {
        console.log("Saving " + settingString);
        this.store.set(settingString, newValue)
      }
      oldValue = newValue;
    });
  }
}
