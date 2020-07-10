import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Store from 'electron-store';
import * as fs from 'fs';
import SparkMD5 from 'spark-md5';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	// Temporary Variables set by the application
	public instructionsSections: any;
	toolchainPath: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
	folderPath: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
	toolchainDownloaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
	activeFile: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
	activeFileContent: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
	activeFileIsSaveable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
	toolchainPrefix: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
	/** Only save to file if the hash of the element which should be saved changed */
	hashList = [];
	private store = new Store();

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
