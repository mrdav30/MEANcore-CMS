import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  fromEvent,
  Observable,
  Subscription
} from 'rxjs';

import {
  PostsService
} from '../services/posts.service';
import {
  Post
} from './post';

import {
  TooltipRenderComponent
} from '../grid-utils/tooltip-render.component';
import {
  ActionButtonComponent
} from '../grid-utils/action-button.component';
import {
  PublishRendererComponent
} from '../grid-utils/publish-render.component';

@Component({
  moduleId: module.id,
  selector: 'app-posts-list-selector',
  templateUrl: `./posts-list.component.html`,
  styleUrls: [`../grid-utils/grid-utils.css`],
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsListComponent implements OnDestroy {
  public posts: Post[];
  // grid component settings
  public context;
  public gridApi;
  public gridStyle = {
    width: '100%',
    height: '60vh',
    boxSizing: 'border-box'
  };
  public postsColumnDef = [{
      headerName: 'Title',
      field: 'title',
      cellRenderer: 'tooltipCellRenderer',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Tags',
      field: 'tags',
      cellRenderer: 'tooltipCellRenderer',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Publish Date',
      field: 'publishDate',
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Last Updated',
      field: 'updated',
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Published',
      field: 'publish',
      cellRenderer: 'publishRendererComponent',
      cellClass: 'center-btn-cell'
    }, {
      headerName: 'Edit',
      field: 'ACTION',
      cellRenderer: 'actionButtonComponent',
      cellClass: 'center-btn-cell',
      filter: false,
      sortable: false
    }
  ];
  public frameworkComponents = {
    actionButtonComponent: ActionButtonComponent,
    publishRendererComponent: PublishRendererComponent,
    tooltipCellRenderer: TooltipRenderComponent
  };
  private resizeObservable$: Observable < Event > ;
  private resizeSubscription$: Subscription;

  constructor(
    private router: Router,
    private postsService: PostsService
  ) {
    this.context = {
      componentParent: this
    };
  }

  takeAction(post: any): void {
    const id = post.unpublishedChanges ? post.childId : post._id;
    this.router.navigate(['admin/posts/edit', id]);
  }

  // Ag Grid Related functions
  onGridReady(params: any) {
    this.gridApi = params.api;

    this.postsService.GetAll()
      .subscribe((data: any) => {
        this.posts = data && data.posts ? data.posts as Post[] : [];

        if (this.posts.length === 0) {
          this.gridStyle.height = '5vh';
        }
        if (this.gridApi) {
          this.gridApi.setRowData(this.posts);
        }

        this.resizeObservable$ = fromEvent(window, 'resize');
        this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
          setTimeout(() => {
            if (this.gridApi) {
              this.gridApi.sizeColumnsToFit();
              this.gridApi.resetRowHeights();
            }
          });
        });
      });
  }

  onFirstDataRendered() {
    if (this.gridApi) { // can be null when tabbing between the examples
      this.gridApi.sizeColumnsToFit();
    }
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}