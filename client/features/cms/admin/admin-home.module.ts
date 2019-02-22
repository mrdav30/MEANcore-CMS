import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../utils';

import { AdminHomeComponent } from './admin-home.component';

import { AdminPagesModule } from './pages/pages.module';
import { AdminPostsModule } from './posts/posts.module';
import { AdminRedirectsModule } from './redirects/redirects.module';
import { AdminSubscribersModule } from './subscribers/subscribers.module';
import { AdminAccountModule } from './account/account.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        AdminPagesModule,
        AdminPostsModule,
        AdminRedirectsModule,
        AdminSubscribersModule,
        AdminAccountModule
    ],
    declarations: [
        AdminHomeComponent
    ]
})

export class AdminHomeModule { }
