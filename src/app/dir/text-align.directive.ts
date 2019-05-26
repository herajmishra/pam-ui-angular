import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[appTextAlign]'
})
export class TextAlignDirective {

    constructor(private el: ElementRef) {
        el.nativeElement.style.textAlign = 'right';
    }

}
