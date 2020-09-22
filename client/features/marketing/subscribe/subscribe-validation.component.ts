import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@env';

import { SubscribeService } from '../services/subscribe.service';

import { SeoService, RECAPTCHA_URL } from '@utils';

@Component({
    moduleId: module.id,
    selector: 'app-subscribe-validation-selector',
    templateUrl: `./subscribe-validation.component.html`,
    providers: [{
        provide: RECAPTCHA_URL,
        useValue: environment.appBaseUrl + environment.apiBaseUrl + '/validate_captcha'
    }]
})

export class SubscribeValidationComponent implements OnInit {
    public reCaptcha: boolean;
    private confirmationToken: string;
    public isValidated = false;
    public isTokenInvalid = false;
    public siteKey: string;

    constructor(
        private _seoService: SeoService,
        private route: ActivatedRoute,
        private _subscribeService: SubscribeService
    ) { }

    ngOnInit(): void {
        this.siteKey = environment.recaptchaSiteKey;
        this._seoService.generateTags({
            title: 'Subscription Validation'
        });
        // subscribe to token parameter, sent on user confirmation
        this.route.params
            .subscribe(params => {
                if (params.token === 'invalid') {
                    this.isTokenInvalid = true;
                } else {
                    this.confirmationToken = params.token;
                }
            });
    }

    onSubmit(): void {
        this._subscribeService.SendValidation(this.confirmationToken)
            .subscribe((data: any) => {
                if (data) {
                    if (data.validated) {
                        this.isValidated = true;
                    } else {
                        this.isTokenInvalid = true;
                    }
                }
            });
    }
}
