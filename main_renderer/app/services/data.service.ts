import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
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
  WIZARD_INTRO_NOT_ACTIVE,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public data: { [index: number /** DataKeys */]: BehaviorSubject<any> } = {};

  /** Only save to file if the hash of the element which should be saved changed */
  private hashList = [];
  private appStore = new Store();
  private volatileData: { [index: string]: any } = {}

  constructor() {
    // Load all value from the file into data property
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        const num = DataKeys[dataKeysKey];
        this.data[num] = new BehaviorSubject<any>(undefined);
        this.data[num].next(this.appStore.get(dataKeysKey, null));
        this.subscribeToSetting(this.data[num], dataKeysKey);
      }
    }
  }

  /**
   * Save data as long as the program is running.
   * Used to make component properties persistent.
   * @param ref Reference string
   * @param name Name of the variable
   * @param data Value of the variable
   */
  public setVolatileData(ref, name, data) {
    this.volatileData[ref] = {
      ...this.volatileData[ref],
      [name]: data
    };
  }

  /**
   * Get data which was previously saved with setVolatileData().
   * @param ref Reference string
   * @param name Name of the variable
   * @param defaultValue Default value if no value was previously saved
   */
  public getVolatileData(ref, name, defaultValue) {
    const data = this.volatileData[ref]?.[name];
    return (data === undefined) ? defaultValue : data;
  }

  /**
   * Clear volatile data
   * @param ref If set only elements with this ref will be deleted
   */
  public clearVolatileData(ref = undefined) {
    if (ref) {
      console.log('Clearing volatile data of ', ref, this.volatileData[ref])
      Object.keys(this.volatileData).forEach((key) => {
        if (key === ref) delete this.volatileData[key];
      });
    } else {
      console.log('Clearing all volatile data');
      Object.keys(this.volatileData).forEach((key) => delete this.volatileData[key]);
    }
  }

  /**
   * Get a settings value
   * @param key
   */
  public getSetting(key: DataKeys) {
    return this.data[key].value;
  }

  /**
   * Save a value to the settings.
   * Will be saved on disk in config.json.
   * @param key
   * @param value
   */
  public setSetting(key: DataKeys, value) {
    this.data[key].next(value);
  }

  /**
   * Reload all settings from memory
   */
  public reloadSettings() {
    for (const dataKeysKey in DataKeys) {
      if (isNaN(Number(dataKeysKey))) {
        const num = DataKeys[dataKeysKey];
        this.data[num].next(this.appStore.get(dataKeysKey));
      }
    }
  }

  /**
   * Remove config.json file
   */
  public clearSettingsFile() {
    fs.unlink(this.appStore.path, () => null);
    this.reloadSettings();
  }

  /**
   * Internally used to detect changes of settings and
   * save them if the value changed
   * @param setting Subscribable setting value
   * @param settingString Name string of DataKeys which is stored in config.json
   * @private
   */
  private subscribeToSetting(setting: BehaviorSubject<any>, settingString: string) {
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
