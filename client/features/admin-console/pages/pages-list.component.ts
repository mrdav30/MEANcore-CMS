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
  PagesService
} from '../services/pages.service';
import {
  Page
} from './page';

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
  selector: 'app-pages-list-selector',
  templateUrl: `./pages-list.component.html`,
  styleUrls: [`../grid-utils/grid-utils.css`],
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PagesListComponent implements OnDestroy {
  public pages: Page[];
  // grid component settings
  public context;
  public gridApi;
  public gridStyle = {
    width: '100%',
    height: '60vh',
    boxSizing: 'border-box'
  };
  public pagesColumnDef = [{
      headerName: 'Title',
      field: 'title',
      cellRenderer: 'tooltipCellRenderer',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Published',
      field: 'publish',
      cellRenderer: 'publishRendererComponent',
      cellClass: 'center-btn-cell'
    },
    {
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
    private pageService: PagesService
  ) {
    this.context = {
      componentParent: this
    };
  }

  takeAction(page): void {
    this.router.navigate(['admin/pages/edit', page._id]);
  }

  // Ag Grid Related functions
  onGridReady(params) {
    this.gridApi = params.api;

    this.pageService.GetAll()
      .subscribe((data: any) => {
        this.pages = data && data.pages ? data.pages as Page[] : [];

        if (this.pages.length === 0) {
          this.gridStyle.height = '5vh';
        }
        if (this.gridApi) {
          this.gridApi.setRowData(this.pages);
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
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}
