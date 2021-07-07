import { RouterModule } from '@angular/router';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { NgModule } from "@angular/core";
import { ShoppingListComponent } from './shopping-list.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoggingService } from '../logging.service';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        FormsModule,
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent }
        ]),
        SharedModule
    ],
    //lazy loading logging service
    //providers: [LoggingService]
})
export class ShoppingListModule{

}