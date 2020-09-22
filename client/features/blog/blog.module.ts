import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule, CachedDataService } from '@utils';
import { NgbTooltipModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { BlogComponent } from './blog.component';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { BlogPostDetailsModule } from './post-details/post-details.module';
import { BlogPageDetailsModule } from './pages/page-details.module';
import { BlogService } from './services/blog.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        NgbTooltipModule,
        NgbCarouselModule,
        BlogPostsModule,
        BlogPostDetailsModule,
        BlogPageDetailsModule
    ],
    declarations: [
        BlogComponent
    ],
    providers: [
        BlogService,
        CachedDataService
    ]
})

export class BlogModule { }
