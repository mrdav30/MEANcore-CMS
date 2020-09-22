import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '@utils';

import { SubscribersListComponent } from './subscribers-list.component';

import { AdminGridModule } from '../grid-utils/grid.module';

import { SubscribersService } from '../services/subscribers.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AdminGridModule,
        UtilsModule
    ],
    exports: [
        SubscribersListComponent
    ],
    declarations: [
        SubscribersListComponent
    ],
    providers: [
        SubscribersService
    ]
})

export class AdminSubscribersModule { }
