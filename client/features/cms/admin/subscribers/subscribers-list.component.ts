import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { SubscribersService } from '../services/subscribers.service';
import { Subscribers } from './subscribers';

import { UnsubscribeButtonComponent } from '../grid-utils/unsubscribe-button.component';

@Component({
    moduleId: module.id,
    selector: 'app-subscribers-list-selector',
    templateUrl: `./subscribers-list.component.html`,
    styleUrls: [`../grid-utils/grid-utils.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class SubscribersListComponent implements OnInit, OnDestroy {
    public subscribers: Subscribers[] = [];
    // grid component settings
    public context;
    public gridApi;
    public subscribersColumnDef = [
        { headerName: 'Email', field: 'email' },
        { headerName: 'Opt In Date', field: 'optInDate' },
        {
            headerName: '', field: 'ACTION', cellRenderer: 'unsubscribeButtonComponent',
            cellClass: 'center-btn-cell', filter: false, sortable: false
        }
    ];
    public frameworkComponents = {
        unsubscribeButtonComponent: UnsubscribeButtonComponent
    };
    private resizeObservable$: Observable<Event>;
    private resizeSubscription$: Subscription;

    constructor(
        private router: Router,
        private subscribersService: SubscribersService
    ) {
        this.context = { componentParent: this };
    }

    ngOnInit(): void {
        this.subscribersService.GetAll()
            .subscribe((data: any) => {
                this.subscribers = data.subscribers ? data.subscribers as Subscribers[] : [];
            });
    }

    unsubscribe(page): void {
        //this.router.navigate(['admin/redirects/edit', page._id]);
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
