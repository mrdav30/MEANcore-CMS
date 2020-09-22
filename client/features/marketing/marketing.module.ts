import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  RouterModule
} from '@angular/router';

import {
  UtilsModule
} from '@utils';
import {
  NgbCollapseModule,
  NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  SubscribeComponent
} from './subscribe/subscribe.component';
import {
  SubscribeValidationComponent
} from './subscribe/subscribe-validation.component';
import {
  UnsubscribeComponent
} from './unsubscribe/unsubscribe.component';
import {
  ProfileUnsubscribeComponent
} from './unsubscribe/profile-unsubscribe.component';

import {
  SubscribeService
} from './services/subscribe.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilsModule,
    NgbCollapseModule,
    NgbModalModule
  ],
  exports: [
    ProfileUnsubscribeComponent
  ],
  declarations: [
    SubscribeComponent,
    SubscribeValidationComponent,
    ProfileUnsubscribeComponent,
    UnsubscribeComponent
  ],
  providers: [
    SubscribeService
  ]
})

export class MarketingModule {}
