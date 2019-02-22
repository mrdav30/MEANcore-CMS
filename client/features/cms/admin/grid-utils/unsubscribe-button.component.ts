import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    moduleId: module.id,
    selector: 'app-unsubscribe-button',
    template: `<button (click)="unsubscribe()" class="btn btn-danger btn-sm align-super"><i class="fas fa-user-minus"></i></button>`,
})

export class UnsubscribeButtonComponent implements ICellRendererAngularComp {
    public params: any;
    public model: any = {};

    agInit(params: any): void {
        this.params = params;
        this.model = params.data || {};
    }

    unsubscribe(): void {
        this.params.context.componentParent.unsubscribe(this.model);
    }

    refresh(): boolean {
        return false;
    }
}
