import { Route } from '@angular/router';
import { CanDeactivateGuard } from '@utils';

import { RedirectsFormComponent } from './redirects-form.component';

export const RedirectsRoutes: Route[] = [
    {
        path: 'redirects/:type',
        redirectTo: 'redirects/:type/',
        pathMatch: 'full'
    },
    {
        path: 'redirects/:type/:id',
        component: RedirectsFormComponent,
        canDeactivate: [CanDeactivateGuard]
    }
];
