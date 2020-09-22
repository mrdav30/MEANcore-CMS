import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env';

import { HandleErrorService } from '@utils';

@Injectable()
export class PageService {
    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    GetPage(pageSlug: string): Promise<any> {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/page/' + pageSlug)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('PageDetails'))
            )
            .toPromise();
    }
}
