//  attenzione: nuova versione dal 18/01/2022 con gestione abilitazione funzioni



import { Component, OnInit } from '@angular/core';
// service
import { UserService} from '../../../services/user.service';

// Model Class
import { User } from '../../../classes/User';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// icone
import { faTrash, faUserEdit, faSave, faWindowClose, faPlusSquare, faSearch} from '@fortawesome/free-solid-svg-icons';
// router
import { Router, ActivatedRoute } from '@angular/router';
// popup user Modal per gestire inserimento/Modifica/cancellazione con un solo componente
// import { EditUserComponent } from '../../popups/edit-user/edit-user.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // per paginazione
  p: number = 1;

  // icone
  faTrash = faTrash;
  faUserEdit = faUserEdit;
  faSave = faSave;
  faWindowClose = faWindowClose;
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  // variabili per gestione inqu/edit/new

  public href = '';
  public functionInqu = false;
  public functionEdit = false;
  public functionNew = false;
  public functionElenco = false;

  public functionUser = '';

  public searchInqu = 'show';
  public searchEdit = 'edit';
  public searchNew = 'new';
  public searchElenco = 'read';


  // funzioni di navigazione
  public navigateInqu = 'Inqu';
  public navigateEdit = 'Edit';
  public navigateEdits = 'Edits';


  // variabili per notifica esito operazione con Notifier
  public type = '';
  public Message = '';

  closeResult = '';

  options = [
    'Tutti',
    'Anonimi',
    'Pers. Sanfra'
  ];

  public searchText = '';

  public trovatoRec = false;
  public nRec = 0;
  public tipoRichiesta = '?';
  public validSearch = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

  // per gestione abilitazione funzioni con service Moreno


  public rotta = '';
  public rottaId = 0;
  public level = 0;



  constructor(private userService: UserService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

  public isVisible = false;
  public alertSuccess = false;


  // risultato della lettura da backend
  public users: User[] = [];
  public user: User;

  /*   legenda typo messaggio esito

    this.type = 'error';    --- operazione in errore
    this.type = 'success';  --- operazione conclusa correttamente
    this.type = 'default';
    this.type = 'info';
    this.type = 'warning';

   */

  errormsg: any;



  ngOnInit(): void {
    this.router.url;
    this.href = this.router.url;

   //    this.checkFunctionbylevel();   da eliminare


    this.functionUser = localStorage.getItem('functUser');


    this.goApplication();






    // test
    /*
    this.testRuoloday = -1; // ----------------------------------------   test   test   test  test
    localStorage.setItem('user_ruolo', String(this.testRuoloday));

    if(this.testRuoloday === -1) {
      this.functionUser = this.navigateEdits;
    }
    if(this.testRuoloday === 0) {
      this.functionUser = this.navigateInqu;
    }
    if(this.testRuoloday === 1) {
      this.functionUser = this.navigateEdit;
    }
*/

/*
    this.loadAllUser();
    this.user = new User();
    */
   }




    goApplication() {
       // parte personalizzata
       this.loadAllUser();
       this.user = new User();

    }










   loadAllUser() {
    this.isVisible = true;
    this.userService.getAllUsers().subscribe(
     res =>{
      console.log(res,'res-->');
      this.users = res['data'];
      this.nRec = res['number'];
      this.trovatoRec = true;
      this.Message = res.message;  // 'Situazione Attuale';
      this.alertSuccess = true;
      // esito operazione

      this.type = 'success';
      this.Message = 'situazione attuale utenti';
      this.showNotification(this.type, this.Message);
    },
    error => {
      alert('Users  -- loadUsers - errore: ' + error.message);
      console.log(error);
      this.type = 'error';
      this.Message = error.message;
      this.alertSuccess = false;
   });
  }


  delete(id:any) {
    console.log(id,'cancelllllllllllllllllllllllo --->');
    this.userService.deleteuser(id).subscribe((res)=> {
      console.log(res,'res- delete -->');

      this.type = 'error';
      this.Message = res.message;
      this.showNotification(this.type, this.Message);
    });
  }


  update(user:User) {
    console.log('update - da fare');
  }




  /*     versione con popup
update(user:User) {
  console.log(`vado a aggiornare i campi di utente ${user.id}`);
  localStorage.setItem('popupUser', 'E');
    const ref = this.modalService.open(EditUserComponent, {size:'lg'});
    ref.componentInstance.selectedUser = user;

  // esito della pressione dei tasti  ok o cancel
    ref.result.then(
      (yes) => {
          console.log('    ....... premuto ok da popup');
      },
      (cancel) => {
        console.log('premuto cancel da popup');
      }
    );





    // esito operazione

    this.type = 'error';
    this.Message = 'devo fare modifica';
    this.showNotification(this.type, this.Message);
}
 */


/**
* Show a notification
*
* @param {string} type Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  }

// ------   popup per cancellazione

open(content:any, user:User) {
  console.log(`open_content - user ${user.cognome}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + user.id + ' - ' + user.cognome + '' + user.nome );
   //this.cancellaProdotto(this.prodotto);
   this.delete(user.id);
   this.cancellazioneCompleted(user);
   // per riaggiornare elenco
   window.location.reload();

  }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
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

  cancellazioneCompleted(user: User) {
    this.type = 'success';
    this.Message = `cancellazione dall utente ${user.cognome}  ${user.nome} eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }


  navigate(pathNavigate: string, id: number) {

      console.log(`navigate ---- funzione: ${pathNavigate}`)


      switch (pathNavigate) {

           case 'inqu':
         //  let aa = this.router.navigate(['/users/id/inqu', id]);
         //  console.log('aaaaa ' + aa);

          this.router.navigate(['users/' + id + '/inqu']);
          break;
        case 'edit':
          this.router.navigate(['users/' + id + '/edit']);
          break;
        case 'edits':
          this.router.navigate(['users/' + id + '/edits']);
          break;
        default:
          alert('scelta errata \n navigazione non possibile');
          break;
      }
  }


// imposto il filtro di ricerca dei fedeli
onSelectionChange(tiruolo: string)   {


  this.tipoRichiesta = tiruolo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta === '?') {
    this.validSearch = false;
    alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
    return;
    }  else {

          switch (this.tipoRichiesta) {
              case 'Tutti':
              this.loadAllUser();
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Pers. Sanfra':
                this.loadUsersSanfra();
                break;
              case 'Anonimi':
            //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.loadUsersAnonimus();
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
        }
      }

  }

  async loadUsersAnonimus() {
    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    this.ruoloSearch = 0;
    const ret = await  this.userService.getUserbyTipo(this.ruoloSearch).subscribe(
      // sentire hidran per lettura particolare
     // this.fedeleService.getFedeliforMessa(id).subscribe(
        res => {
            this.users = res['data'];
            this.nRec = res['number'];
            this.trovatoRec = true;
            this.Message = 'Situazione Attuale';
            this.alertSuccess = true;
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Users  -- loadUsersAnonimi - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }


  async loadUsersSanfra() {
    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    this.ruoloSearch = 1;   // imposto un ruolo diverso da 0 per recuperrare il personale sanfra
    const ret = await  this.userService.getUserbyTipo(this.ruoloSearch).subscribe(
      // sentire hidran per lettura particolare
     // this.fedeleService.getFedeliforMessa(id).subscribe(
        res => {
            this.users = res['data'];
            this.nRec = res['number'];
            this.trovatoRec = true;
            this.Message = 'Situazione Attuale';
            this.alertSuccess = true;
       //     alert('Manifestazioni   -- loadManifestazioni :  fine ok ');
         },
        error => {
           alert('Users  -- loadUserSanfra - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        }
      )
  }

  NuovoUser() {
    this.router.navigate(['users/new']);
  }

/*


   checkFunctionbylevel() {
    // this.enabledFunc = false;
     //   parte pubblica
    this.rotta = this.route.snapshot.url[0].path;
    this.level = parseInt(localStorage.getItem('user_ruolo'));
    console.log('checkFunctionbylevel -  rotta: ' + this.rotta + ' level: ' + this.level);

    // effettuo la lettura su abilfunctione per vedere la funzione abilitata per il modulo e il profilo
    this.ctrfuncService.getfuncbyProfilo(this.level, this.rotta).subscribe(
      res =>{
       console.log(res,'res-->');
       if(res['rc'] === 'ko')  {
        this.type = 'error';
        this.Message = res['message'];
        this.showNotification(this.type, this.Message);
        return;
       }
       if(res['rc'] === 'ok') {
          if(res['number'] !== 1) {
            this.type = 'error';
            this.Message = 'Modulo non ancona habilitation';
            this.showNotification(this.type, this.Message);
          }  else {
            this.functionUser = res['data'];
            //   parte pubblica   --  fine
            console.log('checkFunctionbylevel - funzione determinata: ' + this.functionUser);
            // parte personalizzata
            this.loadAllUser();
            this.user = new User();
          }
        }
     },
     error => {
       alert('Users  -- loadUsers - errore: ' + error.message);
       console.log(error);
       this.type = 'error';
       this.Message = error.message;
       this.alertSuccess = false;
    });



*/

}
