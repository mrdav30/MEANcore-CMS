import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as CustomEditor from '../_content/ckeditor-custom/ckeditor';
import * as _ from 'lodash';
import * as moment from 'moment';

import { environment } from '../../../../environments/environment';

import { PostsService } from '../services/posts.service';
import { Post } from './post';

import { UploadAdapterService } from '../services/upload-adapter.service';
import { SlugifyPipe } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-posts-form-selector',
    templateUrl: `./posts-form.component.html`,
    styleUrls: [`./posts-form.component.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsFormComponent implements OnInit {
    public editor = CustomEditor;
    public editorOptions: any;
    public postID: string;
    public post: Post;
    public currentDateObj: any = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private postsService: PostsService
    ) {
        // set options for ckeditor
        this.editorOptions = {
            simpleUpload: {
                uploadUrl: environment.appBaseUrl + environment.apiBaseUrl + environment.imageUploadUrl
            },
            extraPlugins: [this.getUploadAdapterPlugin],
            allowedContent: true
        };
    }

    ngOnInit(): void {
        this.titleService.setTitle('Posts | The MEANcore Blog');
        this.post = new Post();
        this.route.params
            .subscribe(params => {
                this.postID = params.id ? params.id : null;

                if (this.postID) {
                    this.postsService.GetById(this.postID)
                        .subscribe((data: any) => {
                            if (data && data.post) {
                                this.post = _.merge(this.post, data.post) as Post;
                                this.setDate();
                            }
                        }, (error) => {
                            alert('Error loading post');
                            this.router.navigate(['/admin']);
                        });
                } else {
                    this.setDate();
                }
            });
    }

    getUploadAdapterPlugin(editor: any) {
        const url = editor.config.get('simpleUpload.uploadUrl');

        if (!url) {
            console.warn('simpleUpload.uploadUrl is not configured');
            return;
        }

        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadAdapterService(loader, url, editor.t);
        };
    }

    // format date for ngb datepicker
    setDate(): void {
        const savedDate = moment(this.post.publishDate);

        this.currentDateObj = {
            day: savedDate.date(),
            month: savedDate.month() + 1,
            year: savedDate.year()
        };
    }

    // format date for server
    onDateSelect(event: any): void {
        this.post.publishDate = moment(new Date(event.year, event.month - 1, event.day)).format('YYYY-MM-DD');
    }

    slugifyTitle(): void {
        const slugifyPipe = new SlugifyPipe();
        this.post.slug = slugifyPipe.transform(this.post.title);
    }

    onSubmit(): void {
        this.post.url = '/blog/post/' + moment(this.post.publishDate).format('YYYY/MM/DD') + '/' + this.post.slug;
        this.postsService.Save(this.post)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }

    deletePost(): void {
        this.postsService.Delete(this.postID)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }
}
