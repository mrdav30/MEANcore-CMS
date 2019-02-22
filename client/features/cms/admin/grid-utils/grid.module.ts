import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { ActionButtonComponent } from '../grid-utils/action-button.component';
import { PublishRendererComponent } from '../grid-utils/publish-render.component';
import { UnsubscribeButtonComponent } from '../grid-utils/unsubscribe-button.component';

@NgModule({
    imports: [
        CommonModule,
        AgGridModule.withComponents([ActionButtonComponent, PublishRendererComponent, UnsubscribeButtonComponent])
    ],
    exports: [
        AgGridModule,
        ActionButtonComponent,
        PublishRendererComponent,
        UnsubscribeButtonComponent
    ],
    declarations: [
        ActionButtonComponent,
        PublishRendererComponent,
        UnsubscribeButtonComponent
    ]
})

export class AdminGridModule { }
