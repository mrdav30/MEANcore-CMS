import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '@utils';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminConsoleComponent } from './admin-console.component';

import { AdminPagesModule } from './pages/pages.module';
import { AdminPostsModule } from './posts/posts.module';
import { AdminRedirectsModule } from './redirects/redirects.module';
import { AdminSubscribersModule } from './subscribers/subscribers.module';
import { CMSConfigModule } from './cms-config/cms-config.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        NgbNavModule,
        AdminPagesModule,
        AdminPostsModule,
        AdminRedirectsModule,
        AdminSubscribersModule,
        CMSConfigModule
    ],
    declarations: [
        AdminConsoleComponent
    ]
})

export class AdminConsoleModule { }
