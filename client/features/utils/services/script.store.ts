import { environment } from '../../../environments/environment';

interface Scripts {
    name: string;
    src: string;
    async?: boolean;
}

// src can be either local or hosted
export const ScriptStore: Scripts[] = [
    // embedly required to render oembed content
    { name: 'embedly', src: 'https://cdn.embedly.com/widgets/platform.js', async: true },
    { name: 'gtag', src: 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsID, async: true }
];
