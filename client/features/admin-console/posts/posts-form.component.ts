import {
  Component,
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
import moment from 'moment';

import {
  environment
} from '@env';

import {
  PostsService
} from '../services/posts.service';
import {
  Post
} from './post';

import {
  SlugifyPipe
} from '@utils';

@Component({
  moduleId: module.id,
  selector: 'app-posts-form-selector',
  templateUrl: `./posts-form.component.html`,
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsFormComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/dot-notation
  public editor = window['ClassicEditor'];
  public editorOptions: any;
  public postID: string;
  public post: Post;
  public currentDateObj: any = {};
  public postWordCount: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private postsService: PostsService
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
        toolbar: [],
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
        uploadUrl: environment.appBaseUrl + environment.apiBaseUrl + environment.imageBaseUrl + '?upload=posts'
      },
      wordCount: {
        onUpdate: (stats) => {
          this.postWordCount = stats.words;
        }
      },
      allowedContent: true
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Posts' + environment.metaTitleSuffix);
    this.post = new Post();
    this.route.params
      .subscribe(params => {
        this.postID = params.id ? params.id : null;

        if (this.postID) {
          this.postsService.GetById(this.postID)
            .subscribe((data: any) => {
              if (data && data.post) {
                this.post = merge(this.post, data.post) as Post;
                this.setDate();
              }
            }, (error) => {
              alert('Error loading post');
              console.log('Error loading post', error);
              this.router.navigate(['/admin']);
            });
        } else {
          this.setDate();
        }
      });
  }

  // format date for ngb datepicker
  setDate(): void {
    const savedDate = moment(this.post.publishDate);

    this.currentDateObj = {
      day: savedDate.date(),
      month: savedDate.month() + 1,
      year: savedDate.year()
    };
  }

  // format date for server
  onDateSelect(event: any): void {
    this.post.publishDate = moment(new Date(event.year, event.month - 1, event.day)).format('YYYY-MM-DD');
  }

  slugifyTitle(): void {
    const slugifyPipe = new SlugifyPipe();
    this.post.slug = slugifyPipe.transform(this.post.title);
  }

  onSubmit(): void {
    this.post.url = '/blog/post/' + moment(this.post.publishDate).format('YYYY/MM/DD') + '/' + this.post.slug;
    this.postsService.Save(this.post)
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }

  deletePost(): void {
    this.postsService.Delete(this.postID)
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }
}
