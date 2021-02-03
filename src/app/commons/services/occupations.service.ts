import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OccupationsService {

  private apiURL: string = 'http://localhost:8888/api/v1/';

  constructor(private HttpClient: HttpClient) { }


  public getOccupations() {
    const endpoint = `${this.apiURL}occupations`;
    return this.HttpClient.request<any>('get', endpoint);
  }

}
