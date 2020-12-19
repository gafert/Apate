import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { easing, styler, tween } from 'popmotion';
import { readStyleProperty } from '../../utils/helper';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements AfterViewInit, OnChanges {
  @Input() disabled = false;
  @Input() text = 'CLICK';
  @Input() iconClass: string;

  @Output() buttonClick = new EventEmitter();
  @ViewChild('button') button: ElementRef<HTMLDivElement>;

  public buttonTweens = [];

  constructor(private changeDetection: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.disabled) {
      this.buttonDisabled();
    }
  }

  buttonEnter() {
    if (!this.disabled) {
      const button = this.button.nativeElement;
      const currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.buttonTweens.push(
        tween({
          from: { scale: currentScale },
          to: { scale: 1.2 },
          ease: easing.easeOut,
          duration: 1000,
        }).start((v) => style.set(v))
      );
    }
  }

  buttonDown() {
    if (!this.disabled) {
      const button = this.button.nativeElement;
      const currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.buttonTweens.push(
        tween({
          from: { scale: currentScale },
          to: { scale: 0.9 },
          ease: easing.linear,
          duration: 50,
        }).start((v) => style.set(v))
      );

      this.buttonClick.emit();
    }
  }

  buttonDisabled() {
    const button = this.button.nativeElement;
    const style = styler(button);
    this.buttonTweens.push(
      tween({
        from: { backgroundColor: style.get('background-color') },
        to: { backgroundColor: '#6b6b6b' },
        ease: easing.linear,
        duration: 50,
      }).start((v) => style.set(v))
    );
  }

  buttonUp() {
    const thiz = this;
    const button = this.button.nativeElement;
    const style = styler(button);

    function checkAnimation() {
      setTimeout(() => {
        if (!thiz.buttonTweens[0]?.isActive()) {
          thiz.stopOtherTweens();
          thiz.buttonTweens.push(
            tween({
              from: { scale: style.get('scale') },
              to: { scale: 1 },
              ease: easing.linear,
              duration: 100,
            }).start((v) => style.set(v))
          );
        } else {
          checkAnimation();
        }
      }, 10);
    }

    if (!this.disabled) {
      checkAnimation();
    }
  }

  buttonLeave() {
    const button = this.button.nativeElement;
    const currentScale = button.getBoundingClientRect().width / button.offsetWidth;
    this.stopOtherTweens();
    const style = styler(button);
    this.buttonTweens.push(
      tween({
        from: { scale: currentScale },
        to: { scale: 1 },
        ease: easing.linear,
        duration: 100,
      }).start((v) => style.set(v))
    );
  }

  buttonReset() {
    const button = this.button.nativeElement;
    const currentScale = button.getBoundingClientRect().width / button.offsetWidth;
    this.stopOtherTweens();

    const style = styler(button);
    tween({
      from: { backgroundColor: style.get('background-color'), scale: currentScale },
      to: { backgroundColor: readStyleProperty('accent'), scale: 1 },
      ease: easing.linear,
      duration: 50,
    }).start((v) => style.set(v));
    this.disabled = false;
    this.changeDetection.detectChanges();
  }

  stopOtherTweens() {
    for (const tween of this.buttonTweens) {
      tween.stop();
    }
    this.buttonTweens = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && this.button) {
      if (changes.disabled.currentValue === false) this.buttonReset();
      if (changes.disabled.currentValue === true) this.buttonDisabled();
    }
  }
}
