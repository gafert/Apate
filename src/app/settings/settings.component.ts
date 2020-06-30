import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {DataService, ToolchainDownEnum, ToolchainDownloaderService} from "../core/services";
import * as electron from "electron";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('toolchainPathOptions') toolchainPathOptions: ElementRef<HTMLDivElement>;

  /** Set by user to local path or downloaded path */
  public toolchainPath;
  /** Set by the user but loads defaults e.g. riscv64-unknown-elf- */
  public toolchainPrefix;
  public toolchainPrefixDefault = "riscv64-unknown-elf-";

  public toolchainPercentDownloaded;
  public toolchainDownloaderState;
  public ToolchainDownEnum = ToolchainDownEnum;

  private toolchainPathOptionsOpen = false;

  constructor(private toolchainDownloaderService: ToolchainDownloaderService,
              private dataService: DataService) {

    document.addEventListener('click', (event) => {
      if (this.toolchainPathOptionsOpen) {
        this.toolchainPathOptions.nativeElement.style.display = "none";
      }
    });

    this.toolchainDownloaderService.state.subscribe((state) => {
      switch (state.state) {
        case ToolchainDownEnum.DOWNLOADING:
          // TODO: State is not updated in layout in first call
          this.toolchainPercentDownloaded = state.reason as number;
          this.toolchainDownloaderState = state.state;
          break;
        case ToolchainDownEnum.DOWNLOADED:
          // Save toolchain path and set it in the vis
          // Only set the path if the path was empty
          this.dataService.toolchainPath.next(state.reason as string);
          this.toolchainPath = state.reason as string;
          this.toolchainDownloaderState = state.state;
          break;
        default:
          this.toolchainDownloaderState = state.state;
      }
    });

    this.dataService.toolchainPath.subscribe((value) => {
      this.toolchainPath = value;
    });
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {

  }

  clickToolchainPath(event) {
    this.toolchainPathOptions.nativeElement.style.display = "block";
    this.toolchainPathOptions.nativeElement.style.top = event.y + "px";
    this.toolchainPathOptions.nativeElement.style.left = event.x - 170 + "px";
    this.toolchainPathOptionsOpen = true;
    event.stopPropagation();
  }

  openToolchainPathExplorerDialog() {
    electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((result) => {
      if (!result.canceled) {
        this.toolchainPath = result.filePaths[0];
        this.dataService.toolchainPath.next(this.toolchainPath);
      }
    })
  }

  downloadToolchain() {
    this.toolchainPath = "";
    this.toolchainDownloaderService.downloadToolchain();
  }

  useDownloadedToolchain() {
    this.toolchainPath = this.toolchainDownloaderService.toolchainDownloadPath;
    this.dataService.toolchainPath.next(this.toolchainPath);
  }

  removeToolchain() {
    this.toolchainDownloaderService.removeToolchain();
    this.toolchainPath = "";
    this.dataService.toolchainPath.next(this.toolchainPath);
  }

  closeWindow() {
    electron.remote.getCurrentWindow().close();
  }

  clearSettingsAndRestart() {
    this.dataService.clearSettingsFile();
    electron.remote.app.relaunch();
    electron.remote.app.exit(0);
  }
}
