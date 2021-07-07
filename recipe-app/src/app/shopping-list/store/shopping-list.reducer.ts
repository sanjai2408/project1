import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from "../../shared/ingredient.model";

//state for this reducer
export interface State{
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions){
    //have to find out what kind of action is being dispatched to know how to edit the state
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            //returning the changed state
            return {
                //copying old state
                ...state,
                //overwriting ingredients
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            //copying the existing ingredient and replacing it with the updated one in the ingredients array
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            //replacing the existing element at the index with a new element which is the copied updated Ingredient
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                //filter gives a new array, automatically gives a copy, and it removes ingredient if its false
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    //filtering to see if we want to keep the ingredient in that array or not
                    return igIndex !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default: 
            return state;
    }
}