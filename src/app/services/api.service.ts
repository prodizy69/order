import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

constructor(private http: HttpService) { }

getHistory() {
  return this.http.request({method: 'get', url: 'config/data.json'});
}

getDetails() {
  return this.http.request({method: 'get', url: 'config/details.json'});
}

}
