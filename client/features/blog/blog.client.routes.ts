import {
  Route
} from '@angular/router';

import {
  BlogComponent
} from './blog.component';

import {
  BlogPostsRoutes
} from './blog-posts/blog-posts.client.routes';
import {
  PostDetailsRoutes
} from './post-details/post-details.client.routes';
import {
  PageDetailsRoutes
} from './pages/page-details.routes';

export const BlogRoutes: Route[] = [{
    path: 'blog',
    children: [{
        path: '',
        component: BlogComponent
      },
      ...BlogPostsRoutes,
      ...PostDetailsRoutes,
      ...PageDetailsRoutes
    ]
  }
];
