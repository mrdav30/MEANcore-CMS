import { Route } from '@angular/router';

import { PageDetailsComponent } from './page-details.component';

export const PageDetailsRoutes: Route[] = [
    {
        path: 'page',
        redirectTo: '/blog',
        pathMatch: 'full'
    },
    {
        path: 'page/:slug',
        component: PageDetailsComponent
    }
];
