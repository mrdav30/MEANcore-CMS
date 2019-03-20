import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { filter, map } from 'lodash';
import { saveAs } from 'file-saver';

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
        this.refresh();
    }

    // remove email from the database
    unsubscribe(subscriber): void {
        this.subscribersService.Delete(subscriber._id).subscribe(() => {
            return this.refresh();
        });
    }

    refresh(): void {
        this.subscribersService.GetAll()
            .subscribe((data: any) => {
                this.subscribers = data.subscribers ? data.subscribers as Subscribers[] : [];
            });
    }

    exportSubscribers() {
        // specify how null values are handled
        const replacer = (key, value) => value === null ? '' : value;

        // only map values with a defined header name
        let headerDefs = filter(this.subscribersColumnDef, (def) => {
            if (!def.headerName) {
                return false;
            }
            return true;
        });

        const csv = map(this.subscribers, (row) => {
            // match header field to data field
            return map(headerDefs, (def) => {
                return JSON.stringify(row[def.field], replacer);
            }).join(',');
        });

        // mutate to array of header names
        headerDefs = map(headerDefs, (def) => {
            return def.headerName;
        });

        // add headers to start of csv data
        csv.unshift(headerDefs.join(','));

        const csvArray = csv.join('\r\n');

        const blob = new Blob([csvArray], { type: 'text/csv' });
        saveAs(blob, 'myFile.csv');
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
