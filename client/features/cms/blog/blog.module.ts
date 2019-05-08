import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule, CachedDataService } from '../../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { BlogComponent } from './blog.component';
import { BlogAboutModule } from './about/about.module';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { BlogPostDetailsModule } from './post-details/post-details.module';
import { BlogFooterModule } from './blog-footer/blog-footer.module';
import { BlogContactModule } from './contact/contact.module';
import { BlogSubscribeModule } from './subscribe/subscribe.module';
import { BlogPageDetailsModule } from './pages/page-details.module';

import { BlogService } from './services/blog.service';
import { BlogFooterService } from './services/blog-footer.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        NgbTooltipModule,
        BlogPostsModule,
        BlogPostDetailsModule,
        BlogFooterModule,
        BlogContactModule,
        BlogSubscribeModule,
        BlogAboutModule,
        BlogPageDetailsModule
    ],
    declarations: [
        BlogComponent
    ],
    providers: [
        BlogService,
        BlogFooterService,
        CachedDataService
    ]
})

export class BlogModule { }
