import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  Title
} from '@angular/platform-browser';
import '../../../assets/ckeditor-custom/ckeditor';
import {
  merge
} from 'lodash';
import {
  Subscription
} from 'rxjs';

import {
  environment
} from '@env';
import {
  SlugifyPipe
} from '@utils';

import {
  PagesService
} from '../services/pages.service';
import {
  Page
} from './page';

@Component({
  moduleId: module.id,
  selector: 'app-pages-form-selector',
  templateUrl: `./pages-form.component.html`,
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PagesFormComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/dot-notation
  public editor = window['ClassicEditor'];
  public editorOptions: any;
  public pageID: string;
  public page: Page;

  private paramSub$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private pagesService: PagesService
  ) {
    // set options for ckeditor
    this.editorOptions = {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          '|',
          'fontFamily',
          'highlight',
          'fontColor',
          'fontSize',
          'specialCharacters',
          'horizontalLine',
          'removeFormat',
          '|',
          'alignment',
          'outdent',
          'indent',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'link',
          'imageInsert',
          'mediaEmbed',
          'blockQuote',
          'codeBlock',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:side',
          'linkImage'
        ]
      },
      mediaEmbed: {
        removeProviders: ['instagram', 'twitter', 'googleMaps', 'flickr', 'facebook']
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      simpleUpload: {
        uploadUrl: environment.appBaseUrl + environment.apiBaseUrl + environment.imageBaseUrl + '?upload=pages'
      },
      allowedContent: true
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Pages' + environment.metaTitleSuffix);
    this.page = new Page();
    this.paramSub$ = this.route.paramMap
      .subscribe(paramMap => {
        this.pageID = paramMap.get('id');

        if (this.pageID) {
          this.pagesService.GetById(this.pageID)
            .subscribe((data: any) => {
              if (data && data.page) {
                this.page = merge(this.page, data.page) as Page;
              }
            });
        }
      }, (error) => {
        alert('Error loading page');
        this.router.navigate(['/admin']);
      });
  }

  slugifyTitle(): void {
    const slugifyPipe = new SlugifyPipe();
    this.page.slug = slugifyPipe.transform(this.page.title);
  }

  onSubmit(): void {
    this.pagesService.Save(this.page)
      .subscribe((data: any) => {
        this.router.navigate(['/admin']);
      });
  }

  deletePage(): void {
    this.pagesService.Delete(this.pageID)
      .subscribe((data: any) => {
        this.router.navigate(['/admin']);
      });
  }

  ngOnDestroy(): void {
    this.paramSub$.unsubscribe();
  }
}