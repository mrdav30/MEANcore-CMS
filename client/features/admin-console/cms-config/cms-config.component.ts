import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  isEqual,
  merge
} from 'lodash';
import {
  Subscription
} from 'rxjs';
import {
  distinctUntilChanged,
  pairwise
} from 'rxjs/operators';

import {
  CMSConfigService
} from '../services/cms-config.service';
import {
  CMSConfig
} from './cms-config';

@Component({
  moduleId: module.id,
  selector: 'app-cms-config-selector',
  templateUrl: `./cms-config.component.html`,
  styleUrls: [`./cms-config.component.css`],
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class CMSConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cmsConfigForm') cmsConfigForm: any;
  public cmsConfig: CMSConfig;
  public hostUrl: string;

  private formChangesSub$: Subscription;

  constructor(
    private cmsConfigService: CMSConfigService
  ) {
    this.hostUrl = window.location.protocol + '//' + window.location.hostname;
  }

  ngOnInit(): void {
    this.cmsConfig = new CMSConfig();
    this.cmsConfigService.GetAll()
      .subscribe((data: any) => {
        this.cmsConfig = merge(this.cmsConfig, data.cmsConfig) as CMSConfig;
      });
  }

  ngAfterViewInit(): void {
    this.formChangesSub$ = this.cmsConfigForm.valueChanges
      .pipe(distinctUntilChanged(isEqual), pairwise())
      .subscribe(([prev, next]) => {
        if (!this.cmsConfigForm.form.pristine) {
          const formCheck = {
            ...this.cmsConfig,
            ...next
          };
          this.cmsConfigService.Save(formCheck).subscribe((data: any) => {
            if (data && data.savedConfig) {
              this.cmsConfig = merge(this.cmsConfig, data.savedConfig);
            }
            console.log('config updated!');
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.formChangesSub$.unsubscribe();
  }
}
