import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubscribeService } from '../services/subscribe.service';
import { SeoService } from '../../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-subscribe-selector',
    templateUrl: `./subscribe.component.html`
})

export class SubscribeComponent implements OnInit {
    public subscriberEmail: string;

    constructor(
        private router: Router,
        private seoService: SeoService,
        private subscribeService: SubscribeService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: 'Subcribe'
        });
    }

    onSubmit(): void {
        this.subscribeService.SendConfirmation(this.subscriberEmail)
            .subscribe((data: any) => {
                if (data && data.msgSent) {
                    this.router.navigate(['/home']);
                }
            });
    }
}
