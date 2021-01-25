import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {remote} from "electron";

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title = "CPU Simulator";
  @Input() info = "/Path/to/main.elf";
  public win = remote.getCurrentWindow();
  public isMac = process.platform == 'darwin';

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.win.removeAllListeners();
  }

  ngAfterViewInit() {
    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    this.toggleMaxRestoreButtons();
    this.win.on('maximize', this.toggleMaxRestoreButtons.bind(this));
    this.win.on('unmaximize', this.toggleMaxRestoreButtons.bind(this));  }

  toggleMaxRestoreButtons() {
    if (this.win.isMaximized()) {
      document.body.classList.add('maximized');
    } else {
      document.body.classList.remove('maximized');
    }
  }
}
