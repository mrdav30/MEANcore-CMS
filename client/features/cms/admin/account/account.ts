export class Account {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public password: string;
    public created: string;
    public displayName: string;
    public about: string;
    public avatarUrl: string;

    constructor() {
        this.password = '';
        this.email = '';
        this.about = '';
        this.avatarUrl = '';
    }
}
