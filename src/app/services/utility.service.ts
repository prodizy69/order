import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable()
export class UtilityService {
    env: string;
    baseUrl;
    CONFIG;

    constructor() {
        this.env = environment.env;
        switch (this.env.toLowerCase()) {
            case 'local':
                this.baseUrl = 'http://localhost';
                break;
            case 'dev':
                this.baseUrl = 'https://www.dev.cvs.com/';
                break;
            case 'test':
                this.baseUrl = 'https://www.qa.cvs.com/';
                break;
            case 'prod':
                this.baseUrl = 'https://www.cvs.com/';
                break;
        }
        this.CONFIG = this.API_CONFIG();

    }

    API_CONFIG() {
        let response = {};
        response = {
            microservices: {
                details: { url: this.baseUrl + '' },
                history: {url: this.baseUrl + ''}
            }
        };
        return response;
    }


}

