import { Route } from '@angular/router';
import { CanDeactivateGuard } from '@utils';

import { PagesFormComponent } from './pages-form.component';

export const PagesRoutes: Route[] = [
    {
        path: 'pages/:type',
        redirectTo: 'pages/:type/',
        pathMatch: 'full'
    },
    {
        path: 'pages/:type/:id',
        component: PagesFormComponent,
        canDeactivate: [CanDeactivateGuard]
    }
];
