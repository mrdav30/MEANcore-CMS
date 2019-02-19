import { Route } from '@angular/router';

import { AdminHomeComponent } from './admin-home.component';

import { PagesRoutes } from './pages/pages.client.routes';
import { PostsRoutes } from './posts/posts.client.routes';
import { RedirectsRoutes } from './redirects/redirects.client.routes';

import { AuthGuard } from '../../utils';

export const AdminHomeRoutes: Route[] = [
    {
        path: 'admin',
        data: { roles: ['admin'] },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: AdminHomeComponent
            },
            ...PagesRoutes,
            ...PostsRoutes,
            ...RedirectsRoutes
        ]
    }
];
