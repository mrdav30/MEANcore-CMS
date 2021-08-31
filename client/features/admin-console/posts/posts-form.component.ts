/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
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
  clone,
  isEqual,
  merge,
  omit,
  reduce
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
import {
  pairwise
} from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'app-posts-form-selector',
  templateUrl: `./posts-form.component.html`,
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsFormComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm') postForm: any;
  // eslint-disable-next-line @typescript-eslint/dot-notation
  public editor = window['ClassicEditor'];
  public editorOptions: any;
  public postID: string;
  public post: Post;
  public untouchedPost: Post;
  public currentDateObj: any = {};
  public postWordCount: number;
  public wpm = 225;

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
          this.post.readTime = Math.ceil(this.postWordCount / this.wpm);
        }
      },
      allowedContent: true
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Posts' + environment.metaTitleSuffix);

    this.post = new Post();
    this.route.paramMap
      .subscribe(paramMap => {
        this.postID = paramMap.get('id');

        if (this.postID) {
          this.postsService.GetById(this.postID)
            .subscribe((data: any) => {
              if (data && data.post) {
                this.post = merge(this.post, data.post) as Post;
                this.untouchedPost = clone(this.post) as Post;
                delete this.untouchedPost.publishChanges;
                delete this.untouchedPost.unpublishedChanges;
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

  ngAfterViewInit(): void {
    this.postForm.valueChanges
      .pipe(pairwise())
      .subscribe(
        ([prev, next]) => {
          if (this.post.parentId) {
            this.post.unpublishedChanges = true;
          } else {
            if (this.post._id && this.untouchedPost.publish && next.publish) {
              if (!this.postForm.form.pristine) {
                const formCheck = {
                  ...this.post,
                  ...next
                };
                delete formCheck.publish;
                delete formCheck.publishChanges;
                delete formCheck.unpublishedChanges;
                const edited = reduce(omit(formCheck, 'publish'), (result, value, key) =>
                  isEqual(value, this.untouchedPost[key]) ? result : result.concat({
                    [key]: value
                  }), []);
                if (edited.length) {
                  this.post.unpublishedChanges = true;
                } else {
                  this.post.unpublishedChanges = false;
                  this.post.publishChanges = false;
                }
              }
            } else {
              this.post.unpublishedChanges = false;
            }
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

  onSubmit(isPreview: boolean): void {
    this.post.url = '/blog/post/' + moment(this.post.publishDate).format('YYYY/MM/DD') + '/' + this.post.slug;
    this.postsService.Save(this.post)
      .subscribe(() => {
        if (!isPreview) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/admin' + this.post.url + '/isPreview']);
        }
      });
  }

  deletePost(): void {
    this.postsService.Delete(this.postID)
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }
}