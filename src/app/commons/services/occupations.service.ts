import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OccupationsService {

  private apiURL: string = 'https://calm-escarpment-52868.herokuapp.com/api/v1/';

  constructor(private HttpClient: HttpClient) { }


  public getOccupations() {
    const endpoint = `${this.apiURL}occupations`;
    return this.HttpClient.request<any>('get', endpoint);
  }

}
