import * as moment from 'moment';

export class Page {
    public _id: number;
    public title: string;
    public slug: string;
    public description: string;
    public body: string;
    public publish: boolean;
    public authorId: string;

    constructor() {
        this.body = null;
        this.publish = true;
    }
}
