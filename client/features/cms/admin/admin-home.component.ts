import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'home-admin-selector',
    templateUrl: `./admin-home.component.html`
})

export class AdminHomeComponent implements OnInit {
    constructor(
        private titleService: Title
    ) { }
    // tslint:disable-next-line
    ngOnInit() {
        this.titleService.setTitle('Admin | The MEANcore Blog')
    }
}
