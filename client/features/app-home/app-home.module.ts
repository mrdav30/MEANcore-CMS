import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbTooltipModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { UtilsModule } from '@utils';

import { AppHomeComponent } from './app-home.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbTooltipModule,
    NgbCarouselModule,
    UtilsModule
  ],
  declarations: [
    AppHomeComponent
  ]
})

export class AppHomeModule {}
