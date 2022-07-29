import { Component, Input, OnInit } from '@angular/core';
// Service
import { PrenotazeventoService} from '../../../services/prenotazevento.service';
import { TtipobigliettoService} from '../../../services/ttipobiglietto.service';
import { TstatobigliettoService} from '../../../services/tstatobiglietto.service';
// Model
import { Prenotazevento } from '../../../classes/Prenotazevento';
import { Ttipobiglietto } from '../../../classes/T_tipo_biglietto';
import { Tstatobiglietto } from '../../../classes/T_stato_biglietto';


import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-prenotazioneevento]',
  templateUrl: './prenotazioneevento.component.html',
  styleUrls: ['./prenotazioneevento.component.css']
})
export class PrenotazioneeventoComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('prenotazioneevento-data') prenotazevento: Prenotazevento;
   @Input('prenotazioneevento-prog') i: number;


   public tipobiglietto: Ttipobiglietto;
   public statobiglietto: Tstatobiglietto;

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
   faTicketAlt = faTicketAlt;
   faLocationArrow = faLocationArrow;

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

   public navigateEdit = 'Edit';
   public navigateEmissione = 'Emissione';
   public navigatePosti = 'Posti';

   public messagenull = 'Nessun record presente !!!';

   closeResult = '';


// variabili per notifica esito operazione con Notifier
  public type = '';



   constructor(private prenotazeventoService: PrenotazeventoService,
               private tipobigliettoService: TtipobigliettoService,
               private statobigliettoService: TstatobigliettoService,
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

    this.loadTipoBiglietto(this.prenotazevento.idtipobiglietto);
    this.loadStatoBiglietto(this.prenotazevento.idstato);


 }



async loadTipoBiglietto(id: number) {

 let rc = await this.tipobigliettoService.getbyid(id).subscribe(
    res => {
          if(res['rc'] === 'ok') {
            this.tipobiglietto = res['data'];
          }
        },
        error => {
            alert('loadTipoBiglietto: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
 }

 async loadStatoBiglietto(id: number) {

  let rc = await this.statobigliettoService.getbyid(id).subscribe(
     res => {
           if(res['rc'] === 'ok') {
             this.statobiglietto = res['data'];
           }
         },
         error => {
             alert('loadStatoBiglietto: ' + error.message);
             this.isVisible = true;
             this.alertSuccess = false;
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
             console.log(error);
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

  navigate(pathNavigate: string, prenotazevento: Prenotazevento) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${prenotazevento.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['biglietto/' + prenotazevento.idbiglietto + '/edit']);
        break;
      case 'Emissione':
        this.route.navigate(['prenotevento/' + prenotazevento.id + '/biglietto']);
        break;
      case 'Posti':
        this.route.navigate(['evento/' + prenotazevento.id + '/Posti']);
        break;



      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


open(content: any, prenotazevento: Prenotazevento) {
  console.log(`open_content - user ${prenotazevento.cognome}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + prenotazevento.id + ' - ' + prenotazevento.cognome );
   //this.cancellaProdotto(this.prodotto);
    this.delete(prenotazevento);
    // this.cancellazioneCompleted(evento);
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

  /*
  cancellazioneCompleted(evento: Evento) {
    this.type = 'success';
    this.Message = `cancellazione Evento ${evento.descrizione}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  } */

  delete(prenotazevento: Prenotazevento) {
   // console.log(id,'cancelllllllllllllllllllllllo --->');
    this.prenotazeventoService.deletePrenotazione(prenotazevento).subscribe(
      res => {
            this.type = 'success';
            this.Message = `cancellazione prenotazione Evento ${prenotazevento.cognome}  eseguita con successo `;
            this.showNotification(this.type, this.Message);
          },
          error => {
              alert('delete prenotazione evento: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });
  }


  getColor(stato: number) {
    switch (stato) {
      case 0:
        return 'red';
      case 1:
        return 'green';
    }
  }

  getBackground(stato: number) {
    switch (stato) {
      case 0:
        return 'black';
      case 1:
        return 'yellow';
    }
  }



}


