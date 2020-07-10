import { Component, OnDestroy, OnInit } from '@angular/core';
import { byteToHex, range } from '../../../globals';
import { SimLibInterfaceService } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-memory',
	templateUrl: './memory.component.html',
	styleUrls: ['./memory.component.css'],
})
export class MemoryComponent implements OnInit, OnDestroy {
	public byteToHex = byteToHex;
	public range = range;

	public mem_addr;
	public mem_rdata;
	public mem_wdata;
	public mem_valid;
	public memory;

	private ngUnsubscribe = new Subject();

	constructor(private SimLibInterfaceService: SimLibInterfaceService) {
		SimLibInterfaceService.bindings.mem_addr__subject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
			this.mem_addr = value;
		});
		SimLibInterfaceService.bindings.mem_rdata__subject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
			this.mem_rdata = value;
		});
		SimLibInterfaceService.bindings.mem_wdata__subject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
			this.mem_wdata = value;
		});
		SimLibInterfaceService.bindings.mem_valid__subject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
			this.mem_valid = value;
		});
		SimLibInterfaceService.bindings.memory__subject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
			this.memory = value;
		});
	}

	ngOnInit(): void {}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
