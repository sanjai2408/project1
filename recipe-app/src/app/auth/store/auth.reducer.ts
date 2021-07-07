import { User } from './../user.model';
import * as AuthActions  from './auth.actions';

//the reducer state
export interface State {
    user: User;
    authError: string; // for error message
    loading: boolean;
}

const initialState = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions){
    switch (action.type){
        case AuthActions.LOGIN:
            //credentials needed to successfully login
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return{
                ...state,
                authError: null, //setting authError back to null if logged in successfully
                //old user gets replaced by the new one
                user: user,
                loading: false
            };
        case AuthActions.LOGOUT:
            //setting user to null when logging out
            return{
                ...state,
                user: null
            }
        case AuthActions.LOGIN_START:
            return{
                ...state,
                authError: null,
                loading: true
            }
        case AuthActions.LOGIN_FAIL:
            return{
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }
        default:
            return state;
    }
}