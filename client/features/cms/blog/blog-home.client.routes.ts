import { Route } from '@angular/router';

import { BlogHomeComponent } from './blog-home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

import { BlogMainRoutes } from './blog-main/blog-main.client.routes';
import { SubscribeRoutes } from './subscribe/subscribe.client.routes';
import { PostDetailsRoutes } from './post-details/post-details.client.routes';
import { PageDetailsRoutes } from './pages/page-details.routes';

export const BlogHomeRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: BlogHomeComponent
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
            ...BlogMainRoutes,
            ...PostDetailsRoutes,
            ...PageDetailsRoutes
        ]
    }
];
