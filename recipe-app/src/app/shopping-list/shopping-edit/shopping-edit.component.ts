//import { ShoppingListService } from './../shopping-list.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm; //used to access template form using local ref f
  subscription: Subscription;
  editMode = false;
  //editedItemIndex: number; //storing index here
  editedItem: Ingredient;

  constructor(
    //private slService: ShoppingListService, 
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      //if the state data index is valid then edit
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        //reaching out to the form and create a value and load it
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });

    //subscribing to the startedEditing property
    //item being editted is based on index number
    // this.subscription = this.slService.startedEditing
    //   .subscribe(
    //     (index: number) => {
    //       this.editedItemIndex = index;
    //       this.editMode = true;
    //       this.editedItem = this.slService.getIngredient(index);
    //       //reaching out to the form and create a value and load it
    //       this.slForm.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       })
    //     }
    //   );
  }

  //connecting this to the html form to add items
  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      //if editMode is true then connect to the service and call updateIngredient
      //this.slService.updateIngredient(this.editedItemIndex, newIngredient);

      //dispatching actions for updating ingredients
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      //this.slService.addIngredient(newIngredient); 

      //dispatching actions for adding ingredients 
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false; //to get out of editmode after updating an item and allows to add item after
    form.reset();
  }

  onClear(){
    this.slForm.reset(); //using viewchild to connect to html form and reset
    this.editMode = false;

    //dispatching stop edit action
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(){
    //this.slService.deleteIngredient(this.editedItemIndex); //passing edited Item index as a value to the delete ingredient method
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe(); // done so there is no memory leak
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
