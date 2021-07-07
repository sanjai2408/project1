import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    //get access to the directive used in the template (ng-template) and store it in alertHost
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;
    
    constructor(private authService: AuthService, 
                private router: Router,
                private compFactResolver: ComponentFactoryResolver,
                private store: Store<fromApp.AppState>
    ){}

    ngOnInit(){
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error){
                this.showErrorAlert(this.error);
            }
        });
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
        //validation incase form gets hacked and user is able to enter database
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true; //loading to see if credentials are right
        
        //check if it is in login mode
        if(this.isLoginMode){
            //authObs = this.authService.login(email, password)
            
            //using ngrx effects and ngrx store instead
            this.store.dispatch(
                new AuthActions.LoginStart({email: email, password: password})
            );
        } else {
            //sending the retreived email and pass to the service
            authObs = this.authService.signup(email, password)
        }


        //replacing this and putting it in ngOnInit
        //redirection done in auth effects
        // authObs.subscribe(
        //     respData => { //if authentication succeeds
        //         console.log(respData);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']); //navigates to recipe page when logged in
        //     },
        //     errorMessage => {
        //         console.log(errorMessage);
        //         this.error = errorMessage;
        //         this.showErrorAlert(errorMessage);
        //         this.isLoading = false;
        //     }
        // );

        form.reset();
    }

    //removes  condition in html file
    onHandleError(){
        this.error = null;
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }

    //programatically creating dynamic alert components (alert box)
    private showErrorAlert(message: string){
        const alertCmpFactory = this.compFactResolver.resolveComponentFactory(AlertComponent);
        //access view container ref of our host
        const hostViewContRef = this.alertHost.viewContRef;
        hostViewContRef.clear();

        //creating the component
        const componentRef = hostViewContRef.createComponent(alertCmpFactory);

        //closing component
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContRef.clear();
        });

    }

}