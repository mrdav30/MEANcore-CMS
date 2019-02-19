import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { HandleErrorService } from '../../../utils';

@Injectable()
export class SubscribeService {

    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    SendConfirmation(subscriberEmail: string): Observable<{}> {
        return this.http.post(environment.appBase + 'api/subscribe/send_confirmation', { email: subscriberEmail })
            .pipe(
                catchError(this.handleErrorService.handleError<any>('SubscribeConfirm'))
            );
    }

    SendValidation(confirmationToken: string): Observable<{}> {
        return this.http.post(environment.appBase + 'api/subscribe/send_validation', { token: confirmationToken })
            .pipe(
                catchError(this.handleErrorService.handleError<any>('SubscribeValidate'))
            );
    }

    Unsubscribe(subscriberEmail: string): Observable<{}> {
        return this.http.delete(environment.appBase + 'api/unsubscribe/' + subscriberEmail)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('Unsubscribe'))
            );
    }
}
