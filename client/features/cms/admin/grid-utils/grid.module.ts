import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

//import { UtilsModule } from '../../../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipRenderComponent } from './tooltip-render.component';
import { ActionButtonComponent } from './action-button.component';
import { PublishRendererComponent } from './publish-render.component';
import { UnsubscribeButtonComponent } from './unsubscribe-button.component';

@NgModule({
    imports: [
        CommonModule,
        NgbTooltipModule,
        AgGridModule.withComponents([
            ActionButtonComponent,
            PublishRendererComponent,
            UnsubscribeButtonComponent,
            TooltipRenderComponent
        ])
    ],
    exports: [
        AgGridModule,
        ActionButtonComponent,
        PublishRendererComponent,
        UnsubscribeButtonComponent,
        TooltipRenderComponent
    ],
    declarations: [
        ActionButtonComponent,
        PublishRendererComponent,
        UnsubscribeButtonComponent,
        TooltipRenderComponent
    ]
})

export class AdminGridModule { }
