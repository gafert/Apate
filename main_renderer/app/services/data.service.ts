import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as fs from 'fs';
import * as Store from 'electron-store';
import SparkMD5 from 'spark-md5';

export enum DataKeys {
  TOOLCHAIN_PREFIX,
  TOOLCHAIN_PATH,
  PROJECT_PATH,
  TOOLCHAIN_DOWNLOADED,
  ACTIVE_FILE,
  ACTIVE_FILE_CONTENT,
  ACTIVE_FILE_IS_SAVEABLE,
  OBJDUMP_FLAGS,
  READ_ELF_FLAGS,
  ELF_PATH,
  ELABORATE_STEPS,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public data = {};

  /** Only save to file if the hash of the element which should be saved changed */
  private hashList = [];
  private appStore = new Store();

  constructor() {
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        const num = DataKeys[dataKeysKey];
        this.data[num] = new BehaviorSubject<any>(undefined);
        this.data[num].next(this.appStore.get(dataKeysKey, null));
        this.subscribeToSetting(this.data[num], dataKeysKey);
      }
    }
  }

  public getSetting(key: DataKeys) {
    return this.data[key].value;
  }

  public setSetting(key: DataKeys, value) {
    this.data[key].next(value);
  }

  public reloadSettings() {
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        const num = DataKeys[dataKeysKey];
        this.data[num].next(this.appStore.get(dataKeysKey));
      }
    }
  }

  public clearSettingsFile() {
    fs.unlink(this.appStore.path, () => null);
  }

  private subscribeToSetting(setting, settingString) {
    if (this.hashList[settingString] === undefined) {
      this.hashList[settingString] = SparkMD5.hash(String(this.appStore.get(settingString, '')));
    }
    setting.subscribe((newValue) => {
      if (this.hashList[settingString] !== SparkMD5.hash(String(newValue))) {
        if (newValue) {
          this.appStore.set(settingString, newValue);
        } else {
          this.appStore.delete(settingString);
        }
        this.hashList[settingString] = SparkMD5.hash(String(this.appStore.get(settingString, '')));
      }
    });
  }
}
