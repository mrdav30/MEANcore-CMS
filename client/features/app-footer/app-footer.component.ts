import {
  Component,
  OnInit,
  DoCheck
} from '@angular/core';
import {
  Router
} from '@angular/router';

import {
  AppFooterService
} from './app-footer.service';

@Component({
  moduleId: module.id,
  selector: 'app-footer-selector',
  templateUrl: `./app-footer.component.html`,
  styleUrls: [`./app-footer.component.css`]
})

export class AppFooterComponent implements OnInit, DoCheck {
  public expandedIndex: number;
  public years: any;
  public tags: any;
  public showBlogFooter = false;

  constructor(
    public appFooterService: AppFooterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.expandedIndex = -1;
    this.appFooterService.blogFooter$.subscribe((vm: any) => {
      this.years = vm.years;
      this.tags = vm.tags;
    });
  }

  ngDoCheck() {
    if (this.router.url === '/' || this.router.url.includes('/home') || this.router.url.includes('/blog')) {
      this.showBlogFooter = true;
    } else {
      this.showBlogFooter = false;
    }
  }
}
