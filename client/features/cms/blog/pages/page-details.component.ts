import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { forEach } from 'lodash';
import { highlightBlock } from 'highlightjs';

import { environment } from '../../../../environments/environment';

import { PageService } from '../services/page.service';
import { PageDetails } from './page-details';
import { SeoService, ScriptInjectorService } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-page-details-selector',
    templateUrl: `./page-details.component.html`,
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PageDetailsComponent implements OnInit {
    public disqusShortname = environment.appName;
    public pageSlug: string;
    public vm: any = {};

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
                    .subscribe(async (data: any) => {
                        if (data && data.vm) {
                            this.vm = data.vm;
                            // prevent angular from stripping out oembed content
                            this.vm.page.body = this.sanitizer.bypassSecurityTrustHtml(this.vm.page.body);
                            this.seoService.generateTags({
                                title: this.vm.metaTitle,
                                description: this.vm.metaDescription
                            });
                            this.scriptInjectorService.load('embedly').then(async () => {
                                await this.formatDom();
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    }, (error) => {
                        alert('Error loading post');
                        this.router.navigate(['/blog']);
                    });
            });
    }

    // not elegant, but need to ensure DOM is loaded before applying hljs formatting
    formatDom() {
        return new Promise((resolve) => {
            forEach(document.querySelectorAll('pre'), (block) => {
                highlightBlock(block);
            });

            forEach(document.querySelectorAll('oembed[url]'), (element) => {
                // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
                // to discover the media.
                const anchor = document.createElement('a');

                anchor.setAttribute('href', element.getAttribute('url'));
                anchor.className = 'embedly-card';

                element.appendChild(anchor);
            });

            this.ref.detectChanges();

            resolve();
        });
    }
}
