// this service is used to pass retrieved values between different components
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';

import { HandleErrorService, CachedDataService } from '../../../utils';

export interface PostsByYear { months: PostsByMonth[]; value: string; }
export interface PostsByMonth { name: string; postCount: number; value: string; }
export class BlogFooter {
    tags?: string[];
    years?: PostsByYear[];
}

@Injectable()
export class BlogFooterService {
    public blogFooter$ = new BehaviorSubject<any>({});
    public isReady = false;
    private blogFooter: BlogFooter = new BlogFooter();

    constructor(
        private cachedDataService: CachedDataService,
        private handleErrorService: HandleErrorService
    ) {
        this.refresh();
    }

    public setViewModel(vm: any): void {
        this.blogFooter =  vm;
        this.isReady = true;
        this.blogFooter$.next(this.blogFooter);
    }

    public refresh() {
        this.cachedDataService.getData(environment.appBaseUrl + environment.apiBaseUrl + '/blog/sharedData')
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogFooterRefresh'))
            )
            .subscribe((data) => {
                if (data && data.vm) {
                    this.setViewModel(data.vm);
                }
            });
    }
}
