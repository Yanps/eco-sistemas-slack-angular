import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SlackService } from './commons/services/slack.service';
import { EmployeeService } from './commons/services/employee.service';
import forAsync from 'for-async';
import { KeyValue } from '@angular/common';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { trigger } from '@angular/animations';
import { OccupationsService } from './commons/services/occupations.service';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('search', {static: false}) search: ElementRef<HTMLInputElement>; 

  public users: any = [];

  public onlineUsers: any = [];

  public offlineUsers: any = [];

  public usersInMemory: any;

  public occupationId: number = 0;

  public seeMore: boolean = false;

  public loading: boolean = true;

  public occupations: any = [];

  private finalizeLoader: false;


  constructor(
    private slackService: SlackService,
    private employeeService: EmployeeService,
    private occupationsService: OccupationsService
  ) {}

  ngOnInit(): void {

    this.slackService.getUsersList().subscribe(response => {
      this.usersInMemory = response.members;
      this.users =  this.usersInMemory;

      this.setUsersStatus(this.users);
    });

    this.getOccupations();

  }


  ngAfterViewInit(): void {

    fromEvent<any>(this.search.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        distinctUntilChanged()
      ).subscribe(searchTerm => {

        this.onlineUsers = this.users.filter(user => {
          const searchMatch = user.profile.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;

          if (searchMatch && user.presence === 'active') {
            return true;
          }

        })

        this.offlineUsers = this.users.filter(user => {
          const searchMatch = user.profile.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;

          if (searchMatch && user.presence === 'away') {
            return true;
          }

        })

      });

  }


  getOccupations() {
    this.occupationsService.getOccupations().subscribe(occupations => {
      this.occupations = occupations;
    });
  }


  setUsersStatus(users: any) {
    
    for (let i=0; i<users.length; i+=1) {

      const key = users[i];

      if (key.id && !key.presence) {
        this.slackService.getUserPresence(key.id).subscribe(userPresence => {
          
          const presence = userPresence.presence;
          
          if (this.users[i]) {
            const user = this.users[i];
          
            user.presence = presence;
            this.setUsersByPresence(user, presence);
          }

          this.finishingLoader(i, users);



        }, 
        error => {
          this.users.splice(i, 1);
          this.finishingLoader(i, users);
        }),
        () => this.finishingLoader(i, users)

      }

    }
    
  }


  finishingLoader(idx, users) {
    const totalUsers = this.users.length;
    const totalOnlineUsers = this.onlineUsers.length;
    const totalOfflineUsers = this.offlineUsers.length;

    // console.log(totalUsers, totalOnlineUsers, totalOfflineUsers);

    if (totalUsers === (totalOnlineUsers + totalOfflineUsers)) {
      this.loading = false;
    }

    if (idx === users.length -1) {
      this.loading = false;
    }

  }


  setUsersByPresence(user, presence) {
  
    if (presence === 'active') {         
      this.onlineUsers.push(user);
    } else {
      this.offlineUsers.push(user);
    }
    
  }


  getAllEmployees() {
    return this.employeeService.getEmployees();
  }


  setEmployeesFromTeam(teamId) {
    this.employeeService.getEmployeesByTeam(teamId).subscribe(employees => {
      const filteredEmployees = [];

      for (let i=0; i<employees.length; i+=1) {
        const empl = employees[i];
        const user = this.usersInMemory.find(user => user.profile.email === empl.email);

        if (user) {
          filteredEmployees.push(user);
        }

      }

      this.users = filteredEmployees;

      this.onlineUsers = filteredEmployees.filter(user => user.presence === 'active');
      this.offlineUsers = filteredEmployees.filter(user => user.presence === 'away');

    });
  }


  goToUser() {}


  checkUserStatus(userId) {
    const user = this.users.find(user => user.id === userId) || {};
    return {
      'active': user.presence === 'active',
      'blink': user.presence === 'active'
    };
  }


  orderUsers(users, property) {
    
    function compare( a, b ) {
      if ( a['profile'][property] < b['profile'][property] ){
        return -1;
      }
      if ( a['profile'][property] > b['profile'][property] ){
        return 1;
      }
      return 0;
    }
    
    return users.sort( compare )
  }


  getTotalPercent(users) {
    const percent = ( users.length * 100 ) / this.users.length;
    return  isNaN(percent) ? 0 : percent.toFixed(0);
  }


  changeOccupation($event) {
    this.occupationId = $event;
    
    if (this.occupationId !== 0) {
      this.setEmployeesFromTeam(this.occupationId);
    } else {
      this.users = this.usersInMemory;
      this.onlineUsers = this.users.filter(user => user.presence === 'active');
      this.offlineUsers = this.users.filter(user => user.presence === 'away');
    }

  }

    
}