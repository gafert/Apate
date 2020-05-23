import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Store from 'electron-store';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, AfterViewInit {
  @Input() setting: string;
  @Output() settingChange = new EventEmitter<string>();
  @Input() settingKey: string;
  @Input() settingDefault: string;

  private store = new Store();

  ngOnInit(): void {
    if(!this.setting) {
      this.setting = this.store.get(this.settingKey, this.settingDefault);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.settingChange.emit(this.setting), 100);
  }

  settingChanged(event) {
    this.store.set(this.settingKey, event);
    this.settingChange.emit(event);
  }
}
