import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ToolchainDownEnum, ToolchainDownloaderService } from './services/toolchain-downloader.service';
import { DataKeys, DataService } from '../services/data.service';
import * as electron from 'electron';
import { SettingComponent } from '../components/setting/setting.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewInit{
  @ViewChild('toolchainPathOptions') toolchainPathOptions: ElementRef<HTMLDivElement>;
  @ViewChild('toolchainSetting') toolchainSetting: SettingComponent;

  public DataKeys = DataKeys;

  public toolchainPath;

  public toolchainPrefixDefault = 'riscv64-unknown-elf-';
  public readElfDefault = '-a';
  public objdumpFlagsDefault = '--section .text.init --section .text --section .data --full-contents --disassemble --syms --source -z';

  public toolchainPercentDownloaded;
  public toolchainDownloaderState;
  public ToolchainDownEnum = ToolchainDownEnum;

  constructor(private toolchainDownloaderService: ToolchainDownloaderService,
    private dataService: DataService,
    private changeDetection: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.toolchainDownloaderService.state.subscribe((state) => {
      console.log("CHANGE")
      switch (state.state) {
        case ToolchainDownEnum.DOWNLOADING:
          this.toolchainPercentDownloaded = state.reason as number;
          this.toolchainDownloaderState = state.state;
          this.changeDetection.detectChanges();
          console.log("Downloading", state.state);
          break;
        case ToolchainDownEnum.DOWNLOADED:
          // Save toolchain path and set it in the vis
          // Only set the path if the path was empty
          this.dataService.setSetting(DataKeys.TOOLCHAIN_PATH, state.reason as string);
          this.toolchainDownloaderState = state.state;
          this.changeDetection.detectChanges();
          this.toolchainSetting.refresh();
          console.log("Downloaded", state.state);
          break;
        default:
          this.toolchainDownloaderState = state.state;
          this.changeDetection.detectChanges();
      }
      this.changeDetection.detectChanges();
      console.log("updated with state", state)
    });

    this.dataService.data[DataKeys.TOOLCHAIN_PATH].subscribe((d) => {
      this.toolchainPath = d;
      console.log(this.toolchainPath);
      this.changeDetection.detectChanges();
    });
  }

  openToolchainPathExplorerDialog() {
    electron.remote.dialog
      .showOpenDialog({
        properties: ['openDirectory']
      })
      .then((result) => {
        if (!result.canceled) {
          this.dataService.setSetting(DataKeys.TOOLCHAIN_PATH, result.filePaths[0]);
          this.changeDetection.detectChanges();
          this.toolchainSetting.refresh();
        }
      });
  }

  downloadToolchain() {
    this.dataService.setSetting(DataKeys.TOOLCHAIN_PATH, '');
    this.toolchainDownloaderService.downloadToolchain();
  }

  useDownloadedToolchain() {
    this.dataService.setSetting(DataKeys.TOOLCHAIN_PATH, this.toolchainDownloaderService.toolchainDownloadPath);
    this.changeDetection.detectChanges();
    this.toolchainSetting.refresh();
  }

  removeToolchain() {
    this.toolchainDownloaderService.removeToolchain();
    this.dataService.setSetting(DataKeys.TOOLCHAIN_PATH, '');
    this.changeDetection.detectChanges();
    this.toolchainSetting.refresh();
  }

  closeWindow() {
    electron.remote.getCurrentWindow().close();
  }

  clearSettingsAndRestart() {
    this.dataService.clearSettingsFile();
    electron.remote.app.relaunch();
    electron.remote.app.exit(0);
  }

  saveSettings(settingToSave: SettingComponent[]) {
    settingToSave.forEach((s) => s.save());
    this.closeWindow();
  }
}
