import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env';

import { HandleErrorService } from '@utils';

@Injectable()
export class SubscribeService {

    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    GetSubscriber(subscriberEmail: string): Observable<{}>{
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/admin/subscriber/' + subscriberEmail )
        .pipe(
            catchError(this.handleErrorService.handleError<any>('GetSubscriber'))
        );
    }

    SendConfirmation(subscriberEmail: string): Observable<{}> {
        return this.http.post(environment.appBaseUrl + environment.apiBaseUrl + '/subscribe/send_confirmation', { email: subscriberEmail })
            .pipe(
                catchError(this.handleErrorService.handleError<any>('SubscribeConfirm'))
            );
    }

    SendValidation(confirmationToken: string): Observable<{}> {
        return this.http.post(environment.appBaseUrl + environment.apiBaseUrl + '/subscribe/send_validation', { token: confirmationToken })
            .pipe(
                catchError(this.handleErrorService.handleError<any>('SubscribeValidate'))
            );
    }

    Unsubscribe(subscriberEmail: string): Observable<{}> {
        return this.http.delete(environment.appBaseUrl + environment.apiBaseUrl + '/unsubscribe/' + subscriberEmail)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('Unsubscribe'))
            );
    }
}
