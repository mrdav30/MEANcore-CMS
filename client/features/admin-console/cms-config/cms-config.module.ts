import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '@utils';

import { CMSConfigComponent } from './cms-config.component';

import { CMSConfigService } from '../services/cms-config.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule
    ],
    exports: [
        CMSConfigComponent
    ],
    declarations: [
        CMSConfigComponent
    ],
    providers: [
        CMSConfigService
    ]
})

export class CMSConfigModule { }
