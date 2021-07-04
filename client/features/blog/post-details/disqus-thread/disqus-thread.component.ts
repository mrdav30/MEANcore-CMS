import {
    Injectable,
    Component,
    Inject
  } from '@angular/core';
  import {
    Location,
    DOCUMENT
  } from '@angular/common';
  import {
    WINDOW,
    DisqusMockWindow
  } from './disqus-window';
  
  import {
    environment
  } from '@env';
  
  @Component({
    moduleId: module.id,
    selector: 'app-disqus-thread',
    templateUrl: `./disqus-thread.component.html`,
    styleUrls: [`./disqus-thread.component.css`]
  })
  
  @Injectable()
  export class DisqusThreadComponent { //implements OnInit
  
    // The unique identifier for the page
    public identifier: string;
  
    // Your Disqus shortname
    private shortname = environment.appName;
  
    private isLoaded = false;
    private isReloaded = false;
  
    // Create new Disqus script
    // @param {any}        document
    // @param {MockWindow} window
    // @param {Location}   location
    constructor(
      @Inject(DOCUMENT) private document: any,
      @Inject(WINDOW) private window: DisqusMockWindow,
      private location: Location
    ) {}
  
    //   Reset Disqus with new information.
    public reset() {
        this.window.DISQUS.reset({
          reload: true,
          config: this.getConfig()
        });
    }
  
    //  Component on init
    public init() {
      if (this.window.DISQUS === undefined && !this.isLoaded) {
        this.addScriptTag();
        this.isLoaded = true;
        this.isReloaded = false;
      } else if (this.window.DISQUS && !this.isReloaded) {
          this.reset();
          this.isReloaded = true;
      }
    }
  
    // Get Disqus config
    // @return {Function}
    private getConfig(): () => void {
      const self = this;
      return function() {
        this.page.url = self.document.URL;
        this.page.identifier = self.identifier;
        this.language = 'en';
      };
    }
  
    //  Add the Disqus script to the document.
    private addScriptTag() {
      this.window.disqus_config = this.getConfig();
      const container = this.getScriptContainer();
      const script = this.buildScriptTag(`https://${this.shortname}.disqus.com/embed.js`);
      container.lastChild.appendChild(script);
    }
  
    // Get the HEAD element
    // @return {HTMLHeadElement}
    private getScriptContainer(): HTMLHeadElement {
      return this.document.head;
    }
  
    // Build the Disqus script element.
    // @param  {string} src
    // @return {HTMLElement}
    private buildScriptTag(src: string): HTMLElement {
      const script = this.document.createElement('script');
      script.setAttribute('src', src);
      script.setAttribute('async', 'true');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('data-timestamp', new Date().getTime().toString());
      return script;
    }
  }
  