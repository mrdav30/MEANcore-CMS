import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    moduleId: module.id,
    selector: 'app-optin-renderer',
    template: `<i *ngIf="model.optIn" class="icon-check align-super"></i><i *ngIf="!model.optIn" class="icon-times align-super"></i>`,
})

export class OptInRendererComponent implements ICellRendererAngularComp {
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
