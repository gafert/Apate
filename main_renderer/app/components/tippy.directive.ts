import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import tippy, { Props } from 'tippy.js';

interface TippyDirectiveInterface extends Partial<Props>{
  tippyElementId: string;
}

@Directive({
  /* tslint:disable-next-line */
  selector: '[tippy]'
})
export class TippyDirective implements OnInit, AfterViewInit {

  @Input('tippyOptions') public tippyOptions: Partial<TippyDirectiveInterface>;

  private tippyRef;

  constructor(private el: ElementRef) {
    this.el = el;
  }

  public ngOnInit() {
    if(this.tippyOptions.tippyElementId) {
      this.tippyOptions.allowHTML = true;
    }
    this.tippyOptions.theme = 'light';
    this.tippyRef = tippy(this.el.nativeElement, this.tippyOptions || {});
  }

  ngAfterViewInit(): void {
    if(this.tippyOptions.tippyElementId) {
      this.tippyRef.setContent(document.getElementById(this.tippyOptions.tippyElementId).innerHTML)
    }
  }

}
