import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    //retrieving id to edit recipes
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //checks if id is there or undefined, if it isnt null then params is in editMode
        //if id is null then we are in newMode
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  onSubmit(){
    //the variables whenever a new recipe is made
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);

    //if in edit mode call the updaterecipe if not then addrecipe
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  //adding new control to the array of for controls
  onAddIngredient(){
    //casting the variables to FormArray so angular knows the controls is an array
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  //deleting an ingredient from the array for a specific recipe
  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index); //can also replace removeAt() with clear()
  }

  onCancel(){
    //when clicking the cancel button, navigate away from that recipes page
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  //responsible for initializing the form
  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]); 

    //storing recipe id in recipeName if it is in editMode by reaching out to the recipe service
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      
      //now to check if the recipe that's loaded has ingredients
      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      //registering controls here using key value pairs
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

}
