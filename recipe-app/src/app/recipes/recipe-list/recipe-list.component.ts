import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  
  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    //subscribing the list to the new recipeschanged event in the service
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    //navigating and targetting the new recipe button path
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
