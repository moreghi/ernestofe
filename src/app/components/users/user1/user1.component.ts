import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService} from '../../../services/user.service';
import { User } from '../../../classes/User';
import { environment } from '../../../../environments/environment';

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

  private rotta = "/upload/files/users/";
  public APIURLUser = '';

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server
//  src="http://localhost:3000/upload/files/users/{{user.photo}}"

 public APIURL = environment.APIURL + this.rotta;

  ngOnInit(): void {

    console.log('user1 -- oninit -- letto user: ' + JSON.stringify(this.user));
    this.APIURLUser = this.APIURL + this.user.photo;
   // this.displaydate();


  }

/*
  displaydate() {
    this.APIURLUser = this.APIURL + this.user.photo;
    console.log('user1 ---- onInit - ' + this.APIURLUser);
  }

*/


}
