import {AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {byteToHex, range} from '../../../../globals';
import {CPUService} from '../../services/cpu.service';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit, OnDestroy, AfterViewInit {
  public byteToHex = byteToHex;
  public String = String;
  public range = range;
  public ceil = Math.ceil;
  public memory = null;
  public bytesInLine = 4;

  public memoryElements;

  private ngUnsubscribe = new Subject();

  public addressAsDecimal = false;
  public dataAsDecimal = false;
  @ViewChild(CdkVirtualScrollViewport, {static: false}) cdkVirtualScrollViewport;

  constructor(private el: ElementRef, private cpu: CPUService) {
    cpu.bindings.memory.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.memory = value;
      if(!this.memoryElements) this.memoryElements = range(0, this.memory.length, this.bytesInLine);
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    fromEvent(window, 'resize').subscribe(() => {
      this.cdkVirtualScrollViewport.checkViewportSize()
      console.log('resize');
    });
  }


  read4BytesLittleEndian(data, location) {
    return data[location + 3] * 256 * 256 * 256
      + data[location + 2] * 256 * 256
      + data[location + 1] * 256
      + data[location + 0];
  }

  get4BytesHex(data, location) {
    let s = byteToHex(data[location + 3], 2) + " ";
    s += byteToHex(data[location + 2], 2) + " ";
    s += byteToHex(data[location + 1], 2) + " ";
    s += byteToHex(data[location], 2)
    return s;
  }

  get4BytesAscii(data, location) {
    let s = String.fromCharCode(data[location + 3]);
    s += String.fromCharCode(data[location + 2])
    s += String.fromCharCode(data[location + 1])
    s += String.fromCharCode(data[location])
    return s;
  }
}
