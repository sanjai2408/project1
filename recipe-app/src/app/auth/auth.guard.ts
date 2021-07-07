import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import * as fromApp from '../store/app.reducer';

//making a guard to stop unauthenticated users form accessing recipes tab
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
        | boolean 
        | UrlTree 
        | Promise<boolean | UrlTree> 
        | Observable<boolean | UrlTree> {
        //see if user is authenticated by looking at the user behavior subject
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }), 
            map(user => {
                const isAuth = !!user;
                if(isAuth){
                    return true;
                }//if its authenticated return true if not navigate to auth page using url tree
            return this.router.createUrlTree(['/auth']);
        }));
    }

}