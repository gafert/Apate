import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';
import tippy, {Props} from 'tippy.js';

interface TippyDirectiveInterface extends Partial<Props> {
  tippyElementId: string;
}

@Directive({
  /* tslint:disable-next-line */
  selector: '[tippy1]'
})
export class TippyDirective implements OnInit, AfterViewInit {

  @Input('tippyOptions1') public tippyOptions1: Partial<TippyDirectiveInterface>;

  private tippyRef;

  constructor(private el: ElementRef) {
    this.el = el;
  }

  public ngOnInit() {
    if (this.tippyOptions1.tippyElementId) {
      this.tippyOptions1.allowHTML = true;
    }
    this.tippyOptions1.theme = 'light';
    this.tippyRef = tippy(this.el.nativeElement, this.tippyOptions1 || {});
  }

  ngAfterViewInit(): void {
    if (this.tippyOptions1.tippyElementId) {
      this.tippyRef.setContent(document.getElementById(this.tippyOptions1.tippyElementId).innerHTML)
    }
  }

}
