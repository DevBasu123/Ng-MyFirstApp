import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";

import { User } from "./user.model";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;   // Optional, required for login, not for signup.
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    // private appAPIKEY = 'AIzaSyDoKH43F367SU-C5i6eVsJex-kOBuYhurg';
    private appAPIKEY = 'AIzaSyBaIRn3qPjpcmPI02rD_9YY8jkrvMu5_EU';
    private signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.appAPIKEY;
    private loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.appAPIKEY;

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.signUpUrl, 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError), 
            tap(resData => {this.handleAuthentication(
                                            resData.email,
                                            resData.localId,
                                            resData.idToken,
                                            Number(resData.expiresIn)
                                        )
                           }
            )
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.loginUrl, 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap( resData => { this.handleAuthentication(
                                                            resData.email, 
                                                            resData.localId, 
                                                            resData.idToken, 
                                                            Number(resData.expiresIn)
                                                        ) 
                            } 
            )
        );
    }

    autoLogin() {
        const userData: {
            email: string, 
            id: string,
            _token: string,
            _tokenExpirationDate: string

        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData) {
            return
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if(loadedUser.getToken()) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['./auth']);
        localStorage.removeItem('userData');

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {this.logout();}, expirationDuration);
        // this.tokenExpirationTimer = setTimeout(() => {this.logout();}, 2000);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const tokenExpirationDate = new Date(new Date().getTime() + (expiresIn *1000));
        const user = new User(email, userId, token, tokenExpirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = "An Unknown Error Occured!";
        if( !errorRes.error || !errorRes.error.error ) {
           return throwError(errorMessage); 
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = "Email already exists.";
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = "Email does not exist.";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "Incorrect Credentials.";
                break;
            }
        return throwError(errorMessage);

    }
}