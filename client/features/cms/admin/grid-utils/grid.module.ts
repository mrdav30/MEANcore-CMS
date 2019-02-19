import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { ActionButtonComponent } from '../grid-utils/action-button.component';
import { PublishRendererComponent } from '../grid-utils/publish-render.component';

@NgModule({
    imports: [
        CommonModule,
        AgGridModule.withComponents([ActionButtonComponent, PublishRendererComponent])
    ],
    exports: [
        AgGridModule,
        ActionButtonComponent,
        PublishRendererComponent
    ],
    declarations: [
        ActionButtonComponent,
        PublishRendererComponent
    ]
})

export class AdminGridModule { }
