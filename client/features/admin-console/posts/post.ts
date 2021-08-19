import moment from 'moment';

export class Post {
    public postId: string;
    public title: string;
    public slug: string;
    public summary: string;
    public body: string;
    public tags: string[];
    public publishDate: any;
    public thumbnailUrl: string;
    public url: string;
    public publish: boolean;
    public authorId: string;
    public readTime: number;

    constructor() {
        this.thumbnailUrl = '';
        this.body = null;
        this.publishDate = moment().format('YYYY-MM-DD');
        this.publish = true;
    }
}
