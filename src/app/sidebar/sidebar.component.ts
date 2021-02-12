import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input('occupations') occupations;

  @Input('users') users: any = [];

  @Output('changeOccupation') changeOccupation = new EventEmitter(); 


  public active: number = -1; 

  constructor() { }

  ngOnInit(): void {
  }

  changeOccupations(occupationId) {
    this.active = occupationId;
    this.changeOccupation.emit(occupationId);
  }

  

}
