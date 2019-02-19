import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { HandleErrorService } from '../../../utils';

@Injectable()
export class BlogService {
    public defaultPageSize: number = 10;

    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    GetAll(view: string, pageNumber: number): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/posts/' + view +
            '?page_size=' + this.defaultPageSize + "&page_number=" + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('AllBlogPosts'))
            );
    }

    GetByTag(tag: string, pageNumber: number): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/posts/tag/' + tag +
            '?page_size=' + this.defaultPageSize + "&page_number=" + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogPostsByTag'))
            );
    }

    GetByMonth(year: string, month: string, pageNumber: number): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/posts/date/' + year + '/' + month +
            '?page_size=' + this.defaultPageSize + "&page_number=" + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogPostsByMonth'))
            );
    }

    GetByAuthor(author_id: string, pageNumber: number): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/posts/author/' + author_id +
            '?page_size=' + this.defaultPageSize + "&page_number=" + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogPostsByAuthor'))
            );
    }

    SearchByQuery(searchQuery: string, pageNumber: number): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/posts/search/' + searchQuery +
            '?page_size=' + this.defaultPageSize + "&page_number=" + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogPostsByAuthor'))
            );
    }

    GetPost(postParams: any): Observable<{}> {
        return this.http.get(environment.appBase + 'api/blog/post/details/' + postParams.year + '/' + postParams.month
            + '/' + postParams.day + '/' + postParams.slug)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('BlogPostDetails'))
            );
    }
}
