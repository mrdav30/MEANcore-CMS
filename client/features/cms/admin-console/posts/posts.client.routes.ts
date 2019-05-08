import { Route } from '@angular/router';
import { CanDeactivateGuard } from '../../../utils';

import { PostsFormComponent } from './posts-form.component';

export const PostsRoutes: Route[] = [
    {
        path: 'posts/:type',
        redirectTo: 'posts/:type/',
        pathMatch: 'full'
    },
    {
        path: 'posts/:type/:id',
        component: PostsFormComponent,
        canDeactivate: [CanDeactivateGuard]
    }
];
