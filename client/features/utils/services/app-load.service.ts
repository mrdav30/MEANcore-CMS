import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';

@Injectable()
export class AppLoadService {
    private uacConfigUrl = environment.appBaseUrl + environment.apiBaseUrl + '/uac/config';

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    initializeApp(): Promise<any> {
        const configPromise = this.http.get(this.uacConfigUrl)
            .toPromise()
            .then((data: any) => {

                this.configService.user = data ? data : null;
            });

        return configPromise;
    }
}