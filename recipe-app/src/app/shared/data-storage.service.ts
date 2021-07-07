import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService{

    //injecting HttpCLient in this service to send requests
    constructor(private http: HttpClient,
                private recipesService: RecipeService,
                private authService: AuthService){}
    
    //injected the recipes service to get access the list of recipes
    storedRecipes(){
        const recipes = this.recipesService.getRecipes();
        //Send http request
        this.http.put(
            'https://recipe-book-db080-default-rtdb.firebaseio.com/recipes.json', 
            recipes
        ).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes(){
        //Send http reuest, make it a recipe array 
        return this.http.get<Recipe[]>(
            'https://recipe-book-db080-default-rtdb.firebaseio.com/recipes.json',
        ).pipe(
            map(recipes => {
                //first map is a rxjs operator second one is a javascript array method
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }),
            //tap allows us to excute code here without altering data that is funneled through that observable
            tap(recipes => {
                this.recipesService.setRecipes(recipes);
            })
        );
        
        
    }
}