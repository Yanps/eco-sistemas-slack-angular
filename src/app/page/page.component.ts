import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SlackService } from '../commons/services/slack.service';
import { EmployeeService } from '../commons/services/employee.service';
import { OccupationsService } from '../commons/services/occupations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @ViewChild('search', {static: false}) search: ElementRef<HTMLInputElement>; 

  public users: any = [];

  public onlineUsers: any = [];

  public offlineUsers: any = [];

  public usersInMemory: any;

  public occupationId: number = -1;

  public seeMore: boolean = true;

  public loading: boolean = true;

  public occupations: any = [];

  private finalizeLoader: false;

  public employees = [];


  constructor(
    private slackService: SlackService,
    private employeeService: EmployeeService,
    private occupationsService: OccupationsService,
    private router:  Router,
    private activatedRoute: ActivatedRoute
  ) {

    const params = this.activatedRoute.snapshot.params;
    const teamName = params.teamName;


    this.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });

  
    if (teamName === 'geral' || teamName === 'times') {
      this.initComponent();
      return;
    } 
      
    this.initComponent(teamName);



  }

  ngOnInit(): void {


  }


  ngAfterViewInit(): void {
  }


  initComponent(team?: any) {
    this.slackService.getUsersList().subscribe(response => {
      this.usersInMemory = response.members;
      this.users =  this.usersInMemory;

      this.setUsersStatus(this.users);
    });

    this.getOccupations(team);
  }


  getOccupations(team?: string) {
    this.occupationsService.getOccupations().subscribe(occupations => {
      
      let teamName;
      let teamId;
      
      this.occupations = occupations;

      if (team) {
        teamName = team.replace('-', '. ');
        teamId = this.occupations.find(occupation => occupation.name.toLowerCase() === teamName);

        // this.occupationId = teamId;
        // this.setEmployeesFromTeam(teamId);
      }

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

      this.setSearch();

    });
  }


  goToUser(userId) { 
    window.open(`https://ecosistemasworkspace.slack.com/team/${userId}`, '_blank');
  }


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


  changeOccupation(occupation) {
    const name = occupation.occupationName;
    
    this.occupationId = occupation.occupationId;
    
    this.router.navigateByUrl(`/${name}`);


    if (this.occupationId <= 0) {
      this.setGeneralTeam(this.occupationId)
    }

    if (this.occupationId > 0) {
      this.setEmployeesFromTeam(this.occupationId);
    } 
  
  }

  setGeneralTeam(occupationId?) {
    this.users = this.usersInMemory;
    this.onlineUsers = this.users.filter(user => user.presence === 'active');
    this.offlineUsers = this.users.filter(user => user.presence === 'away');

    if (occupationId === 0) {
      this.setSearch();
    }

  }

  setSearch() {

    console.log('setSearch')

    fromEvent<any>(this.search.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        distinctUntilChanged(),
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

  getTotalPercentByTeam(users, occupationId, otherUsers) {
    const totalUsers = this.getTotalByTeam(users, occupationId);
    const totalOtherUsers = this.getTotalByTeam(otherUsers, occupationId);
    const total = totalUsers + totalOtherUsers;
    const percent = (totalUsers * 100) / total;
    return isNaN(percent) ? 0 : percent.toFixed(0);
  }


  getTotalByTeam(users, occupationId) {
    const filteredEmployees = this.employees.filter(employee => employee.occupation_id === occupationId);
    const filteredUsers = users.filter(user => filteredEmployees.find(employee => employee.email === user.profile.email)) || [];

    return filteredUsers.length;
  }
 

}

