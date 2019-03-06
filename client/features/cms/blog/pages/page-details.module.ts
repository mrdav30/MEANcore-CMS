import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';

import { PageDetailsComponent } from './page-details.component';

import { PageService } from '../services/page.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule
    ],
    declarations: [
        PageDetailsComponent
    ],
    providers: [
        PageService
    ]
})

export class BlogPageDetailsModule { }
