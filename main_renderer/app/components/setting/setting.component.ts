import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DataKeys, DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public setting: string;
  @Input() settingKey: DataKeys;
  @Input() settingDefault: string;

  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    try {
      if (!this.dataService.data[this.settingKey].value) {
        this.setting = this.settingDefault;
      } else {
        this.setting = this.dataService.data[this.settingKey].value;
      }

    } catch (e) {
      console.error("Could not load setting " + this.settingKey);
    }
  }

  public save() {
    this.dataService.setSetting(this.settingKey, this.setting);
  }

  public refresh() {
    this.setting = this.dataService.data[this.settingKey].value;
  }
}
