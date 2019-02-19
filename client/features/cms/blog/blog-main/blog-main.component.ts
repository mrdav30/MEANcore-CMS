import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { BlogService } from '../services/blog.service';
import { SeoService } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'main-blog-selector',
    templateUrl: `./blog-main.component.html`,
    styleUrls: [`./blog-main.component.css`]
})

export class BlogMainComponent implements OnInit {
    public postParams: any;
    public pageNumber: number = 1;
    public vm: any = {};
    public isLoaded: boolean = false;
    public isDomFormatted: boolean = false;

    constructor(
        private seoService: SeoService,
        private route: ActivatedRoute,
        private router: Router,
        private blogService: BlogService
    ) { }

    ngOnInit(): void {
        this.route.params
            .subscribe(params => {
                if (_.isEmpty(params)) {
                    this.postParams = null;
                } else {
                    // query based on param
                    this.postParams = {
                        tag: params['tag'] ? params['tag'] : null,
                        year: params['year'] ? params['year'] : null,
                        month: params['month'] ? params['month'] : null,
                        author_id: params['author_id'] ? params['author_id'] : null,
                        searchQuery: params['searchQuery'] ? params['searchQuery'] : null
                    };
                }
                this.retrievePosts();
            });
    }

    private retrievePosts(): void {
        if (!this.postParams) {
            // default, load all published blogs
            this.blogService.GetAll('Blog', this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                });
        } else if (this.postParams.tag) {
            this.blogService.GetByTag(this.postParams.tag, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.year && this.postParams.month) {
            this.blogService.GetByMonth(this.postParams.year, this.postParams.month, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.author_id) {
            this.blogService.GetByAuthor(this.postParams.author_id, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.searchQuery) {
            this.blogService.SearchByQuery(this.postParams.searchQuery, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        }
    }

    private processPostResults(data: any): void {
        if (data.vm && data.vm.posts) {
            this.vm = data.vm ? data.vm : {};
            this.seoService.generateTags({
                title: this.vm.metaTitle,
                description: this.vm.metaDescription ? this.vm.metaDescription : ''
            });
            this.isLoaded = true;
            this.isDomFormatted = true;
        } else {
            this.router.navigate(['/home']);
        }
    }

    private changePage(pageNumber: number): void {
        this.pageNumber = pageNumber;
        this.retrievePosts();
    }
}
