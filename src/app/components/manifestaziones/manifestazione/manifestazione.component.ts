import { Component, Input, OnInit } from '@angular/core';
import { ManifestazioneService} from '../../../services/manifestazione.service';
import { Manifestazione} from '../../../classes/Manifestazione';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'tr[app-manifestazione]',
  templateUrl: './manifestazione.component.html',
  styleUrls: ['./manifestazione.component.css']
})
export class ManifestazioneComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('manif-data') manif: Manifestazione;
   @Input('manif-prog') i: number;


   faUserEdit = faUserEdit;
   faTrash = faTrash;
   faInfo = faInfo;
   faInfoCircle = faInfoCircle;
   faList = faList;
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faChartPie = faChartPie;

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

   public utenteFedele = false;

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
   public navigateDays = 'Days';
   public navigateGraficoDays = 'GraphDays';

   public messagenull = 'Nessun record presente !!!';
   public pathimageRosso = environment.APIURL + '/upload/files/generic/rosso.jpg';
   public pathimageVerde = environment.APIURL + '/upload/files/generic/verde.jpg';
   closeResult = '';

// variabili per notifica esito operazione con Notifier
  public type = '';



   constructor(private manifService: ManifestazioneService,
               private modalService: NgbModal,
               private route: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                this.notifier = notifier;
              }




   ngOnInit(): void {

      //   per gestire eventuale popup
      this.headerPopup = 'Registrazione Manifestazione';
      this.textMessage1 = '?????????? ';
   //   this.textUser = this.messa.demessa;
      this.textMessage2 = 'Registrazione non possibile';

      // this.loadManifestazioni();

   }


   editUserDetail(manif) {
    this.function = parseInt(localStorage.getItem('user_ruolo'));
    if(this.function === -1) {
      this.route.navigate(['users/' + this.manif.id + '/edit']);
    } else {
      this.route.navigate(['users/' + this.manif.id + '/inqu']);
    }
  }


  navigate(pathNavigate: string, manif: Manifestazione) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${manif.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['manif/edit/' + manif.id]);
        break;
      case 'Days':
        this.route.navigate(['manif/' + manif.id]);
        break;
      case 'GraphDays':
        this.route.navigate(['manif/grafico/day/' + manif.id]);
        break;
      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


  naviga(manif: Manifestazione) {
let aa = 'manif/grafico/day/' + manif.id;
console.log('path per grafico: ' + aa);
return;
    this.route.navigate(['manif/grafico/day/' + manif.id]);
  }



// -------------------------------------------

open(content:any, manif:Manifestazione) {
  console.log(`open_content - user ${manif.descManif}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + manif.id + ' - ' + manif.descManif );
   //this.cancellaProdotto(this.prodotto);
   this.delete(manif);
   this.cancellazioneCompleted(manif);
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

  cancellazioneCompleted(manif:Manifestazione) {
    this.type = 'success';
    this.Message = `cancellazione della Manifestazione ${manif.descManif}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  async delete(manif: Manifestazione) {
    console.log('cancelllllllllllllllllllllllo ---> ' + JSON.stringify(manif));

    const ret = await this.manifService.delete(manif).subscribe(
       res => {
            if(res['rc'] === 'ok')  {
              this.type = 'success';
              this.Message = 'Manifestazione cancellata correttamente';
              this.alertSuccess = true;
              this.showNotification(this.type, this.Message);
            } else {
              this.type = 'error';
              this.Message = res['message'];
              this.showNotification(this.type, this.Message);
            }
        },
        error => {
           alert('Users  -- loadUserSanfra - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        })
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



}
