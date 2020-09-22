import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    moduleId: module.id,
    selector: 'app-unsubscribe-button',
    template: `<button (click)="removeEmail()" class="btn btn-danger btn-sm align-super"><i class="icon-user-times"></i></button>`,
})

export class UnsubscribeButtonComponent implements ICellRendererAngularComp {
    public params: any;
    public model: any = {};

    agInit(params: any): void {
        this.params = params;
        this.model = params.data || {};
    }

    removeEmail(): void {
        this.params.context.componentParent.removeEmail(this.model);
    }

    refresh(): boolean {
        return false;
    }
}
