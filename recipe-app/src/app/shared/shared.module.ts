import { PlaceHolderDirective } from './placeholder/placeholder.directive';
import { AlertComponent } from './alert/alert.component';
import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { LoggingService } from '../logging.service';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule
    ],
    entryComponents: [AlertComponent],
    providers: [LoggingService]
})
export class SharedModule{}