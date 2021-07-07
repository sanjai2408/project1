import { Recipe } from './recipe.model';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

//a resolver is code that runs before a route is loaded to ensure certain data that the route depends on is there
@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private dataStorageService: DataStorageService,
                private recipesService: RecipeService
    ){}

    //getting data about the route
    //loading the recipes
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const recipes = this.recipesService.getRecipes();

        //if there are no recipes fetch them if not just return the recipe there
        if(recipes.length === 0){
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }

}