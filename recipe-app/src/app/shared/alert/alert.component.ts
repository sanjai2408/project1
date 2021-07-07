import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent{
    //a message variable which can be set from outside (auth-component html)
    @Input() message: string;
    @Output() close = new EventEmitter<void>();

    //emitter created to close the alert box
    onClose(){
        this.close.emit();
    }
}