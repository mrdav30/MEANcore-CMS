import moment from 'moment';

export class Post {
    public _id: string;
    public title: string;
    public slug: string;
    public summary: string;
    public body: string;
    public tags: string[];
    public publishDate: any;
    public updated: any;
    public thumbnailUrl: string;
    public urlStructure: string;
    public url: string;
    public publish: boolean;
    public authorId: string;
    public readTime: number;
    public unpublishedChanges: boolean;
    public publishChanges: boolean;
    public parentId: string;
    public childId: string;

    constructor() {
        this.thumbnailUrl = '';
        this.body = null;
        this.publishDate = moment().format('YYYY-MM-DD');
        this.updated = moment().format('YYYY-MM-DD');
        this.publish = true;
        this.urlStructure = 'date';
    }
}
