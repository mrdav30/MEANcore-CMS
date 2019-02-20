import { Route } from '@angular/router';

import { DirectAccessGuard } from '../../../utils';

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
        component: SubscribeValidationComponent,
        canActivate: [DirectAccessGuard]
    },
    {
        path: 'unsubscribe',
        component: UnsubscribeComponent
    }
];
