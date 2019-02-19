import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';

import { BlogFooterComponent } from './blog-footer.component';

import { BlogFooterService } from '../services/blog-footer.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule
    ],
    declarations: [
        BlogFooterComponent
    ],
    providers: [
        BlogFooterService
    ]
})

export class BlogFooterModule { }
