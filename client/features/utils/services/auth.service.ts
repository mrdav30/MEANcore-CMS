import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from './handle-error.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
    public appName = environment.appName;
    public appBase = environment.appBase;
    public appEndPoint = environment.appEndPoint;
    public redirectUrl = environment.appDefaultRoute;
    public user: any;
    public userChange$: Observable<any>;
    public isLoggedIn = false;

    private signInUrl = this.appBase + this.appEndPoint + '/auth/signIn'; // URL to web API
    private recoverUrl = this.appBase + this.appEndPoint + '/auth/forgot';
    private resetUrl = this.appBase + this.appEndPoint + '/auth/reset/';
    private signOutUrl = this.appBase + this.appEndPoint + '/auth/signOut';
    private validateUrl = this.appBase + this.appEndPoint + '/auth/validate';
    private signUpUrl = this.appBase + this.appEndPoint + '/auth/signUp';
    private installUrl = this.appBase + this.appEndPoint + '/install';
    private authListener: Observer<any>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private handleErrorService: HandleErrorService
    ) {
        this.userChange$ = new Observable(observer => this.authListener = observer).pipe(
            share()
        );
        // retrieve user information from local storage
        this.user = JSON.parse(localStorage.getItem('user')) || false;
    }

    signIn(user): Observable<{}> {
        return this.http.post(this.signInUrl, user)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignIn'))
            );
    }

    valuedateUser(user): Observable<{}> {
        return this.http.post(this.validateUrl, user, httpOptions)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('ValidateUser'))
            );
    }

    signUp(user): Observable<{}> {
        return this.http.post(this.signUpUrl, user, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignUp'))
            );
    }

    install(user): Observable<{}> {
        return this.http.post(this.installUrl, user, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignUp'))
            );
    }

    forgot(user): Observable<{}> {
        return this.http.post(this.recoverUrl, user, httpOptions)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('ForgotPassword'))
            );
    }

    reset(credentials): Observable<{}> {
        return this.http.post(this.resetUrl + credentials.token, credentials, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('ResetPassword'))
            );
    }

    signOut(): void {
        this.http.get(this.signOutUrl)
            .subscribe(() => {
                this.notifyUserSubscribers(false);
                this.router.navigate(['sign-in']);
            }, () => {
                console.log('Error while logout.');
            });
    }

    notifyUserSubscribers(user: any): void {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        this.user = user;
        this.isLoggedIn = user ? true : false;
        this.authListener.next(this.user);
    }

    hasRole(role): boolean {
        // only for test since switching makes it a string
        if (!Array.isArray(this.user.roles)) {
            this.user.roles = [this.user.roles];
        }
        return this.user.roles.indexOf(role) !== -1;
    }

    hasPermission(permission): boolean {
        permission = permission.toLowerCase();
        const permissions = this.user.permission_data[this.appName];
        return !!_.find(permissions, (p) => p.name === permission);
    }

    checkPermission(permission, attributes): any {
        permission = permission.toLowerCase();
        const permissions = _.filter(this.user.permission_data[this.appName], (p) => p.name === permission);
        return _.some(permissions, (p) => {
            return _.every(Object.keys(attributes), (key) => {
                const attr = attributes[key];
                return !p.attributes || !p.attributes[key] || p.attributes[key].indexOf(attr) !== -1;
            });
        });
    }
}
