/* import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>(); //changing emitter to subject
    startedEditing = new Subject<number>();//connecting this to shopping list comp
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients(){
        return this.ingredients.slice();
    }

    //method to get the ingredient needed to load
    getIngredient(index: number){
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients); // the ... allows the push function to pass an array
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient){
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number){
        this.ingredients.splice(index, 1); //splice starts at an index point and removes 1 element
        this.ingredientsChanged.next(this.ingredients.slice());
    }
} */