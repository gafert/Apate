import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';

@Component({
	selector: 'app-terminal',
	templateUrl: './terminal.component.html',
	styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements OnInit, OnDestroy, AfterViewInit {
	public terminal = '';

	constructor(private SimLib: SimLibInterfaceService) {}

	ngAfterViewInit() {
		this.SimLib.bindings.addBufferWriteCallback((c) => this.printBuffer(c));
	}

	printBuffer(character) {
		this.terminal += String.fromCharCode(character);
	}

	ngOnInit(): void {}

	ngOnDestroy() {
		// TODO: Find a way to remove a callback from a list
		this.SimLib.bindings.bufferWriteCallbacks = [];
	}
}
