import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {

  }

  request(options: any): Observable<any> {
    const url = options.url;
    if (options.method === 'post') {
      return this.http.post(url, options.body);
    } else if (options.method === 'get') {
      return this.http.get(url, { params: options.search });
    } else if (options.method === 'delete') {
      return this.http.delete(url, { params: options.search });
    } else if (options.method === 'put') {
      return this.http.put(url, options.body);
    }
  }
}
