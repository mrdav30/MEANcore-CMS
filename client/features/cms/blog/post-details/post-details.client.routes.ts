import { Route } from '@angular/router';

import { PostDetailsComponent } from './post-details.component';

export const PostDetailsRoutes: Route[] = [
    {
        path: 'blog/post',
        children: [
            {
                path: '',
                redirectTo: '/blog',
                pathMatch: 'full'
            },
            {
                path: ':year/:month/:day/:slug',
                component: PostDetailsComponent
            }
        ]
    }
];
