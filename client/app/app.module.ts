import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UnauthorizedComponent } from '../features/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from '../features/page-not-found/page-not-found.component';

import { AppMenuModule } from '../features/app-menu/app-menu.module';
import { SignInModule } from '../features/users/sign-in/sign-in.module';
import { RecoverPasswordModule } from '../features/users/password/recover/recover-password.module';
import { ResetPasswordModule } from '../features/users/password/reset/reset-password.module';
import { SignUpModule } from '../features/users/sign-up/sign-up.module';
import { UserAccessControlModule } from '../features/user-access-control/uac-dashboard.module';

import { CMSModule } from '../features/cms/cms.module';

import {
  UtilsModule,
  AppLoadService,
  AuthGuard,
  AuthService,
  LoadingInterceptor,
  LoadingService,
  MessagingInterceptor,
  MessagingService,
  ScriptInjectorService,
  SeoService
} from '../features/utils';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    UtilsModule,
    SignInModule,
    RecoverPasswordModule,
    ResetPasswordModule,
    SignUpModule,
    UserAccessControlModule,
    AppMenuModule,
    CMSModule
  ],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true
    },
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessagingInterceptor,
      multi: true
    },
    LoadingService,
    MessagingService,
    ScriptInjectorService,
    SeoService,
    {
      provide: '@env',
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
