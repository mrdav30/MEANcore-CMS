import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FileUploadModule } from 'ng2-file-upload';

import { UtilsModule, CanDeactivateGuard } from '@utils';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { PostsListComponent } from './posts-list.component';
import { PostsFormComponent } from './posts-form.component';

import { AdminGridModule } from '../grid-utils/grid.module';

import { PostsService } from '../services/posts.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        FileUploadModule,
        CKEditorModule,
        AdminGridModule,
        UtilsModule,
        NgbDatepickerModule
    ],
    exports: [
        PostsListComponent
    ],
    declarations: [
        PostsListComponent,
        PostsFormComponent
    ],
    providers: [
        PostsService,
        CanDeactivateGuard
    ]
})

export class AdminPostsModule { }
