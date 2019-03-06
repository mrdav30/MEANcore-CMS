import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { PostsService } from '../services/posts.service';
import { Post } from './post';

import { TooltipRenderComponent } from '../grid-utils/tooltip-render.component';
import { ActionButtonComponent } from '../grid-utils/action-button.component';
import { PublishRendererComponent } from '../grid-utils/publish-render.component';

@Component({
    moduleId: module.id,
    selector: 'app-posts-list-selector',
    templateUrl: `./posts-list.component.html`,
    styleUrls: [`./posts-list.component.css`, `../grid-utils/grid-utils.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsListComponent implements OnInit, OnDestroy {
    public posts: Post[];
    // grid component settings
    public context;
    public gridApi;
    public postsColumnDef = [
        { headerName: 'Title', field: 'title', cellRenderer: 'tooltipCellRenderer', filter: 'agTextColumnFilter' },
        { headerName: 'Tags', field: 'tags', cellRenderer: 'tooltipCellRenderer', filter: 'agTextColumnFilter' },
        { headerName: 'Publish Date', field: 'publishDate', filter: 'agDateColumnFilter' },
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
        publishRendererComponent: PublishRendererComponent,
        tooltipCellRenderer: TooltipRenderComponent
    };
    private resizeObservable$: Observable<Event>;
    private resizeSubscription$: Subscription;

    constructor(
        private router: Router,
        private postsService: PostsService
    ) {
        this.context = { componentParent: this };
    }

    ngOnInit(): void {
        this.postsService.GetAll()
            .subscribe((data: any) => {
                if (data) {
                    this.posts = data.posts ? data.posts as Post[] : [];
                }
            });
    }

    takeAction(post): void {
        this.router.navigate(['admin/posts/edit', post._id]);
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
