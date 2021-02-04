import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { SlackService } from './commons/services/slack.service';
import { OccupationsService } from './commons/services/occupations.service';
import forAsync from 'for-async';
import { EmployeeService } from './commons/services/employee.service';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('search', {static: false}) search: ElementRef<HTMLInputElement>; 

  public users: any = [];

  public occupations: any;

  public usersInMemory: any;

  public occupationId: number = 4;

  constructor(
    private slackService: SlackService,
    private occupationsService: OccupationsService,
    private employeeService: EmployeeService) {
  }

  ngOnInit() {
    
    this.slackService.getUsersList().subscribe(response => {     
      this.usersInMemory = response.members;
      this.setEmployeesFromTeam(this.occupationId);     
    });

    this.getOccupations();

    
  }

  ngAfterViewInit() {
    
    fromEvent<any>(this.search.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        distinctUntilChanged()
      ).subscribe(searchTerm => {

        this.users = this.usersInMemory.filter(user => user.profile.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);

      });

  }


  checkUserStatus(userId) {
    const user = this.users.find(user => user.id === userId) || {};
    return user.presence;
  }


  getOccupations() {
    this.occupationsService.getOccupations().subscribe(occupations => {
      this.occupations = occupations;
    });
  }

  getEmployees(teamId: number) {
    return this.employeeService.getEmployeesByTeam(teamId);
  }

  changeOccupation($event) {
    this.users = [];
    this.occupationId = $event;
    this.setEmployeesFromTeam($event);
  }

  setEmployeesFromTeam(teamId: number) {

    this.getEmployees(this.occupationId).subscribe(employees => {
        
      for (let i=0; i<employees.length; i+=1) {
        const employee = employees[i];
        const user =  this.usersInMemory.find(user => user.profile.email === employee.email) || {};
        
        this.users[i] = user; 
      }

      forAsync(this.users, (key, index) => {

        
        if (key.online === undefined && key.id) {


          this.slackService.getUserPresence(key.id).subscribe(presence => {
            this.users[index].presence = presence.presence;
          });
        }

      });

    });

  }

  getTotalPresence(type: string) {
    const presence = this.users.filter(user => user.presence === type) || [];
    return presence.length;
  }


  getPercent(type: string) {
    const presence = this.users.filter(user => user.presence === type) || [];
    const percent = ( presence.length * 100 ) / this.users.length;

    return  percent.toFixed(0);
  }


  goToUser(userId) {
    location.href = `https://ecosistemasworkspace.slack.com/team/${userId}`
  }

}
