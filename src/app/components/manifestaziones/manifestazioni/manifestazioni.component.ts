import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from '../../../services/manifestazione.service';

// classi
import { Manifestazione} from '../../../classes/Manifestazione';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-manifestazioni',
  templateUrl: './manifestazioni.component.html',
  styleUrls: ['./manifestazioni.component.css']
})
export class ManifestazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public manifestazioni: Manifestazione[] = [];
  public manifestazione: Manifestazione;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Manifestazioni";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Aperte',
    'Non Aperte',
    'Chiuse'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private manifService: ManifestazioneService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
            this.goApplication();
           }


           goApplication() {
            this.loadManifestazioni();
        }




        async loadManifestazioni() {

          //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
          this.trovatoRec = false;
          this.nRec = 0;
          this.isVisible = true;
          let rc =  await  this.manifService.getAll().subscribe(
               res => {
                  this.manifestazioni = res['data'];
                  this.nRec = res['number'];
                  this.trovatoRec = true;
                  this.Message = 'Situazione Attuale';
                  this.alertSuccess = true;
              },
              error => {
                 alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
        }

/*
   Show a notification

   @param {string} type Notification type
   @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
// alert('sono in showNot - ' + message);
this.notifier.notify( type, message );
console.log(`sono in showNotification  ${type}`);
}


Nuovo() {
  this.router.navigate(['manif/new']);
}

onSelectionChange(tipo: string)   {

  this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta === '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
      return;
    }

  switch (this.tipoRichiesta) {
              case 'Tutte':
              this.loadManifestazioni();
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Aperte':
                this.stato = 1;
                this.loadbyStato(this.stato);
                break;
              case 'Non Aperte':
                this.stato = 0;
            //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.loadbyStato(this.stato);
                break;
              case 'Chiuse':
                //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.stato = 2;
                this.loadbyStato(this.stato);
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
     }
  }


  async loadbyStato(stato: number) {


    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    let rc = await  this.manifService.getManifbyStato(stato).subscribe(
         res => {
              this.manifestazioni = res['data'];
              this.nRec = res['number'];
              this.trovatoRec = true;
              this.alertSuccess = true;
              if(res['number'] > 0) {
                this.Message = 'Situazione Attuale';
              } else {
                this.nRec = 0;
                this.Message = res['message'];
              }
        },
        error => {
           alert('Manifestazioni  -- loadManifestazionibyStato - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        });
  }




}


/*




@Component({
  selector: 'app-manifestazioni',
  templateUrl: './manifestazioni.component.html',
  styleUrls: ['./manifestazioni.component.css']
})
export class ManifestazioniComponent implements OnInit {






  // ------   popup per canc

// -----------------------------





/*
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





ellazione

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

cancellazioneCompleted(user:User) {
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





}



*/
