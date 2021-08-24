export class PostDetails {
    public _id: string;
    public thumbnailUrl: string;
    public title: string;
    public slug: string;
    public summary: string;
    public body: string;
    public tags: string[];
    public slugTags: string[];
    public permaLink: string;
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
    public name: string;
    public about: string;
    public email: string;
    public avatar: string;

    constructor() {
        this.name = '';
        this.about = '';
        this.email = '';
        this.avatar = '';
    }
}
