import * as ShoppingListActions  from './../shopping-list/store/shopping-list.actions';
//import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';


@Injectable()
export class RecipeService {
    //making this variables an array of recipes
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Steak and potatoes', 
    //         'A simple test', 
    //         'https://therecipecritic.com/wp-content/uploads/2017/10/skilletgarlicbutterherbsteakpotatoes-1-of-1.jpg',
    //         [
    //             new Ingredient('steak', 1),
    //             new Ingredient('potatoes', 20)
    //         ]),
    //     new Recipe(
    //         'Hotdog', 
    //         'Another test', 
    //         'https://facesmag.ca/wp-content/uploads/2020/08/hotdog.jpg',
    //         [
    //             new Ingredient('ouu Bunsss', 2),
    //             new Ingredient('Meat', 3),
    //             new Ingredient('Hotdogg', 2)
    //         ])
    // ];

    private recipes: Recipe[] = [];

    constructor(
        //private slService: ShoppingListService, 
        private store: Store<fromApp.AppState>
    ){}

    //calling method to overwrite recipes array
    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        //to inform the app that we got new recipes
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientToSl(ingredients: Ingredient[]){
        //this.slService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    //adding a new recipe to the recipe array
    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    //updating a recipe by using the index and assigning it as the new replacement recipe
    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}