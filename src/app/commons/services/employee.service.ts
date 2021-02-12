import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  
  private apiURL: string = 'https://calm-escarpment-52868.herokuapp.com/api/v1/';

  constructor(private HttpClient: HttpClient) { }


  public getEmployees() {
    const endpoint = `${this.apiURL}employees`;
    const localEmployees = localStorage.getItem('employees') || null;

    if (localEmployees) {
      return of(JSON.parse(localEmployees));
    }

    return this.HttpClient.request<any>('get', endpoint)
      .pipe(
        tap(employees => localStorage.setItem('employees', JSON.stringify(employees)))
      )
      
  }

  public getEmployeesByTeam(teamId: number) {
    const endpoint = `${this.apiURL}employee/team/${teamId}`;
    return this.HttpClient.request<any>('get', endpoint);
  }
}
