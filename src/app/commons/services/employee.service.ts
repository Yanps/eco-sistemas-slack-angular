import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  
  private apiURL: string = 'https://calm-escarpment-52868.herokuapp.com/api/v1/';

  constructor(private HttpClient: HttpClient) { }


  public getEmployeesByTeam(teamId: number) {
    const endpoint = `${this.apiURL}employee/team/${teamId}`;
    return this.HttpClient.request<any>('get', endpoint);
  }
}
