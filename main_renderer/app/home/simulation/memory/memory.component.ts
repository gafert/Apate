import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { byteToHex, range } from '../../../globals';
import { CpuInterface } from '../../../core/services/sim-lib-interface/sim-lib-interface.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit, OnDestroy {
  public byteToHex = byteToHex;
  public range = range;
  public memory;

  private ngUnsubscribe = new Subject();
  private onResizer = false;

  constructor(private el: ElementRef, private SimLibInterfaceService: CpuInterface) {
    SimLibInterfaceService.bindings.memory.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.memory = value;
    });
  }

  ngOnInit(): void {
    document.addEventListener('mouseup', (e) => {
      if(this.onResizer) {
        e.preventDefault();
        e.stopPropagation();
        this.onResizer = false;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if(this.onResizer) {
        e.preventDefault();
        e.stopPropagation();
        const height = (this.el.nativeElement.getBoundingClientRect().bottom - e.pageY) + 'px';
        this.el.nativeElement.style.height = height;
        console.log(this.el.nativeElement.getBoundingClientRect());      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  resizerClick(e) {
    this.onResizer = true;
  }
}
