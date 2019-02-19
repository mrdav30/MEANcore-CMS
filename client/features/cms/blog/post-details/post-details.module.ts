import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GravatarModule } from 'ngx-gravatar';

import { UtilsModule } from '../../../utils';

import { PostDetailsComponent } from './post-details.component';
import { DisqusThreadComponent } from './disqus-thread/disqus-thread.component';

import { BlogService } from '../services/blog.service';

import { DisqusWindowProvider } from './disqus-thread/disqus-window';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        GravatarModule,
        UtilsModule
    ],
    declarations: [
        PostDetailsComponent,
        DisqusThreadComponent
    ],
    providers: [
        BlogService,
        DisqusWindowProvider
    ]
})

export class BlogPostDetailsModule { }
