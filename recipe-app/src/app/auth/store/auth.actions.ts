import { Action } from "@ngrx/store";

//identifiers for actions
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';

//descrbing the action
export class Login implements Action{
    readonly type = LOGIN;

    constructor(
        //attaching these four pieces of info as the payload and create user in reducer
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date;
        }
    ){}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action{
    readonly type = LOGIN_START;

    constructor(public payload: {email: string; password: string}){}
}

export class LoginFail implements Action{
    readonly type = LOGIN_FAIL;

    //for error message
    constructor(public payload: string){}
}

export type AuthActions = Login | Logout | LoginStart | LoginFail;