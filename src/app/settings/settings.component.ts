import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService, ToolchainDownEnum, ToolchainDownloaderService} from "../core/services";
import * as electron from "electron";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('toolchainPathOptions') toolchainPathOptions: ElementRef<HTMLDivElement>;

  /** Set by user to local path or downloaded path */
  public toolchainPath;
  /** Set by the user but loads defaults e.g. riscv64-unkown-elf- */
  public toolchainPrefix;
  public toolchainPrefixDefault = "riscv64-unknown-elf-";

  public toolchainPercentDownloaded;
  public toolchainDownloaderState;
  public ToolchainDownEnum = ToolchainDownEnum;

  private toolchainPathOptionsOpen = false;

  constructor(private toolchainDownloaderService: ToolchainDownloaderService, private dataService: DataService, private changeDetection: ChangeDetectorRef) {
    this.dataService.toolchainPath.subscribe((value) => {
      let oldPath = this.toolchainPath;
      this.toolchainPath = value;
      if (oldPath !== value && oldPath) {
        this.changeDetection.detectChanges();
      }
    });

    this.toolchainDownloaderService.state.subscribe((state) => {
      switch (state.state) {
        case ToolchainDownEnum.DOWNLOADING:
          this.toolchainPercentDownloaded = state.reason as number;
          this.changeDetection.detectChanges();
      }

      let oldState = this.toolchainDownloaderState;
      this.toolchainDownloaderState = state.state;

      if (state.state !== oldState && oldState) {
        this.changeDetection.detectChanges();
      }

      console.log("New toolchainDownloaderState", state)
    });

    document.addEventListener('click', (event) => {
      if (this.toolchainPathOptionsOpen) {
        this.toolchainPathOptions.nativeElement.style.display = "none";
      }
    })
  }

  ngOnInit(): void {

  }

  clickToolchainPath(event) {
    this.toolchainPathOptions.nativeElement.style.display = "block";
    this.toolchainPathOptions.nativeElement.style.top = event.y + "px";
    this.toolchainPathOptions.nativeElement.style.left = event.x + "px";
    this.toolchainPathOptionsOpen = true;
    event.stopPropagation();
  }

  openToolchainPathDialog() {
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
    this.toolchainDownloaderService.downloadToolchain();
  }

  useDownloadedToolchain() {
    this.toolchainPath = this.toolchainDownloaderService.toolchainDownloadPath;
    this.dataService.toolchainPath.next(this.toolchainPath);
  }

  removeToolchain() {
    this.toolchainDownloaderService.removeToolchain();
  }

  closeWindow() {
    electron.remote.getCurrentWindow().close();
  }
}
