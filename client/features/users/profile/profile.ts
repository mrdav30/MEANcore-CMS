export class Profile {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public password: string;
    public created: string;
    public displayName: string;
    public workplace: string;
    public location: string;
    public education: string;
    public about: string;
    public avatarUrl: string;
    public twitterUrl: string;
    public facebookUrl: string;
    public githubUrl: string;
    public linkedinUrl: string;
    public stackOverflowUrl: string;
    public personalUrl: string;

    constructor() {
        this.password = '';
        this.email = '';
        this.about = '';
        this.avatarUrl = '';
    }
}
