import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubscribeService } from '../services/subscribe.service';
import { SeoService } from '@utils';

@Component({
    moduleId: module.id,
    selector: 'app-unsubscribe-selector',
    templateUrl: `./unsubscribe.component.html`
})

export class UnsubscribeComponent implements OnInit {
    public subscriberEmail: string;

    constructor(
        private router: Router,
        private seoService: SeoService,
        private subscribeService: SubscribeService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: 'Unsubscribe'
        });
    }

    onSubmit(): void {
        this.subscribeService.Unsubscribe(this.subscriberEmail)
            .subscribe((data: any) => {
                if (data && data.unsubscribed) {
                    this.router.navigate(['/blog']);
                }
            });
    }
}
