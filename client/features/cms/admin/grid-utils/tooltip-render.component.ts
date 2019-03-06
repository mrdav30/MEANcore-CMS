import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    moduleId: module.id,
    selector: 'app-ag-tooltip-render',
    template: `<span ngbTooltip="{{this.params.value}}" container="body" placement="bottom">{{this.params.value}}</span>`,
})

export class TooltipRenderComponent implements ICellRendererAngularComp {
    public params: any;
    public model: any = {};

    agInit(params: any): void {
        this.params = params;
        this.model = params.data || {};
    }

    refresh(): boolean {
        return false;
    }
}
