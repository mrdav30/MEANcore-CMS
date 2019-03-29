import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GravatarModule } from 'ngx-gravatar';

import { UtilsModule } from '../../../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AccountFormComponent } from './account-form.component';

import { AccountService } from '../services/account.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        CKEditorModule,
        GravatarModule,
        NgbTooltipModule,
        UtilsModule
    ],
    exports: [
        AccountFormComponent
    ],
    declarations: [
        AccountFormComponent
    ],
    providers: [
        AccountService
    ]
})

export class AdminAccountModule { }
