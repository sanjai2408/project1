import { Ingredient } from './../../shared/ingredient.model';
import { Action } from "@ngrx/store";

//this is the action
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

//exporting something that describes the action
export class AddIngredient implements Action{
    //readonly to make sure it never gets changed outside
    readonly type = ADD_INGREDIENT;
    
    constructor(public payload: Ingredient){}
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient){}
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
    readonly type = START_EDIT;

    //payload needed to know which ingredient is being edited
    constructor(public payload: number){}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}


//to make sure the add ingredients action case works in the reducer
//this show the different type of actions in the shopping list
export type ShoppingListActions = 
| AddIngredient 
| AddIngredients 
| UpdateIngredient 
| DeleteIngredient
| StartEdit
| StopEdit;