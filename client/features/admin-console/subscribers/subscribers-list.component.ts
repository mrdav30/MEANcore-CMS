import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  fromEvent,
  Observable,
  Subscription
} from 'rxjs';

import {
  filter,
  map,
  findIndex
} from 'lodash';
import {
  saveAs
} from 'file-saver';

import {
  SubscribersService
} from '../services/subscribers.service';
import {
  Subscribers
} from './subscribers';

import {
  OptInRendererComponent
} from '../grid-utils/optin-render.component';
import {
  UnsubscribeButtonComponent
} from '../grid-utils/unsubscribe-button.component';

@Component({
  moduleId: module.id,
  selector: 'app-subscribers-list-selector',
  templateUrl: `./subscribers-list.component.html`,
  styleUrls: [`../grid-utils/grid-utils.css`],
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class SubscribersListComponent implements OnDestroy {
  public subscribers: Subscribers[];
  // grid component settings
  public context;
  public gridApi;
  public gridStyle = {
    width: '100%',
    height: '60vh',
    boxSizing: 'border-box'
  };
  public subscribersColumnDef = [{
      headerName: 'Email',
      field: 'email',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Opted In',
      field: 'optIn',
      cellRenderer: 'optInRendererComponent',
      cellClass: 'center-btn-cell'
    },
    {
      headerName: 'Opt In Date',
      field: 'optInDate',
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Remove',
      field: 'ACTION',
      cellRenderer: 'unsubscribeButtonComponent',
      cellClass: 'center-btn-cell',
      filter: false,
      sortable: false
    }
  ];
  public frameworkComponents = {
    unsubscribeButtonComponent: UnsubscribeButtonComponent,
    optInRendererComponent: OptInRendererComponent
  };
  private resizeObservable$: Observable < Event > ;
  private resizeSubscription$: Subscription;

  constructor(
    private subscribersService: SubscribersService
  ) {
    this.context = {
      componentParent: this
    };
  }

  // remove email from the database
  removeEmail(subscriber: any): void {
    this.subscribersService.Delete(subscriber._id).subscribe(() => {
      const subscriberIndex = findIndex(this.subscribers, (el) => el._id === subscriber._id);
      if (subscriberIndex >= 0) {
        this.subscribers.splice(subscriberIndex, 1);
        if (this.gridApi) {
          this.gridApi.setRowData(this.subscribers);
          this.gridApi.sizeColumnsToFit();
          this.gridApi.resetRowHeights();
        }
      }
    });
  }

  exportSubscribers() {
    // specify how null values are handled
    const replacer = (key, value) => value === null ? '' : value;

    // only map values with a defined header name
    const headerDefs = filter(this.subscribersColumnDef, (def) => {
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
    const headerNames = map(headerDefs, (def) => {
      return def.headerName;
    });

    // add headers to start of csv data
    csv.unshift(headerNames.join(','));

    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], {
      type: 'text/csv'
    });
    saveAs(blob, 'myFile.csv');
  }

  // Ag Grid Related functions
  onGridReady(params: any) {
    this.gridApi = params.api;

    this.subscribersService.GetAll()
      .subscribe((data: any) => {
        this.subscribers = data.subscribers ? data.subscribers as Subscribers[] : [];

        if (this.subscribers.length === 0) {
          this.gridStyle.height = '5vh';
        }
        if (this.gridApi) {
          this.gridApi.setRowData(this.subscribers);
        }

        this.resizeObservable$ = fromEvent(window, 'resize');
        this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
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
