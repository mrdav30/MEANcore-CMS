import { Component, OnInit } from '@angular/core';

import { BlogService } from './services/blog.service';
import { SeoService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-home-blog-selector',
    templateUrl: `./blog-home.component.html`,
    styleUrls: [`./blog-home.component.css`]
})

export class BlogHomeComponent implements OnInit {
    public vm: any = {};

    constructor(
        private seoService: SeoService,
        private blogService: BlogService
    ) { }

    ngOnInit(): void {
        // home page doesn't require pagination
        this.blogService.GetAll('Home', null)
            .subscribe((data: any) => {
                if (data && data.vm) {
                    this.vm = data.vm;
                    this.seoService.generateTags({
                        title: this.vm.metaTitle,
                        description: this.vm.metaDescription,
                        type: 'website',
                        image: this.vm.metaImage || ''
                    });
                }
            });
    }
}
