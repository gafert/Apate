import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-selecto-option',
	templateUrl: './selecto-option.component.html',
	styleUrls: ['./selecto-option.component.css'],
})
export class SelectoOptionComponent implements OnInit {
	@Input() options: {};
	@Output() optionsChange: EventEmitter<any> = new EventEmitter<any>();

	constructor() {}

	ngOnInit(): void {}

	setSelected(key) {
		for (const item in this.options) {
			this.options[item].selected = false;
		}
		this.options[key].selected = true;
		this.optionsChange.next(this.options);
	}
}
