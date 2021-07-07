import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

//application wide state, creating sub states
export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
}  

//creating the app wide store
export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer
};