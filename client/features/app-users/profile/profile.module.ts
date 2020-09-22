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
  CKEditorModule
} from '@ckeditor/ckeditor5-angular';
import {
  GravatarModule
} from 'ngx-gravatar';

import {
  UtilsModule,
  ProfileService
} from '@utils';
import {
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  ProfileFormComponent
} from './profile-form.component';

import {
    MarketingModule
} from '../../../base.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    GravatarModule,
    NgbTooltipModule,
    UtilsModule,
    MarketingModule
  ],
  exports: [
    ProfileFormComponent
  ],
  declarations: [
    ProfileFormComponent
  ],
  providers: [
    ProfileService
  ]
})

export class ProfileModule {}
