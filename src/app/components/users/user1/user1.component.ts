import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService} from '../../../services/user.service';
import { User } from '../../../classes/User';

@Component({
  selector: 'tr[app-user1]',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css']
})
export class User1Component implements OnInit {

     // variabili passate dal componente padre
@Input('user-data') user: User;
@Input('user-prog') i: number;


  constructor(private userService: UserService) { }

  public users: User[] = [];

  ngOnInit(): void {

  }

}
