import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'app-admin-console-selector',
    templateUrl: `./admin-console.component.html`
})

export class AdminConsoleComponent implements OnInit {
    constructor(
        private titleService: Title
    ) { }
    // tslint:disable-next-line
    ngOnInit() {
        this.titleService.setTitle('Admin' + environment.metaTitleSuffix);
    }
}
