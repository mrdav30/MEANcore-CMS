import { Injectable, Component, Input, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW, DisqusMockWindow } from './disqus-window';

@Component({
    moduleId: module.id,
    selector: 'app-disqus-thread',
    templateUrl: `./disqus-thread.component.html`,
    styleUrls: [`./disqus-thread.component.css`]
})

@Injectable()
export class DisqusThreadComponent implements OnInit {
    /**
      * The unique identifier for the page
      */
    @Input()
    public identifier: string;

    /**
     * Your Disqus shortname
     */
    @Input()
    public shortname: string;

    /**
     * Create new Disqus script
     * @param {any}        document
     * @param {MockWindow} window
     * @param {Location}   location
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        @Inject(WINDOW) private window: DisqusMockWindow,
        private location: Location
    ) { }

    //  Component on init
    ngOnInit() {
        if (this.window.DISQUS === undefined) {
            this.addScriptTag();
        } else {
            this.reset();
        }
    }

    /**
     * Get Disqus config
     * @return {Function}
     */
    public getConfig(): () => void {
        let _self = this;
        return function () {
            this.page.url = _self.document.URL;
            this.page.identifier = _self.identifier;
            this.language = 'en';
        };
    }


    //   Reset Disqus with new information.
    private reset() {
        this.window.DISQUS.reset({
            reload: true,
            config: this.getConfig()
        });
    }


    //  Add the Disqus script to the document.
    private addScriptTag() {
        this.window.disqus_config = this.getConfig();
        let container = this.getScriptContainer();
        let script = this.buildScriptTag(`https://${this.shortname}.disqus.com/embed.js`);
        container.lastChild.appendChild(script);
    }

    /**
     * Get the HEAD element
     * @return {HTMLHeadElement}
     */
    private getScriptContainer(): HTMLHeadElement {
        return this.document.head;
    }

    /**
     * Build the Disqus script element.
     * @param  {string} src
     * @return {HTMLElement}
     */
    private buildScriptTag(src: string): HTMLElement {
        let script = this.document.createElement('script');
        script.setAttribute('src', src);
        script.setAttribute('async', 'true');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('data-timestamp', new Date().getTime().toString());
        return script;
    }
}
