import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GravatarModule } from 'ngx-gravatar';

import { UtilsModule } from '@utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PostDetailsComponent } from './post-details.component';
import { DisqusThreadComponent } from './disqus-thread/disqus-thread.component';

import { BlogService } from '../services/blog.service';

import { disqusWindowProvider } from './disqus-thread/disqus-window';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        GravatarModule,
        UtilsModule,
        NgbTooltipModule
    ],
    declarations: [
        PostDetailsComponent,
        DisqusThreadComponent
    ],
    providers: [
        BlogService,
        disqusWindowProvider
    ]
})

export class BlogPostDetailsModule { }
