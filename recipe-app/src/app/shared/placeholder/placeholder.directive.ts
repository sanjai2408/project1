import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceHolder]'
})
export class PlaceHolderDirective {
    //gets access to the place where the directive is added to
    constructor(public viewContRef: ViewContainerRef){}
    
}