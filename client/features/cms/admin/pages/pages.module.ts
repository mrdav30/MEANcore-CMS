import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { UtilsModule, CanDeactivateGuard } from '../../../utils';

import { PagesListComponent } from './pages-list.component';
import { PagesFormComponent } from './pages-form.component';

import { AdminGridModule } from '../grid-utils/grid.module';

import { PagesService } from '../services/pages.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        FileUploadModule,
        CKEditorModule,
        AdminGridModule,
        UtilsModule
    ],
    exports:[
        PagesListComponent
    ],
    declarations: [
        PagesListComponent,
        PagesFormComponent
    ],
    providers: [
        PagesService,
        CanDeactivateGuard
    ]
})

export class AdminPagesModule { }
