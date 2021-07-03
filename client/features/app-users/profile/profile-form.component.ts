import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import {
  Title
} from '@angular/platform-browser';
import {
  NgModel
} from '@angular/forms';
import {
  Router
} from '@angular/router';

import {
  environment
} from '@env';

import '../../../assets/ckeditor-custom/ckeditor';
import {
  merge
} from 'lodash';

import {
  ProfileService
} from '@utils';
import {
  Profile
} from './profile';

@Component({
  moduleId: module.id,
  selector: 'app-profile-form-selector',
  templateUrl: `./profile-form.component.html`,
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class ProfileFormComponent implements OnInit {
  @ViewChild('username', {
    static: false
  }) username: NgModel;
  @ViewChild('password', {
    static: false
  }) password: NgModel;
  // eslint-disable-next-line @typescript-eslint/dot-notation
  public editor = window['ClassicEditor'];
  public editorOptions: any;
  public profile: Profile;
  public possibleUsername: string;
  public passwordTooltip: string;
  public passwordErrors: string[];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private titleService: Title
  ) {
    // set options for ckeditor
    this.editorOptions = {
      // limit toolbar for profile about me
      toolbar: {
        items: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'highlight',
          'fontColor',
          'fontSize',
          'removeFormat',
          '|',
          'undo',
          'redo'
        ]
      },
      removePlugins: [
        'Alignment',
        'AutoImage',
        'Autoformat',
        'Autolink',
        'Autosave',
        'CKFinder',
        'CKFinderUploadAdapter',
        'CodeBlock',
        'Heading',
        'HorizontalLine',
        'HtmlEmbed',
        'Image',
        'ImageCaption',
        'ImageInsert',
        'ImageResize',
        'ImageStyle',
        'ImageToolbar',
        'ImageUpload',
        'Indent',
        'IndentBlock',
        'LinkImage',
        'List',
        'ListStyle',
        'MathType',
        'MediaEmbed',
        'MediaEmbedToolbar',
        'Mention',
        'PasteFromOffice',
        'Table',
        'TableCellProperties',
        'TableProperties',
        'TableToolbar',
        'Title'
      ],
      allowedContent: true
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Profile' + environment.metaTitleSuffix);
    this.profile = new Profile();
    this.profileService.GetCurrent()
      .subscribe((data: any) => {
        if (data && data.profile) {
          this.profile = merge(new Profile(), data.profile) as Profile;
        } else {
          this.router.navigate([environment.appDefaultRoute]);
        }
      }, (error) => {
        alert('Error loading page');
        this.router.navigate([environment.appDefaultRoute]);
      });
  }

  setPasswordValidation(passwordValidation: any): void {
    this.passwordTooltip = passwordValidation.passwordTooltip;
    this.passwordErrors = passwordValidation.errorMessages;
    if (this.password && !this.password.control.pristine) {
      if (passwordValidation.status) {
        this.password.control.setErrors({
          incorrect: true
        });
      } else {
        this.password.control.setErrors(null);
      }
    }
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.profileService.Update(this.profile).subscribe((data: any) => {
      if (data && data.userExists) {
        this.possibleUsername = data.possibleUsername;
        this.username.control.setErrors({
          alreadyused: true
        });
      } else {
        this.profile.password = '';
      }
    }, (error) => {
      alert('Error updating profile');
      this.router.navigate([environment.appDefaultRoute]);
    });
  }
}
