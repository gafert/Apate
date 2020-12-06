import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as fs from 'fs';
import * as Store from 'electron-store';
import SparkMD5 from 'spark-md5';

export enum DataKeys {
  TOOLCHAIN_PREFIX,
  TOOLCHAIN_PATH,
  FOLDER_PATH,
  TOOLCHAIN_DOWNLOADED,
  ACTIVE_FILE,
  ACTIVE_FILE_CONTENT ,
  ACTIVE_FILE_IS_SAVEABLE,
  GCC_FLAGS ,
  OBJDUMP_FLAGS,
  GCC_SOURCES,
  READ_ELF_FLAGS,
  ELF_PATH
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public data = {};

  // Temporary Variables set by the application
  public instructionsSections: any;

  /** Only save to file if the hash of the element which should be saved changed */
  private hashList = [];
  private store = new Store();

  constructor() {
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        this.data[DataKeys[dataKeysKey]] = new BehaviorSubject<any>(undefined);
        this.data[DataKeys[dataKeysKey]].next(this.store.get(dataKeysKey));
        this.subscribeToSetting(this.data[DataKeys[dataKeysKey]], dataKeysKey);
      }
    }

    console.log(DataKeys.TOOLCHAIN_DOWNLOADED);
    console.log(this.data);
  }

  getSetting(key: DataKeys) {
    return this.data[key].value;
  }

  setSetting(key: DataKeys, value) {
    this.data[key].next(value);
  }

  public reloadSettings() {
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        this.data[DataKeys[dataKeysKey]].next(this.store.get(dataKeysKey));
      }
    }
  }

  public clearSettingsFile() {
    fs.unlink(this.store.path, () => null);
  }

  private subscribeToSetting(setting, settingString) {
    if (this.hashList[settingString] === undefined) {
      this.hashList[settingString] = SparkMD5.hash(String(this.store.get(settingString, '')));
    }
    setting.subscribe((newValue) => {
      if (this.hashList[settingString] !== SparkMD5.hash(String(newValue))) {
        console.log('Saving ' + settingString);
        if (newValue) {
          this.store.set(settingString, newValue);
        } else {
          this.store.delete(settingString);
        }
        this.hashList[settingString] = SparkMD5.hash(String(this.store.get(settingString, '')));
      }
    });
  }
}
