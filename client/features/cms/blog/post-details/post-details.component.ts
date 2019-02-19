import { Component, OnInit, ViewEncapsulation, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as hljs from 'highlightjs';

import { environment } from '../../../../environments/environment';

import { BlogService } from '../services/blog.service';
import { PostDetails } from './post-details';
import { SeoService, ScriptInjectorService } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'post-details-selector',
    templateUrl: `./post-details.component.html`,
    styleUrls: [`./post-details.component.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostDetailsComponent implements OnInit, AfterViewChecked {
    public disqusShortname: string;
    public postParams: any;
    public vm: any = {};
    public isLoaded: boolean = false;
    public isDomFormatted: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private seoService: SeoService,
        private scriptInjectorService: ScriptInjectorService,
        private ref: ChangeDetectorRef,
        private blogService: BlogService
    ) { }

    ngOnInit(): void {
        this.vm.post = new PostDetails();
        this.disqusShortname = environment.disqusShortname;
        this.route.params
            .subscribe(params => {
                this.postParams = {
                    year: params['year'] ? params['year'] : null,
                    month: params['month'] ? params['month'] : null,
                    day: params['day'] ? params['day'] : null,
                    slug: params['slug'] ? params['slug'] : null
                };

                this.blogService.GetPost(this.postParams)
                    .subscribe((data: any) => {
                        if (data && data.vm) {
                            this.vm = data.vm;
                            //prevent angular from stripping out oembed content
                            this.vm.post.body = this.sanitizer.bypassSecurityTrustHtml(this.vm.post.body);
                            this.seoService.generateTags({
                                title: this.vm.metaTitle,
                                description: this.vm.metaDescription,
                                author: this.vm.post.author.authorName,
                                keywords: _.map(this.vm.post.tags).join(', '),
                                url: this.vm.post.perma_link,
                                image: this.vm.post.thumbnailUrl
                            });
                            this.scriptInjectorService.load('embedly').then(data => {
                                this.isLoaded = true;
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
    ngAfterViewChecked() {
        if (this.isLoaded && !this.isDomFormatted) {

            document.querySelectorAll('pre').forEach((block) => {
                hljs.highlightBlock(block);
            });
            document.querySelectorAll('oembed[url]').forEach(element => {
                // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
                // to discover the media.
                const anchor = document.createElement('a');

                anchor.setAttribute('href', element.getAttribute('url'));
                anchor.className = 'embedly-card';

                element.appendChild(anchor);
            });
            this.isDomFormatted = true;
            this.ref.detectChanges();
        }
    }
}
