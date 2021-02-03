import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  
  private apiURL: string = 'http://localhost:8888/api/v1/';

  constructor(private HttpClient: HttpClient) { }


  public getEmployeesByTeam(teamId: number) {
    const endpoint = `${this.apiURL}employee/team/${teamId}`;
    return this.HttpClient.request<any>('get', endpoint);
  }
}
