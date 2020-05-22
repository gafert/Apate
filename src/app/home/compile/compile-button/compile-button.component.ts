import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {easing, styler, tween} from "popmotion";

@Component({
  selector: 'app-compile-button',
  templateUrl: './compile-button.component.html',
  styleUrls: ['./compile-button.component.scss']
})
export class CompileButtonComponent implements OnInit, OnChanges {
  @Input() compiling = false;
  @Output() compile = new EventEmitter();

  public compileButtonTweens = [];

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  compilerButtonEnter(event) {
    if (!this.compiling) {
      let button = event.target;
      let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.compileButtonTweens.push(tween({
        from: {scale: currentScale},
        to: {scale: 1.2},
        ease: easing.easeOut,
        duration: 1000
      }).start(v => style.set(v)));
    }
  }

  compilerButtonDown(event) {
    if (!this.compiling) {
      let button = event.target;
      let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
      this.stopOtherTweens();
      const style = styler(button);
      this.compileButtonTweens.push(tween({
        from: {scale: currentScale, backgroundColor: style.get('background-color')},
        to: {scale: 0.9, backgroundColor: '#6b6b6b'},
        ease: easing.linear,
        duration: 50
      }).start(v => style.set(v)));

      this.compiling = true;
      this.compile.emit();
    }
  }

  compilerButtonUp(event) {
    let thiz = this;
    let button = event.target;
    const style = styler(button);

    if (!this.compiling) {
      checkAnimation();
    }

    function checkAnimation() {
      setTimeout(() => {
        if (!thiz.compileButtonTweens[0].isActive()) {
          thiz.stopOtherTweens();
          thiz.compileButtonTweens.push(tween({
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

  compilerButtonLeave(event) {
    let button = event.target;
    let currentScale = button.getBoundingClientRect().width / button.offsetWidth;
    this.stopOtherTweens();
    const style = styler(button);
    this.compileButtonTweens.push(tween({
      from: {scale: currentScale},
      to: {scale: 1},
      ease: easing.linear,
      duration: 100
    }).start(v => style.set(v)));
  }

  resetCompilerButton() {
    let button = document.getElementById('compiler-button');
    let currentScale = button.getBoundingClientRect().width / button.offsetWidth;

    const style = styler(button);
    tween({
      from: {backgroundColor: style.get('background-color'), scale: currentScale},
      to: {backgroundColor: '#009400', scale: 1},
      ease: easing.linear,
      duration: 50
    }).start(v => style.set(v));
    this.compiling = false;
    this.changeDetection.detectChanges();
  }

  stopOtherTweens() {
    for (let tween of this.compileButtonTweens) {
      tween.stop();
    }
    this.compileButtonTweens = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.compiling.currentValue === false) {
      this.resetCompilerButton();
    }
  }
}
