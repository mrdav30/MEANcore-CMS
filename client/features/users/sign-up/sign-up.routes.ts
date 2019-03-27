import { Route } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

import { DirectAccessGuard } from '../../utils';

export const SignUpRoutes: Route[] = [
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [DirectAccessGuard]
  }
];
