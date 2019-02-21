import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { BlogService } from './services/blog.service';
import { SeoService, AuthService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'home-blog-selector',
    templateUrl: `./blog-home.component.html`,
    styleUrls: [`./blog-home.component.css`]
})

export class BlogHomeComponent implements OnInit {
    public vm: any = {};
    public isLoaded = false;
    public isDomFormatted = false;

    constructor(
        private seoService: SeoService,
        private blogService: BlogService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.vm.isLoggedIn = this.authService.user ? true : false;
        // home page doesn't require pagination
        this.blogService.GetAll('Home', null)
            .subscribe((data: any) => {
                if (data && data.vm) {
                    this.vm = data.vm;
                    this.seoService.generateTags({
                        title: this.vm.metaTitle
                    });
                    this.isLoaded = true;
                    this.isDomFormatted = true;
                }
            });
    }
}
