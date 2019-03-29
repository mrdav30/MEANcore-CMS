import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GravatarModule } from 'ngx-gravatar';

import { UtilsModule } from '../../../utils';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { BlogMainComponent } from './blog-main.component';

import { BlogService } from '../services/blog.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        GravatarModule,
        UtilsModule,
        NgbPaginationModule,
        NgbTooltipModule
    ],
    declarations: [
        BlogMainComponent
    ],
    providers: [
        BlogService
    ]
})

export class BlogMainModule { }
