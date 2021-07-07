//import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private igChangeSub: Subscription; //storing subscription to unsubcribe later

  constructor(
    //private slService: ShoppingListService, 
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState> //injection store to access application state
  ) { }

  ngOnInit(){
    //accessing ingredients stored in the store
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {this.ingredients = ingredients}
    //);
    //injecting logging service here
    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  //this method allows us to edit the items in the shopping list
  onEditItem(index: number){
    //this.slService.startedEditing.next(index);

    //dispatching the edit action
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void{
    //this.igChangeSub.unsubscribe();
  }

}
