import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService} from '../../../services/user.service';
import { User} from '../../../classes/User';
import { faUserEdit, faTrash, faInfo, faInfoCircle, faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-user2]',
  templateUrl: './user2.component.html',
  styleUrls: ['./user2.component.css']
})
export class User2Component implements OnInit {

@Input('user-data') user: User;
@Input('user-prog') i: number;
// icone
faUserEdit = faUserEdit;
faTrash = faTrash;
faInfo = faInfo;
faInfoCircle = faInfoCircle;
faSave = faSave;
faWindowClose = faWindowClose;

// -----
public textMessage1 = '';
public textMessage2 = '';
public textUser = '';
public headerPopup = '';
public perDebug = 'utente passato: ';
public Message = '';
public presenti = false;
public isVisible = false;
public alertSuccess = false;
public function = 0;
public nRec = 0;

// da users

 // variabili per gestione inqu/edit/new

 public href = '';
 public functionInqu = false;
 public functionEdit = false;
 public functionNew = false;
 public functionElenco = false;

 public searchInqu = 'show';
 public searchEdit = 'edit';
 public searchNew = 'new';
 public searchElenco = 'read';

 // funzioni di navigazione
 public navigateInqu = 'inqu';
 public navigateEdit = 'edit';
 public navigateEdits = 'edits';
 public navigateNew = 'new';

 closeResult = '';    // per la cancellazione
 public type = '';

//  fine da users

constructor(private modalService: NgbModal,
            private userService: UserService,
            private route: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }


  ngOnInit(): void {
  }


  navigate(user: User) {



      this.route.navigate(['users/' + user.id + '/inqu']);

    }
  }


