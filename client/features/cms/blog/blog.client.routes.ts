import { Route } from '@angular/router';

import { BlogComponent } from './blog.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

import { BlogPostsRoutes } from './blog-posts/blog-posts.client.routes';
import { SubscribeRoutes } from './subscribe/subscribe.client.routes';
import { PostDetailsRoutes } from './post-details/post-details.client.routes';
import { PageDetailsRoutes } from './pages/page-details.routes';

export const BlogRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: BlogComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'contact',
                component: ContactComponent
            },
            ...SubscribeRoutes,
            ...BlogPostsRoutes,
            ...PostDetailsRoutes,
            ...PageDetailsRoutes
        ]
    }
];
