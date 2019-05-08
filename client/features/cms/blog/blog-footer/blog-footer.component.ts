import { Component, OnInit } from '@angular/core';

import { BlogFooterService } from '../services/blog-footer.service';

@Component({
    moduleId: module.id,
    selector: 'app-blog-footer-selector',
    templateUrl: `./blog-footer.component.html`,
    styleUrls: [`./blog-footer.component.css`]
})

export class BlogFooterComponent implements OnInit {
    public expandedIndex: -1;
    public years: any;
    public tags: any;

    constructor(
        public blogFooterService: BlogFooterService
    ) { }

    ngOnInit() {
        this.blogFooterService.blogFooter$.subscribe((vm: any) => {
            this.years = vm.years;
            this.tags = vm.tags;
        });
    }
}
