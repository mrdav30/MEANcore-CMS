import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as CustomEditor from '../_content/ckeditor-custom/ckeditor';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';

import { PagesService } from '../services/pages.service';
import { Page } from './page';

import { UploadAdapterService } from '../services/upload-adapter.service';
import { SlugifyPipe } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-pages-form-selector',
    templateUrl: `./pages-form.component.html`
})

export class PagesFormComponent implements OnInit {
    public editor = CustomEditor;
    public editorOptions: any;
    public pageID: string;
    public page: Page;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private pagesService: PagesService
    ) {
        // set options for ckeditor
        this.editorOptions = {
            simpleUpload: {
                uploadUrl: environment.appBaseUrl + 'api/admin/upload'
            },
            extraPlugins: [this.getUploadAdapterPlugin],
            allowedContent: true
        };
    }

    ngOnInit(): void {
        this.titleService.setTitle('Pages | The MEANcore Blog');
        this.page = new Page();
        this.route.params
            .subscribe(params => {
                this.pageID = params.id ? params.id : null;

                if (this.pageID) {
                    this.pagesService.GetById(this.pageID)
                        .subscribe((data: any) => {
                            if (data && data.page) {
                                this.page = _.merge(this.page, data.page) as Page;
                            }
                        });
                }
            }, (error) => {
                alert('Error loading page');
                this.router.navigate(['/admin']);
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

    slugifyTitle(): void {
        const slugifyPipe = new SlugifyPipe();
        this.page.slug = slugifyPipe.transform(this.page.title);
    }

    onSubmit(): void {
        this.pagesService.Save(this.page)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }

    deletePage(): void {
        this.pagesService.Delete(this.pageID)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }
}
