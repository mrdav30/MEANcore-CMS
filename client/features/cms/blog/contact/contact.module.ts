import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';

import { ContactComponent } from './contact.component';

import { ContactService } from '../services/contact.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule
    ],
    declarations: [
        ContactComponent
    ],
    providers: [
        ContactService
    ]
})

export class BlogContactModule { }
