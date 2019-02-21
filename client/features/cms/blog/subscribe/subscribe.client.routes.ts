import { Route } from '@angular/router';

import { SubscribeComponent } from './subscribe.component';
import { SubscribeValidationComponent } from './subscribe-validation.component';
import { UnsubscribeComponent } from './unsubscribe.component';

export const SubscribeRoutes: Route[] = [
    {
        path: 'subscribe',
        component: SubscribeComponent
    },
    {
        path: 'subscribe/validate/:token',
        component: SubscribeValidationComponent
    },
    {
        path: 'unsubscribe',
        component: UnsubscribeComponent
    }
];
