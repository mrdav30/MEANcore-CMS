import {
  Component,
  OnInit
} from '@angular/core';

import {
  AuthService,
  SeoService
} from '@utils';

import {
  BlogService
} from '../blog/services/blog.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'app-home.component.html',
  styleUrls: ['app-home.component.css']
})

export class AppHomeComponent implements OnInit {
  public vm: any = {};
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private seoService: SeoService,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    if (this.authService.user) {
      this.isLoggedIn = this.authService.user ? true : false;
    }

    // home page doesn't require pagination
    this.blogService.GetAll('Home', null)
      .subscribe((data: any) => {
        if (data && data.vm) {
          this.vm = data.vm;
          this.seoService.generateTags({
            title: this.vm.metaTitle,
            description: this.vm.metaDescription,
            type: 'website',
            image: this.vm.metaImage || ''
          });
        }
      });
  }
}
