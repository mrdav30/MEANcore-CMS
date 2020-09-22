import { Route } from '@angular/router';

import { AdminConsoleComponent } from './admin-console.component';

import { PagesRoutes } from './pages/pages.client.routes';
import { PostsRoutes } from './posts/posts.client.routes';
import { RedirectsRoutes } from './redirects/redirects.client.routes';

import { AuthGuard } from '@utils';

export const AdminConsoleRoutes: Route[] = [
    {
        path: 'admin',
        data: { roles: ['admin'] },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: AdminConsoleComponent
            },
            ...PagesRoutes,
            ...PostsRoutes,
            ...RedirectsRoutes
        ]
    }
];
