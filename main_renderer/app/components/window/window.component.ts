import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {remote} from "electron";

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements AfterViewInit, OnDestroy {
  @Input() title = "CPU Simulator";
  @Input() info = "";
  @Input() showMinimize = true;
  @Input() showMaximize = true;
  public win: Electron.BrowserWindow;
  public isMac = process.platform == 'darwin';

  ngOnDestroy() {
    this.win.removeAllListeners();
  }

  ngAfterViewInit() {
    this.win = remote.getCurrentWindow();
    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    this.toggleMaxRestoreButtons();
    this.win.on('maximize', () => this.toggleMaxRestoreButtons());
    this.win.on('restore', () => this.toggleMaxRestoreButtons());
    this.win.on('unmaximize', () => this.toggleMaxRestoreButtons());
    this.win.on('resized', () => this.toggleMaxRestoreButtons());
  }

  toggleMaxRestoreButtons() {
    if (this.win.isMaximized()) {
      document.body.classList.add('maximized');
    } else {
      document.body.classList.remove('maximized');
    }
  }
}
