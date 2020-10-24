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
  public memory;

  private ngUnsubscribe = new Subject();

  constructor(private SimLibInterfaceService: SimLibInterfaceService) {
    SimLibInterfaceService.bindings.memory.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.memory = value;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
