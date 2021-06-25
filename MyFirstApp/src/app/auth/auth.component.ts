import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthResponseData, AuthService } from "./auth.service";

// == START =============================================================================
// import { ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
// import { Subscription } from "rxjs";
// import { AlertComponent } from "../shared/alert/alert.component";
// import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
// == END ===============================================================================

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {
// == START =============================================================================
// export class AuthComponent implements OnDestroy {
// == END ===============================================================================
isLoginMode = true;
    isLoading = false;
    error: string = null;
// == START =============================================================================
    // @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    // private closeSub: Subscription;
// == END ===============================================================================

    constructor(
        private authService: AuthService, 
        private router: Router,
// == START =============================================================================
        // private componentFactoryResolver: ComponentFactoryResolver
// == END ===============================================================================
    ) { }

    onHandleError() {
        this.error = null;
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);

        }
        else{
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(
            (resData) => {
                            this.isLoading = false;
                            this.router.navigate(['./recipes']);
                        },
            (errorMessage) => {
                            this.error = errorMessage;
// == START =============================================================================
                            // this.showErrorAlert(errorMessage);
// == END ===============================================================================
                            this.isLoading = false;
                        }
        );

        form.reset();
    }

// == START =============================================================================
    // private showErrorAlert(message: string) {
    //     const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    //     const hostViewContainerRef = this.alertHost.viewContainerRef;
    //     hostViewContainerRef.clear();

    //     const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    //     componentRef.instance.message = message;
        
    //     this.closeSub = componentRef.instance.close.subscribe(
    //         () => {
    //             this.closeSub.unsubscribe();
    //             hostViewContainerRef.clear();
    //         }
    //     );
    // }

    // ngOnDestroy () {
    //     if(this.closeSub) {
    //         this.closeSub.unsubscribe();
    //     }
    // }
// == END ===============================================================================

}