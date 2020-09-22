import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipRenderComponent } from './tooltip-render.component';
import { PublishRendererComponent } from './publish-render.component';
import { OptInRendererComponent } from './optin-render.component';

import { ActionButtonComponent } from './action-button.component';
import { UnsubscribeButtonComponent } from './unsubscribe-button.component';

@NgModule({
    imports: [
        CommonModule,
        NgbTooltipModule,
        AgGridModule.withComponents([
            TooltipRenderComponent,
            PublishRendererComponent,
            OptInRendererComponent,
            ActionButtonComponent,
            UnsubscribeButtonComponent
        ])
    ],
    exports: [
        AgGridModule,
        TooltipRenderComponent,
        PublishRendererComponent,
        OptInRendererComponent,
        ActionButtonComponent,
        UnsubscribeButtonComponent
    ],
    declarations: [
        TooltipRenderComponent,
        PublishRendererComponent,
        OptInRendererComponent,
        ActionButtonComponent,
        UnsubscribeButtonComponent
    ]
})

export class AdminGridModule { }
