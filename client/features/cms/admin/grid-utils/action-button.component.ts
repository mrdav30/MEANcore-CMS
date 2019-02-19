import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    moduleId: module.id,
    selector: 'action-button',
    template: `<button (click)="takeAction()" class="btn btn-secondary btn-sm align-super"><i class="fas fa-pen"></i></button>`,
})

export class ActionButtonComponent implements ICellRendererAngularComp {
    public params: any;
    public model: any = {};

    agInit(params: any): void {
        this.params = params;
        this.model = params.data || {};
    }

    takeAction(): void {
        this.params.context.componentParent.takeAction(this.model);
    }

    refresh(): boolean {
        return false;
    }
}