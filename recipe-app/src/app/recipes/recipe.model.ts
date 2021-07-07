import { Ingredient } from 'src/app/shared/ingredient.model';
export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];

    constructor(name: string, description: string, imapgePath: string, ingredients: Ingredient[]){
        this.name = name;
        this.description = description;
        this.imagePath = imapgePath;
        this.ingredients = ingredients;
    }
}