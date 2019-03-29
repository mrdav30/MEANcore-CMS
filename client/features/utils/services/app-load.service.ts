import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';

@Injectable()
export class AppLoadService {
<<<<<<< HEAD
    private getUserUrl = environment.appBaseUrl + environment.apiBaseUrl + '/users/me';
=======
    private uacConfigUrl = environment.appBaseUrl + environment.apiBaseUrl + '/uac/config';
>>>>>>> meancore-cms-dev

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    initializeApp(): Promise<any> {
<<<<<<< HEAD
        const profilePromise = this.http.get(this.getUserUrl)
=======
        const configPromise = this.http.get(this.uacConfigUrl)
>>>>>>> meancore-cms-dev
            .toPromise()
            .then((data: any) => {

                this.configService.user = data ? data : null;
            });

        return profilePromise;
    }
}