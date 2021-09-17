import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    isEmpty
} from 'lodash';

import {
    BlogService
} from '../services/blog.service';
import {
    SeoService
} from '@utils';
import {
    Subscription
} from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'app-blog-posts-selector',
    templateUrl: `./blog-posts.component.html`,
    styleUrls: [`./blog-posts.component.css`]
})

export class BlogPostsComponent implements OnInit, OnDestroy {
    public postParams: any;
    public pageNumber = 1;
    public vm: any = {};

    private paramSub$: Subscription;

    constructor(
        private seoService: SeoService,
        private route: ActivatedRoute,
        private router: Router,
        private blogService: BlogService
    ) {}

    ngOnInit(): void {
        this.paramSub$ = this.route.paramMap
            .subscribe(paramMap => {
                if (isEmpty(paramMap)) {
                    this.postParams = null;
                } else {
                    // query based on param
                    this.postParams = {
                        tag: paramMap.get('tag'),
                        year: paramMap.get('year'),
                        month: paramMap.get('month'),
                        authorId: paramMap.get('authorId'),
                        searchQuery: paramMap.get('searchQuery')
                    };
                }
                this.retrievePosts();
            });
    }

    public changePage(pageNumber: number): void {
        this.pageNumber = pageNumber;
        this.retrievePosts();
        window.scrollTo(0, 0);
    }

    public onFollowAuthor(target: string) {
        let followLink: string;
        switch (target) {
            case 'facebook':
                followLink = this.vm.author.facebookUrl;
                break;
            case 'twitter':
                followLink = this.vm.author.twitterUrl;
                break;
            case 'linkedin':
                followLink = this.vm.author.linkedinUrl;
                break;
            case 'github':
                followLink = this.vm.author.githubUrl;
                break;
            case 'stackoverflow':
                followLink = this.vm.author.stackOverflowUrl;
                break;
            case 'personal':
                followLink = this.vm.author.personalUrl;
                break;
        }

        window.open(followLink, '_blank');
    }

    ngOnDestroy(): void {
        this.paramSub$.unsubscribe();
    }

    private retrievePosts(): void {
        if (!this.postParams) {
            // default, load all published blogs
            this.blogService.getAll('Blog', this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                });
        } else if (this.postParams.tag) {
            this.blogService.getByTag(this.postParams.tag, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.year && this.postParams.month) {
            this.blogService.getByMonth(this.postParams.year, this.postParams.month, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.authorId) {
            this.blogService.getByAuthor(this.postParams.authorId, this.pageNumber)
                .subscribe((data: any) => {
                    this.processPostResults(data);
                }, (error) => {
                    alert('Error loading posts');
                    this.router.navigate(['/blog']);
                });
        } else if (this.postParams.searchQuery) {
            this.blogService.searchByQuery(this.postParams.searchQuery, this.pageNumber)
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
                description: this.vm.metaDescription || '',
                type: 'website',
                image: this.vm.metaImage || ''
            });
        } else {
            this.router.navigate(['/blog']);
        }
    }
}