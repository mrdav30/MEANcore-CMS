/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  Component,
  OnDestroy,
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
  pairwise
} from 'rxjs/operators';
import {
  Subscription
} from 'rxjs';

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
  CMSConfig
} from '../cms-config/cms-config';
import {
  CMSConfigService
} from '../services/cms-config.service';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-posts-form-selector',
  templateUrl: `./posts-form.component.html`,
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('postForm') postForm: any;
  // eslint-disable-next-line @typescript-eslint/dot-notation
  public editor = window['ClassicEditor'];
  public editorOptions: any;
  public postID: string;
  public post: Post;
  public cmsConfig: CMSConfig;
  public untouchedPost: Post;
  public currentDateObj: any = {};
  public postWordCount: number;
  public wpm = 225;
  public hostUrl: string;

  private paramSub$: Subscription;
  private formChangesSub$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private postsService: PostsService,
    private cmsConfigService: CMSConfigService,
    private modalService: NgbModal
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

    this.hostUrl = window.location.protocol + '//' + window.location.hostname;

    this.paramSub$ = this.route.paramMap
      .subscribe(paramMap => {
        this.postID = paramMap.get('id');
        this.refresh();
      });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Posts' + environment.metaTitleSuffix);
  }

  refresh(): void {
    this.post = new Post();

    if (this.postID) {
      this.postsService.GetById(this.postID)
        .subscribe((data: any) => {
          if (data && data.post) {
            this.post = merge(this.post, data.post) as Post;
            this.post.slug = this.post.slug.replace('-unpublished', '');
            this.post.url = this.post.url.replace('-unpublished', '');
            this.untouchedPost = clone(this.post) as Post;
            this.setDate();
          }
        }, (error) => {
          alert('Error loading post');
          console.log('Error loading post', error);
          this.backToPostList();
        });
    } else {
      this.cmsConfigService.GetAll()
        .subscribe((data: any) => {
          if (data && data.cmsConfig) {
            this.post.urlStructure = data.cmsConfig.defaultUrlStructure;
          }
          this.setDate();
        });
    }
  }

  ngAfterViewInit(): void {
    this.formChangesSub$ = this.postForm.valueChanges
      .pipe(pairwise())
      .subscribe(
        ([prev, next]) => {
          if (this.post._id && this.untouchedPost.publish) {
            if (!this.postForm.form.pristine) {
              if (this.untouchedPost.unpublishedChanges && next.publish) {
                this.post.unpublishedChanges = true;
              } else {
                const formCheck = {
                  ...this.post,
                  ...next
                };
                const edited = reduce(omit(formCheck, ['publish', 'publishChanges', 'unpublishedChanges']), (result, value, key) =>
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
            }
          } else {
            this.post.unpublishedChanges = false;
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

  openUrlStructureEdit(content: any): void {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  onSubmit(isPreview: boolean): void {
    if (this.post.urlStructure === 'date') {
      this.post.url = '/blog/post/' + moment(this.post.publishDate).format('YYYY/MM/DD') + '/' + this.post.slug;
    } else if (this.post.urlStructure === 'slug') {
      this.post.url = '/blog/post/' + this.post.slug;
    }

    if (this.post.unpublishedChanges && !this.post.publishChanges) {
      this.post.slug += '-unpublished';
      this.post.url += '-unpublished';
    }
    this.postsService.Save(this.post)
      .subscribe(() => {
        if (!isPreview) {
          this.backToPostList();
        } else {
          this.router.navigate(['/admin' + this.post.url + '/isPreview']);
        }
      });
  }

  showPreview(): boolean {
    if (this.untouchedPost && !this.untouchedPost.publish || this.post.unpublishedChanges) {
      return true;
    } else {
      return false;
    }
  }

  cancelEdit(): void {
    this.backToPostList();
  }

  deletePost(): void {
    this.postsService.Delete(this.postID)
      .subscribe(() => {
        this.backToPostList();
      });
  }

  backToPostList(): void {
    this.router.navigate(['/admin']);
  }

  ngOnDestroy(): void {
    this.paramSub$.unsubscribe();
    this.formChangesSub$.unsubscribe();
  }
}