import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscribeComponent } from './subscribe.component';
import { SubscribeValidationComponent } from './subscribe-validation.component';
import { UnsubscribeComponent } from './unsubscribe.component';

import { SubscribeService } from '../services/subscribe.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        NgbCollapseModule
    ],
    declarations: [
        SubscribeComponent,
        SubscribeValidationComponent,
        UnsubscribeComponent
    ],
    providers: [
        SubscribeService
    ]
})

export class BlogSubscribeModule { }
