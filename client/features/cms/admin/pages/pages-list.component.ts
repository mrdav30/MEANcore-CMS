import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { PagesService } from '../services/pages.service';
import { Page } from './page';

import { ActionButtonComponent } from '../grid-utils/action-button.component';
import { PublishRendererComponent } from '../grid-utils/publish-render.component';

@Component({
    moduleId: module.id,
    selector: 'app-pages-list-selector',
    templateUrl: `./pages-list.component.html`,
    styleUrls: [`../grid-utils/grid-utils.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PagesListComponent implements OnInit, OnDestroy {
    public pages: Page[] = [];
    // grid component settings
    public context;
    public gridApi;
    public pagesColumnDef = [
        { headerName: 'Title', field: 'title' },
        {
            headerName: 'Published', field: 'publish', cellRenderer: 'publishRendererComponent',
            cellClass: 'center-btn-cell'
        },
        {
            headerName: '', field: 'ACTION', cellRenderer: 'actionButtonComponent',
            cellClass: 'center-btn-cell', filter: false, sortable: false
        }
    ];
    public frameworkComponents = {
        actionButtonComponent: ActionButtonComponent,
        publishRendererComponent: PublishRendererComponent
    };
    private resizeObservable$: Observable<Event>;
    private resizeSubscription$: Subscription;

    constructor(
        private router: Router,
        private pageService: PagesService
    ) {
        this.context = { componentParent: this };
    }

    ngOnInit(): void {
        this.pageService.GetAll()
            .subscribe((data: any) => {
                this.pages = data.pages ? data.pages as Page[] : [];
            });
    }

    takeAction(page): void {
        this.router.navigate(['admin/pages/edit', page._id]);
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
