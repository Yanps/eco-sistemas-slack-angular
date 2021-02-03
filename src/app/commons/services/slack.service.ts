import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SlackService {

  private apiURL: string = 'http://localhost:8888/api/v1/';

  constructor(private HttpClient: HttpClient) { }

  public getUsersList() {
    const endpoint = `${this.apiURL}users`;
    return this.HttpClient.request<any>('get', endpoint);
  }

  public getUserPresence(userId: string) {
    const endpoint = `${this.apiURL}users/${userId}`;
    return this.HttpClient.request<any>('get', endpoint);
  }

}
