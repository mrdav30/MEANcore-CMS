import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { RedirectsService } from '../services/redirects.service';
import { Redirect } from './redirect';

import { TooltipRenderComponent } from '../grid-utils/tooltip-render.component';
import { ActionButtonComponent } from '../grid-utils/action-button.component';

@Component({
    moduleId: module.id,
    selector: 'app-redirects-list-selector',
    templateUrl: `./redirects-list.component.html`,
    styleUrls: [`../grid-utils/grid-utils.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class RedirectsListComponent implements OnInit, OnDestroy {
    public redirects: Redirect[] = [];
    // grid component settings
    public context;
    public gridApi;
    public redirectsColumnDef = [
        { headerName: 'From', field: 'from', cellRenderer: 'tooltipCellRenderer', filter: 'agTextColumnFilter' },
        { headerName: 'To', field: 'to', cellRenderer: 'tooltipCellRenderer', filter: 'agTextColumnFilter' },
        {
            headerName: '', field: 'ACTION', cellRenderer: 'actionButtonComponent',
            cellClass: 'center-btn-cell', filter: false, sortable: false
        }
    ];
    public frameworkComponents = {
        actionButtonComponent: ActionButtonComponent,
        tooltipCellRenderer: TooltipRenderComponent
    };
    private resizeObservable$: Observable<Event>;
    private resizeSubscription$: Subscription;

    constructor(
        private router: Router,
        private redirectService: RedirectsService
    ) {
        this.context = { componentParent: this };
    }

    ngOnInit(): void {
        this.redirectService.GetAll()
            .subscribe((data: any) => {
                this.redirects = data.redirects ? data.redirects as Redirect[] : [];
            });
    }

    takeAction(redirect): void {
        this.router.navigate(['admin/redirects/edit', redirect._id]);
    }

    // Ag Grid Related functions
    onGridReady(params) {
        this.gridApi = params.api;

        this.gridApi.sizeColumnsToFit();

        this.resizeObservable$ = fromEvent(window, 'resize');
        this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
            setTimeout(() => {
                params.api.sizeColumnsToFit();
            });
        });
    }

    ngOnDestroy() {
        this.resizeSubscription$.unsubscribe();
    }
}
