import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { merge } from 'lodash';

import { RedirectsService } from '../services/redirects.service';
import { Redirect } from './redirect';

@Component({
    moduleId: module.id,
    selector: 'app-redirects-form-selector',
    templateUrl: `./redirects-form.component.html`
})

export class RedirectsFormComponent implements OnInit {
    public redirectID: string;
    public redirect: Redirect;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private redirectsService: RedirectsService
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Redirects | The MEANcore Blog');
        this.redirect = new Redirect();
        this.route.params
            .subscribe(params => {
                this.redirectID = params.id;

                if (this.redirectID) {
                    this.redirectsService.GetById(this.redirectID)
                        .subscribe((data: any) => {
                            this.redirect = merge(this.redirect, data.redirect) as Redirect;
                        }, (error) => {
                            alert('Error loading redirect');
                            this.router.navigate(['/admin']);
                        });
                }
            });
    }

    onSubmit(): void {
        this.redirectsService.Save(this.redirect)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }

    deleteRedirect(): void {
        this.redirectsService.Delete(this.redirectID)
            .subscribe((data: any) => {
                this.router.navigate(['/admin']);
            });
    }
}
