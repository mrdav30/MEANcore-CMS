import { NgModule } from '@angular/core';
import { Route } from '@angular/router';

import { AdminConsoleModule } from './features/admin-console/admin-console.module';
import { BlogModule } from './features/blog/blog.module';
import {
  MarketingModule
} from './features/marketing/marketing.module';

import { AdminConsoleRoutes } from './features/admin-console/admin-console.client.routes';
import { BlogRoutes } from './features/blog/blog.client.routes';
import {
  MarketingRoutes
} from './features/marketing/marketing.client.routes';

export {
  MarketingModule
} from './features/marketing/marketing.module';

@NgModule({
  imports: [
    AdminConsoleModule,
    BlogModule,
    MarketingModule
  ]
})

export class BaseModule { }

export const BaseRoutes: Route[] = [
  ...BlogRoutes,
  ...AdminConsoleRoutes,
  ...MarketingRoutes
];
