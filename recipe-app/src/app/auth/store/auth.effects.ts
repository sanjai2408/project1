import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';

export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
//Actions is one big observable that gives access to all dispatched actions
export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        //ofType is used to filter for which effects you want to continue in this pipe observable
        
        //only continue in this observable chain if the action we're reacting to is login start
        ofType(AuthActions.LOGIN_START),
        //creating a new observable by taking another observable's data
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(resData => {
                    //return login action
                    const expirationDate = new Date(
                        new Date().getTime() + +resData.expiresIn * 1000
                    );
                    return new AuthActions.Login({
                        email: resData.email,
                        userId: resData.localId,
                        token: resData.idToken,
                        expirationDate: expirationDate
                    });
                }),
                catchError(errorResp => {
                //error handling code
                let errorMessage = 'An unknown error occurred!';
                if(!errorResp.error || !errorResp.error.error){
                    return of(new AuthActions.LoginFail(errorMessage));
                }
                switch(errorResp.error.error.message){
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email already exists';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = 'This email or password does not exist';
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = "This email or password does not exist";
                        break;
                }
                //have to return a non-error observable
                return of(new AuthActions.LoginFail(errorMessage));
            }));
        })
    );    

    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN), 
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    constructor(
        private actions$: Actions, 
        private http: HttpClient,
        private router: Router
    ) {}
}