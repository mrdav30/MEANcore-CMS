import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from '../features/page-not-found/page-not-found.component';

import { AppMenuModule } from '../features/app-menu/app-menu.module';
import { UtilsModule } from '../features/utils';
import { SignInModule } from '../features/users/sign-in/sign-in.module';
import { RecoverPasswordModule } from '../features/users/password/recover/recover-password.module';
import { ResetPasswordModule } from '../features/users/password/reset/reset-password.module';
import { SignUpModule } from '../features/users/sign-up/sign-up.module';

import { CMSModule } from '../features/cms/cms.module';

import { AuthGuard } from '../features/utils';
import { AuthService } from '../features/utils';
import { LoadingInterceptor } from '../features/utils';
import { LoadingService } from '../features/utils';
import { MessagingInterceptor } from '../features/utils';
import { MessagingService } from '../features/utils';
import { ScriptInjectorService } from '../features/utils';
import { SeoService } from '../features/utils';

@NgModule({
  declarations: [
    AppComponent,
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
    AppMenuModule,
    CMSModule
  ],
  providers: [
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
