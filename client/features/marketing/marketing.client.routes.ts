import { Route } from '@angular/router';

import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscribeValidationComponent } from './subscribe/subscribe-validation.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

export const MarketingRoutes: Route[] = [
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
