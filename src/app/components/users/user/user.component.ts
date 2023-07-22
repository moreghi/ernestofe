import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Service
import { UserService} from '../../../services/user.service';
import { UserlevelService } from '../../../services/userlevel.service';
// Model Component
import { User} from '../../../classes/User';
import { Userlevel } from '../../../classes/UserLevel';
import { faUserEdit, faTrash, faInfo, faInfoCircle, faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-user]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

   // variabili passate dal componente padre
@Input('user-data') user: User;
@Input('user-prog') i: number;
@Input('functionUser') functionUser: string;


public userlevel: Userlevel;


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
 public navigateInqu = 'Inqu';
 public navigateEdit = 'Edit';
 public navigateEdits = 'Edits';
 public navigateNew = 'New';

 closeResult = '';    // per la cancellazione
 public type = '';

//  fine da users

constructor(private modalService: NgbModal,
            private userService: UserService,
            private userlevelService: UserlevelService,
            private route: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }



ngOnInit(): void {

   //   per gestire eventuale popup
   this.headerPopup = 'Registrazione User';
   this.textMessage1 = '?????????? ';
//   this.textUser = this.messa.demessa;
   this.textMessage2 = 'Registrazione non possibile';

   this.loadUserlevel(this.user.idLevel);
  // this.loadManifestazioni();

}

async loadUserlevel(id: number) {
  console.log('frontend-----user - loadUserLevel: ' + id);
  let rc = await  this.userlevelService.getbyId(id).subscribe(
     response => {
      if(response['rc'] === 'ok') {
        this.userlevel = response['data'];
      }
    },
    error => {
       alert('loadUserlevel: ' + error.message);
       console.log(error);
       this.alertSuccess = false;
       this.Message = error.message;
       this.showNotification( this.type, this.Message);
    });

}

editUserDetail(user) {
  this.function = parseInt(localStorage.getItem('user_ruolo'));
  if(this.function === -1) {
    this.route.navigate(['users/' + this.user.id + '/edit']);
  } else {
    this.route.navigate(['users/' + this.user.id + '/inqu']);
  }
}


navigate(pathNavigate: string, user: User) {

  console.log(`navigate ---- funzione: ${pathNavigate}`);

  switch (pathNavigate) {

       case 'Inqu':
     //  let aa = this.router.navigate(['/users/id/inqu', id]);
     //  console.log('aaaaa ' + aa);

      this.route.navigate(['users/inqu/' + user.id]);
      break;
    case 'Edit':
      this.route.navigate(['users/edit/'  + user.id]);
      break;
    case 'Edits':
      this.route.navigate(['users/edits/'  + user.id]);
      break;
    default:
      alert('scelta errata \n navigazione non possibile');
      break;
  }
}

open(content, user: User) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
    if(result ===  'Cancel click') {
       this.cancellazioneAbort();
    }
    if(result ===  'Delete click') {
      // gestire uscita da popup
      this.cancella(user);
    }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
    this.cancellazioneAbort();
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
}
}

cancellazioneAbort() {
this.type = 'warning';
this.Message = 'cancellazione abbandonata dall utente';
this.showNotification(this.type, this.Message);
}


cancella(user: User) {

this.userService.deleteuser(user.id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      this.isVisible = true;
      this.alertSuccess = true;
      this.type = 'success';
      this.Message = 'Utente cancellato correttamente';
      this.showNotification(this.type, this.Message);
    }
},
error =>
    {
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore cancellazione User' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
    });
}



/*
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
//   alert('sono in showNot - ' + message);
   this.notifier.notify( type, message );
 }



getColor(livello) {
  switch (livello) {
    case -1:
      return 'red';
    case 0:
      return 'blue';
    case 1:
      return 'green';
    case 2:
      return 'orange';
    case 99:
      return 'violet';
    default:
     return 'yellow';
  }
}

}











