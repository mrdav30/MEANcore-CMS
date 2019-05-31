import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AdminConsoleModule } from './admin-console/admin-console.module';
import { BlogModule } from './blog/blog.module';

import { AdminConsoleRoutes } from './admin-console/admin-console.client.routes';
import { BlogRoutes } from './blog/blog.client.routes';

export { BlogFooterComponent } from './blog/blog-footer/blog-footer.component';

@NgModule({
  imports: [
    AdminConsoleModule,
    BlogModule
  ]
})

export class CMSModule { }

export const CMSRoutes: Routes = [
  ...AdminConsoleRoutes,
  ...BlogRoutes
];
