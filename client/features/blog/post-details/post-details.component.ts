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
import {
  Observable
} from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-post-details-selector',
  templateUrl: `./post-details.component.html`,
  styleUrls: [`./post-details.component.css`],
  encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class PostDetailsComponent implements OnInit, AfterViewChecked {
  @ViewChildren(DisqusThreadComponent) disqusThread: QueryList < DisqusThreadComponent > ;

  public postParams: any;
  public vm: any = {};
  public domLoaded = false;
  public domFormatted = false;
  public hasTocContent: boolean;
  public isPreview: boolean;

  private childrenDetector: Observable < any > ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
    private scriptInjectorService: ScriptInjectorService,
    private ref: ChangeDetectorRef,
    private blogService: BlogService
  ) {
    window.addEventListener('hashchange', this.shiftWindow);

    let checkScroll = true;
    window.addEventListener('scroll', () => {
      if (this.hasTocContent) {
        if (checkScroll) {
          checkScroll = false;
          const targetElement = document.getElementById('postToc');
          if (targetElement) {
            if ((window.scrollY) > (targetElement.offsetTop + targetElement.offsetHeight)) {
              document.getElementById('postToc').classList.add('toc-content-pad');
            } else {
              document.getElementById('postToc').classList.remove('toc-content-pad');
            }
          }
          setTimeout(() => {
            checkScroll = true;
          }, 500);
        }
      }
    });
  }

  ngOnInit(): void {
    this.vm.post = new PostDetails();
    this.route.paramMap
      .subscribe(paramMap => {
        this.postParams = {
          year: paramMap.get('year'),
          month: paramMap.get('month'),
          day: paramMap.get('day'),
          slug: paramMap.get('slug')
        };

        this.isPreview = paramMap.get('isPreview') ? true : false;

        this.blogService.getPost(this.postParams)
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
                url: this.vm.post.permaLink,
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

      this.getToc();

      this.domFormatted = true;
      this.ref.detectChanges();

      const anchorLink = this.router.url.substring(this.router.url.indexOf('#') + 1);
      const testElement = document.getElementById(anchorLink);
      if (location.hash) {
        testElement.scrollIntoView({
          behavior: 'smooth'
        });
        this.shiftWindow();
      }
    }

    this.childrenDetector = this.disqusThread.changes;

    this.childrenDetector.subscribe(() => {
      this.disqusThread.first.identifier = this.vm.metaTitle;
      this.disqusThread.first.init();
    });
  }

  shiftWindow() {
    scrollBy(0, -70);
  };

  getToc() {
    const tocContainer = document.createElement('div');
    const tocHeader = tocContainer.appendChild(document.createElement('span'));
    tocHeader.innerHTML = 'Contents';
    const tocList = tocContainer.appendChild(document.createElement('ul'));
    tocList.classList.add('toc-parent');

    this.hasTocContent = false;

    // loop through the array of headlines
    forEach(document.querySelectorAll('h2'), (header) => {
      this.hasTocContent = true;
      let pointer = tocList;

      const parentHeaderIdentifier = header.innerText;
      header.setAttribute('id', parentHeaderIdentifier.replace(/\s+/g, '_'));

      const headerListElement = pointer.appendChild(document.createElement('li'));
      const headerAnchor = this.router.url.split('#')[0] + '#' + parentHeaderIdentifier.replace(/\s+/g, '_');
      headerListElement.innerHTML = '<a href="' + headerAnchor + '">' + parentHeaderIdentifier + '</a>';

      let nextElement = header.nextElementSibling;

      let childPointer = pointer;
      while (nextElement && nextElement.nodeName !== 'H2') {
        let childHeaderIdentifier = '';
        let target: HTMLUListElement;

        //let grandChildPointer;
        if (nextElement.nodeName === 'H3' || nextElement.nodeName === 'H4') {

          if (nextElement.nodeName === 'H3') {
            // if we are at top level and we have detected a headline level 2
            if (pointer === tocList) {
              pointer = pointer.appendChild(document.createElement('ul'));
              pointer.classList.add('toc-child');
            }

            target = pointer;
          } else if (nextElement.nodeName === 'H4') {
            // if we are at headline level 2 and we have detected a headline level 3
            if (childPointer !== pointer) {
              childPointer = pointer.appendChild(document.createElement('ul'));
            }

            target = childPointer;
          }

          childHeaderIdentifier = (nextElement as HTMLHeadingElement).innerText;
          nextElement.setAttribute('id', childHeaderIdentifier.replace(/\s+/g, '_'));

          // for each child headline, create a list item
          const childListElement = target.appendChild(document.createElement('li'));
          const childAnchor = this.router.url.split('#')[0] + '#' + childHeaderIdentifier.replace(/\s+/g, '_');
          childListElement.innerHTML = '<a href="' + childAnchor + '">' + childHeaderIdentifier + '</a>';
        }

        nextElement = nextElement.nextElementSibling;
      }
    });

    if (this.hasTocContent) {
      document.getElementById('postToc').appendChild(tocContainer);
    }
  }

  onFollowAuthor(target: string) {
    let followLink: string;
    switch (target) {
      case 'facebook':
        followLink = this.vm.post.author.facebookUrl;
        break;
      case 'twitter':
        followLink = this.vm.post.author.twitterUrl;
        break;
      case 'linkedin':
        followLink = this.vm.post.author.linkedinUrl;
        break;
      case 'github':
        followLink = this.vm.post.author.githubUrl;
        break;
      case 'stackoverflow':
        followLink = this.vm.post.author.stackOverflowUrl;
        break;
      case 'personal':
        followLink = this.vm.post.author.personalUrl;
        break;
    }

    window.open(followLink, '_blank');
  }

  onSharePost(target: string) {
    let shareLink: string;
    switch (target) {
      case 'facebook':
        shareLink = 'http://facebook.com/sharer.php?u=' + this.vm.post.permaLink;
        break;
      case 'twitter':
        shareLink = 'http://twitter.com/intent/tweet?url=' + this.vm.post.permaLink + '&text=' + this.vm.metaTitle;
        break;
      case 'linkedin':
        shareLink = 'https://www.linkedin.com/shareArticle?mini=true&title=' + this.vm.metaTitle + '&url=' + this.vm.post.url;
        break;
      case 'email':
        // eslint-disable-next-line max-len
        shareLink = 'https://api.addthis.com/oexchange/0.8/forward/email/offer?url=' + this.vm.post.permaLink + '&title=' + this.vm.metaTitle + '&ct=1';
        break;
    }

    window.open(shareLink, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  }
}