import { Route } from '@angular/router';

import { BlogPostsComponent } from './blog-posts.component';

export const BlogPostsRoutes: Route[] = [
    {
        path: 'allposts',
        component: BlogPostsComponent
    },
    {
        path: 'posts',
        children: [
            {
                path: '',
                redirectTo: '/blog',
                pathMatch: 'full'
            },
            {
                path: 'tag/:tag',
                component: BlogPostsComponent
            },
            {
                path: 'author/:authorId',
                component: BlogPostsComponent
            },
            {
                path: 'search/:searchQuery',
                component: BlogPostsComponent
            },
            {
                path: 'date/:year/:month',
                component: BlogPostsComponent
            }
        ]
    },
];
