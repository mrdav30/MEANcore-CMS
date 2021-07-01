import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { forEach } from 'lodash';
import hljs from 'highlight.js';

import { environment } from '@env';

import { PageService } from '../services/page.service';
import { PageDetails } from './page-details';
import { SeoService, ScriptInjectorService } from '@utils';

@Component({
    moduleId: module.id,
    selector: 'app-page-details-selector',
    templateUrl: `./page-details.component.html`,
    styleUrls: [
        `./page-details.component.css`
    ],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PageDetailsComponent implements OnInit, AfterViewChecked {
    public disqusShortname = environment.appName;
    public pageSlug: string;
    public vm: any = {};
    public domLoaded = false;
    public domFormatted = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private seoService: SeoService,
        private scriptInjectorService: ScriptInjectorService,
        private ref: ChangeDetectorRef,
        private pageService: PageService
    ) { }

    ngOnInit(): void {
        this.vm.page = new PageDetails();
        this.route.params
            .subscribe(params => {
                this.pageSlug = params.slug ? params.slug : null;

                this.pageService.GetPage(this.pageSlug)
                    .then((data: any) => {
                        if (data && data.vm) {
                            this.vm = data.vm;
                            // prevent angular from stripping out oembed content
                            this.vm.page.body = this.sanitizer.bypassSecurityTrustHtml(this.vm.page.body);
                            this.seoService.generateTags({
                                title: this.vm.metaTitle,
                                description: this.vm.metaDescription
                            });
                        }
                    }, (error) => {
                        alert('Error loading post');
                        this.router.navigate(['/blog']);
                    })
                    .then(() => {
                        this.scriptInjectorService.load('embedly')
                            .then(() => {
                                this.domLoaded = true;
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });
            });
    }

    // not elegant, but need to ensure DOM is loaded before applying hljs formatting
    ngAfterViewChecked(): void {
        if (this.domLoaded && !this.domFormatted) {
            forEach(document.querySelectorAll('pre'), (block) => {
                hljs.highlightElement(block);
            });

            forEach(document.querySelectorAll('oembed[url]'), (element) => {
                // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
                // to discover the media.
                const anchor = document.createElement('a');

                anchor.setAttribute('href', element.getAttribute('url'));
                anchor.className = 'embedly-card';

                element.appendChild(anchor);
            });

            this.domFormatted = true;
            this.ref.detectChanges();
        }
    }
}
