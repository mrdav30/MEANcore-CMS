export class PostDetails {
    public _id: string;
    public thumbnailUrl: string;
    public title: string;
    public slug: string;
    public summary: string;
    public body: string;
    public tags: string[];
    public slugTags: string[];
    public perma_link: string;
    public publishDate: any;
    public publish: boolean;
    public url: string;
    public author: Author;
    public views: string;

    constructor() {
        this.thumbnailUrl = '';
        this.author = new Author();
    }
}

export class Author {
    public authorName: string;
    public authorAbout: string;
    public authorEmail: string;
    public authorAvatar: string;

    constructor() {
        this.authorName = '';
        this.authorAbout = '';
        this.authorEmail = '';
        this.authorAvatar = '';
    }
}
