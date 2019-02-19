import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AdminHomeModule } from './admin/admin-home.module';
import { BlogHomeModule } from './blog/blog-home.module';

import { AdminHomeRoutes } from './admin/admin-home.client.routes';
import { BlogHomeRoutes } from './blog/blog-home.client.routes';

@NgModule({
  imports: [
    AdminHomeModule,
    BlogHomeModule
  ]
})

export class CMSModule { }

export const CMSRoutes: Routes = [
  ...AdminHomeRoutes,
  ...BlogHomeRoutes
];
