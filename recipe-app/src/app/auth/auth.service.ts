import { Store } from '@ngrx/store';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, pipe, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

//this interface varies depending on the rest api used, this is for firebase
export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

//this service is responsible for signing users up, logging them in, and managing the users tokens
@Injectable({providedIn: 'root'})
export class AuthService{
    //BehaviorSubject same as Subject but it also gives subscribers immediate access to previously emitted value even if they haven't subscribed when the value was emitted
    //user = new BehaviorSubject<User>(null);

    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>){}

    //values and arguments, as well as post request is on the firebase docs
    signup(email: string, password: string){
        //post request has to be in the authresponsedata format
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, //environment variables helpful to swap from development to production stage
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        //this section is for error handling, subscribing to the error in the service and showing it in the componeent    
        ).pipe(catchError(this.handleError), tap(respData => {
            this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
        }));
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(respData =>{
            this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
        }));
    }

    //to retrieve and still have the data when restarting the browser
    autoLogin(){
        //retrieve user data from local storage
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        //check if userData exists
        if(!userData){
            return;
        }

        //user to interact
        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)           
        );

        //check if user has valid token
        if(loadedUser.token){
            //this.user.next(loadedUser);
            //dispatching actions in the autologin
            this.store.dispatch(new AuthActions.Login({
                email: loadedUser.email, 
                userId: loadedUser.id, 
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }));
            //auto logout if theres a timeout (current date - future date)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        //this makes the application treat the user as unauthenticated
        //this.user.next(null);
        //dispatching log out action
        this.store.dispatch(new AuthActions.Logout());
        //redirect to authentication page
        this.router.navigate(['/auth']);
        //removing user data key and data stored
        localStorage.removeItem('userData');
        //clearing the token expiration timer once we logout
        if(this.tokenTimer){
            clearTimeout(this.tokenTimer);
        }
        this.tokenTimer = null;
    }

    //logging user out once there's a timeout
    autoLogout(expirationDuration: number){
        console.log(expirationDuration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        //this.user.next(user);//emitting a new user
        //dispatching new login action
        this.store.dispatch(new AuthActions.Login({
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate
        }));
        this.autoLogout(expiresIn * 1000); //time in ms
        //allows you to write an item to local storage and store data there
        localStorage.setItem('userData', JSON.stringify(user));
    }

    //handling errors for signing up and logging in
    private handleError(errorResp: HttpErrorResponse){
        let errorMessage = 'An unknown error occurred!';
            if(!errorResp.error || !errorResp.error.error){
                return throwError(errorMessage);
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
            return throwError(errorMessage);
    }
}