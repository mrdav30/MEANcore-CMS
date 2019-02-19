import { Route } from '@angular/router';

import { BlogMainComponent } from './blog-main.component';

import { PostDetailsRoutes } from '../post-details/post-details.client.routes';

export const BlogMainRoutes: Route[] = [
    {
        path: 'blog',
        component: BlogMainComponent
    },
    {
        path: 'blog/posts',
        children: [
            {
                path: '',
                redirectTo: '/blog',
                pathMatch: 'full'
            },
            {
                path: 'tag/:tag',
                component: BlogMainComponent
            },
            {
                path: 'author/:author_id',
                component: BlogMainComponent
            },
            {
                path: 'search/:searchQuery',
                component: BlogMainComponent
            },
            {
                path: 'date/:year/:month',
                component: BlogMainComponent
            }
        ]
    },
];
