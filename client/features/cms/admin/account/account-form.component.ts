import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as CustomEditor from '../_content/ckeditor-custom/ckeditor';
import { merge } from 'lodash';

import { AccountService } from '../services/account.service';
import { Account } from './account';

@Component({
    moduleId: module.id,
    selector: 'app-account-form-selector',
    templateUrl: `./account-form.component.html`,
    styleUrls: [`./account-form.component.css`]
})

export class AccountFormComponent implements OnInit {
    @ViewChild('username') username: NgModel;
    @ViewChild('password') password: NgModel;
    public editor = CustomEditor;
    public editorOptions: any;
    public account: Account;
    public possibleUsername: string;
    public passwordTooltip: string;
    public passwordErrors: string[];

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef,
        private accountService: AccountService
    ) {
        // set options for ckeditor
        this.editorOptions = {
            // limit toolbar for account about me
            toolbar: ['bold', 'italic', 'highlight', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
            allowedContent: true
        };
    }

    ngOnInit(): void {
        this.account = new Account();
        this.accountService.GetCurrent()
            .subscribe((data: any) => {
                if (data && data.account) {
                    this.account = merge(new Account(), data.account) as Account;
                }
            }, (error) => {
                alert('Error loading page');
                this.router.navigate(['/admin']);
            });
    }

    setPasswordValidation(passwordValidation: any): void {
        this.passwordTooltip = passwordValidation.passwordTooltip;
        this.passwordErrors = passwordValidation.errorMessages;
        if (this.password && !this.password.control.pristine) {
            if (passwordValidation.status) {
                this.password.control.setErrors({ incorrect: true });
            } else {
                this.password.control.setErrors(null);
            }
        }
        this.cdr.detectChanges();
    }

    onSubmit(): void {
        this.accountService.Update(this.account).subscribe((data: any) => {
            if (data && data.userExists) {
                this.possibleUsername = data.possibleUsername;
                this.username.control.setErrors({ alreadyused: true });
            } else {
                this.account.password = '';
            }
        }, (error) => {
            alert('Error updating account');
            this.router.navigate(['/admin']);
        });
    }

    clear(): void {
        this.account.avatarUrl = '';
    }
}
