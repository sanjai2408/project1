import { Store } from '@ngrx/store';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

//creating an interceptor to store users in storage service
@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}

    //used to edit a request
    intercept(req: HttpRequest<any>, next: HttpHandler){
         //authenticating user, after taking one user it must unsubscribe
         return this.store.select('auth').pipe(
             take(1),
             //auth in the pipe allows angular to know what kind of data (authState) is accessing the user and turning it into an observable
             map(authState => {
                 return authState.user;
             }), 
             //takes the user inside of the map observable
             exhaustMap(user => {
                if(!user){
                    return next.handle(req); //if no user dont modify any requests and return the next handle
             }
            //cloning the request and update it
            const modifiedReq = req.clone({
                params: new HttpParams().set('auth', user.token)
            });
            return next.handle(modifiedReq);
         }));
    }

}