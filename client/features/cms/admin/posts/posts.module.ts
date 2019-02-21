import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { GravatarModule } from 'ngx-gravatar';

import { UtilsModule, CanDeactivateGuard } from '../../../utils';

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
        GravatarModule,
        AdminGridModule,
        UtilsModule
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
