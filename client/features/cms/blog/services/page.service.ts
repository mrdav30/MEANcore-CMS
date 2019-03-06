import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { HandleErrorService } from '../../../utils';

@Injectable()
export class PageService {
    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    GetPage(pageSlug: string): Observable<{}> {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/page/' + pageSlug)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('PageDetails'))
            );
    }
}
