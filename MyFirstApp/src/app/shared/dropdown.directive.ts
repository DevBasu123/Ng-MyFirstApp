import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})

export class DropdownDirective {

    @HostBinding('class.open') isOpen = false;

    // ==============================================================
    // @HostListener('click') toggleOpen(){
    //     this.isOpen = !this.isOpen;
    // }
    // ==============================================================
    // Alternative way.........
    // dropdown can also be closed by a click anywhere outside,
    // (which also means that a click on one dropdown closes any other one).
    // ==============================================================
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    constructor(private elRef: ElementRef) {}
    // ==============================================================

}

