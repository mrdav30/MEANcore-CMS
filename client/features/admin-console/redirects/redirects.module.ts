import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule, CanDeactivateGuard } from '@utils';

import { RedirectsListComponent } from './redirects-list.component';
import { RedirectsFormComponent } from './redirects-form.component';

import { AdminGridModule } from '../grid-utils/grid.module';

import { RedirectsService } from '../services/redirects.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AdminGridModule,
        UtilsModule
    ],
    exports: [
        RedirectsListComponent
    ],
    declarations: [
        RedirectsListComponent,
        RedirectsFormComponent
    ],
    providers: [
        RedirectsService,
        CanDeactivateGuard
    ]
})

export class AdminRedirectsModule { }
