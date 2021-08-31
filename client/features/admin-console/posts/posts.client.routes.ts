import {
    Route
} from '@angular/router';
import {
    CanDeactivateGuard
} from '@utils';
import {
    PostDetailsComponent
} from '../../blog/post-details/post-details.component';

import {
    PostsFormComponent
} from './posts-form.component';

export const PostsRoutes: Route[] = [{
        path: 'posts/:type',
        redirectTo: 'posts/:type/',
        pathMatch: 'full'
    },
    {
        path: 'posts/:type/:id',
        component: PostsFormComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'blog/post/:year/:month/:day/:slug/:isPreview',
        component: PostDetailsComponent
    }
];
