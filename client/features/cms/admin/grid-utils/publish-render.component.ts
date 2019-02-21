import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    moduleId: module.id,
    selector: 'app-publish-renderer',
    template: `<i *ngIf="model.publish" class="fas fa-check align-super"></i>`,
})

export class PublishRendererComponent implements ICellRendererAngularComp {
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
