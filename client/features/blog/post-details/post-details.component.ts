import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    AfterViewChecked,
    ViewChildren,
    QueryList
  } from '@angular/core';
  import {
    Router,
    ActivatedRoute
  } from '@angular/router';
  import {
    DomSanitizer
  } from '@angular/platform-browser';
  
  import {
    map,
    forEach
  } from 'lodash';
  import hljs from 'highlight.js';
  
  import {
    BlogService
  } from '../services/blog.service';
  import {
    PostDetails
  } from './post-details';
  import {
    DisqusThreadComponent
  } from './disqus-thread/disqus-thread.component';
  import {
    SeoService,
    ScriptInjectorService
  } from '@utils';
  import { Observable } from 'rxjs';
  
  @Component({
    moduleId: module.id,
    selector: 'app-post-details-selector',
    templateUrl: `./post-details.component.html`,
    styleUrls: [`./post-details.component.css`],
    encapsulation: ViewEncapsulation.None // required to style innerHtml
  })
  
  export class PostDetailsComponent implements OnInit, AfterViewChecked {
    @ViewChildren(DisqusThreadComponent) disqusThread: QueryList<DisqusThreadComponent>;
  
    public postParams: any;
    public vm: any = {};
    public domLoaded = false;
    public domFormatted = false;
  
    childrenDetector: Observable<any>;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private sanitizer: DomSanitizer,
      private seoService: SeoService,
      private scriptInjectorService: ScriptInjectorService,
      private ref: ChangeDetectorRef,
      private blogService: BlogService
    ) {}
  
    ngOnInit(): void {
      this.vm.post = new PostDetails();
      this.route.params
        .subscribe(params => {
          this.postParams = {
            year: params.year ? params.year : null,
            month: params.month ? params.month : null,
            day: params.day ? params.day : null,
            slug: params.slug ? params.slug : null
          };
  
          this.blogService.GetPost(this.postParams)
            .then((data: any) => {
              if (data && data.vm) {
                this.vm = data.vm;
                // prevent angular from stripping out oembed content
                this.vm.post.body = this.sanitizer.bypassSecurityTrustHtml(this.vm.post.body);
                this.seoService.generateTags({
                  title: this.vm.metaTitle,
                  description: this.vm.metaDescription,
                  author: this.vm.post.author.name,
                  keywords: map(this.vm.post.tags).join(', '),
                  url: this.vm.post.perma_link,
                  image: this.vm.post.thumbnailUrl
                });
              }
            }, (error) => {
              alert('Error loading post');
              this.router.navigate(['/blog']);
            })
            .then(() => {
              this.scriptInjectorService.load('embedly')
                .then(() => {
                  this.domLoaded = true;
                })
                .catch(error => {
                  console.log(error);
                });
            });
        });
    }
  
    // not elegant, but need to ensure DOM is loaded before applying hljs formatting
    ngAfterViewChecked(): void {
      if (this.domLoaded && !this.domFormatted) {
        forEach(document.querySelectorAll('pre'), (block) => {
          const codeBlock = block.getElementsByTagName('code');
          hljs.highlightElement(codeBlock[0]);
        });
  
        forEach(document.querySelectorAll('oembed[url]'), (element) => {
          // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
          // to discover the media.
          const anchor = document.createElement('a');
  
          anchor.setAttribute('href', element.getAttribute('url'));
          anchor.className = 'embedly-card';
  
          element.appendChild(anchor);
        });
  
        this.domFormatted = true;
        this.ref.detectChanges();
      }
  
      this.childrenDetector =  this.disqusThread.changes;
  
      this.childrenDetector.subscribe(() => {
          this.disqusThread.first.identifier = this.vm.metaTitle;
          this.disqusThread.first.init();
      });
    }
  
    onNavigate(e: Event) {
      const url = (e.target as HTMLLinkElement).href;
      window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    }
  }
  