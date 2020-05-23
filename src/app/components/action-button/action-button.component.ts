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
  ViewChild
} from '@angular/core';
import {easing, styler, tween} from "popmotion";

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements AfterViewInit, OnChanges {
  @Input() disabled = false;
  @Input() text: string = "CLICK";
  @Input() iconClass: string;

  @Output() activate = new EventEmitter();
  @ViewChild('button') button: ElementRef<HTMLDivElement>;

  public buttonTweens = [];

  constructor(private changeDetection: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    if (this.disabled) {
      this.buttonDisabled();
    }
  }

  buttonEnter() {
    if (!this.disabled) {
      let button = this.button.nativeElement;
      let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.buttonTweens.push(tween({
        from: {scale: currentScale},
        to: {scale: 1.2},
        ease: easing.easeOut,
        duration: 1000
      }).start(v => style.set(v)));
    }
  }

  buttonDown() {
    if (!this.disabled) {
      let button = this.button.nativeElement;
      let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.buttonTweens.push(tween({
        from: {scale: currentScale},
        to: {scale: 0.9},
        ease: easing.linear,
        duration: 50
      }).start(v => style.set(v)));

      this.activate.emit();
    }
  }

  buttonDisabled() {
    let button = this.button.nativeElement;
    const style = styler(button);
    this.buttonTweens.push(tween({
      from: {backgroundColor: style.get('background-color')},
      to: {backgroundColor: '#6b6b6b'},
      ease: easing.linear,
      duration: 50
    }).start(v => style.set(v)));
  }

  buttonUp() {
    let thiz = this;
    let button = this.button.nativeElement;
    const style = styler(button);

    if (!this.disabled) {
      checkAnimation();
    }

    function checkAnimation() {
      setTimeout(() => {
        if (!thiz.buttonTweens[0].isActive()) {
          thiz.stopOtherTweens();
          thiz.buttonTweens.push(tween({
            from: {scale: style.get('scale')},
            to: {scale: 1},
            ease: easing.linear,
            duration: 100
          }).start(v => style.set(v)));
        } else {
          checkAnimation();
        }
      }, 10);
    }
  }

  buttonLeave() {
    let button = this.button.nativeElement;
    let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
    this.stopOtherTweens();
    const style = styler(button);
    this.buttonTweens.push(tween({
      from: {scale: currentScale},
      to: {scale: 1},
      ease: easing.linear,
      duration: 100
    }).start(v => style.set(v)));
  }

  buttonReset() {
    let button = this.button.nativeElement;
    let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
    this.stopOtherTweens();

    const style = styler(button);
    tween({
      from: {backgroundColor: style.get('background-color'), scale: currentScale},
      to: {backgroundColor: '#009400', scale: 1},
      ease: easing.linear,
      duration: 50
    }).start(v => style.set(v));
    this.disabled = false;
    this.changeDetection.detectChanges();
  }

  stopOtherTweens() {
    for (let tween of this.buttonTweens) {
      tween.stop();
    }
    this.buttonTweens = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && this.button) {
      if (changes.disabled.currentValue === false)
        this.buttonReset();
      if (changes.disabled.currentValue === true)
        this.buttonDisabled();
    }
  }
}
