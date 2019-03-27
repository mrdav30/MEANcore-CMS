import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule, CachedDataService } from '../../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { BlogHomeComponent } from './blog-home.component';
import { BlogAboutModule } from './about/about.module';
import { BlogMainModule } from './blog-main/blog-main.module';
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
        BlogMainModule,
        BlogPostDetailsModule,
        BlogFooterModule,
        BlogContactModule,
        BlogSubscribeModule,
        BlogAboutModule,
        BlogPageDetailsModule
    ],
    declarations: [
        BlogHomeComponent
    ],
    providers: [
        BlogService,
        BlogFooterService,
        CachedDataService
    ]
})

export class BlogHomeModule { }
