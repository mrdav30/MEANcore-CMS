import {
    Injectable
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';
import {
    catchError
} from 'rxjs/operators';

import {
    environment
} from '@env';

import {
    HandleErrorService
} from '@utils';

@Injectable()
export class BlogService {
    public defaultPageSize = 10;

    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) {}

    getAll(view: string, pageNumber: number): Observable < {} > {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/posts/' + view +
                '?page_size=' + this.defaultPageSize + '&page_number=' + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('AllBlogPosts'))
            );
    }

    getByTag(tag: string, pageNumber: number): Observable < {} > {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/posts/tag/' + tag +
                '?page_size=' + this.defaultPageSize + '&page_number=' + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('BlogPostsByTag'))
            );
    }

    getByMonth(year: string, month: string, pageNumber: number): Observable < {} > {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/posts/date/' + year + '/' + month +
                '?page_size=' + this.defaultPageSize + '&page_number=' + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('BlogPostsByMonth'))
            );
    }

    getByAuthor(authorID: string, pageNumber: number): Observable < {} > {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/posts/author/' + authorID +
                '?page_size=' + this.defaultPageSize + '&page_number=' + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('BlogPostsByAuthor'))
            );
    }

    searchByQuery(searchQuery: string, pageNumber: number): Observable < {} > {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/blog/posts/search/' + searchQuery +
                '?page_size=' + this.defaultPageSize + '&page_number=' + pageNumber)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('BlogPostsByAuthor'))
            );
    }

    getPost(postParams: any): Promise < any > {
        let postApi = environment.appBaseUrl + environment.apiBaseUrl + '/blog/post/details';
        if (postParams.year && postParams.month) {
            postApi += '/' + postParams.year + '/' + postParams.month + '/' + postParams.day;
        }
        if (postParams.slug) {
            postApi += '/' + postParams.slug;
        }

        return this.http.get(postApi)
            .pipe(
                catchError(this.handleErrorService.handleError < any > ('BlogPostDetails'))
            )
            .toPromise();
    }
}