import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractRestService, HandleErrorService } from '../../../utils';

@Injectable()
export class PagesService extends AbstractRestService {
    constructor(http: HttpClient, _handleErrorService: HandleErrorService) {
        super(http, '/admin/pages', _handleErrorService);
    }
}
