import { Component, Input, OnInit } from '@angular/core';
// Services
import { EventopostoService } from '../../../services/eventoposto.service';
import { BigliettoService } from '../../../services/biglietto.service';
// Model
import { EventoPosto } from '../../../classes/Eventoposto';
import { Biglietto } from '../../../classes/Biglietto';
// altro
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-evento-posto]',
  templateUrl: './evento-posto.component.html',
  styleUrls: ['./evento-posto.component.css']
})
export class EventoPostoComponent implements OnInit {

 // variabili passate dal componente padre
 @Input('evento-posto-data') eventoposto: EventoPosto;
 @Input('evento-posto-prog') i: number;

 public biglietto: Biglietto;


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

 public navigateEdit = 'Edit';
 public navigateTicket = 'Ticket';
 public navigatePosti = 'Posti';

 public messagenull = 'Nessun record presente !!!';

 closeResult = '';


// variabili per notifica esito operazione con Notifier
public type = '';




constructor(private eventopostoService: EventopostoService,
            private bigliettoService: BigliettoService,
            private modalService: NgbModal,
            private route: Router,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
             this.notifier = notifier;
            }

ngOnInit(): void {
     if(this.eventoposto.stato === 1) { // biglietto emesso
       this.loadBiglietto(this.eventoposto.idbiglietto);
     } else {
       this.biglietto = new Biglietto();
     }

}

async  loadBiglietto(id: number)  {
     console.log('frontend - loadBiglietto: ' + id);
     let rc = await  this.bigliettoService.getbyId(id).subscribe(
     response => {
       if(response['rc'] === 'ok') {
         this.biglietto = response['data'];
        }
   },
   error => {
       alert('loadBiglietto: ' + error.message);
       this.isVisible = true;
       this.alertSuccess = false;
       this.type = 'error';
       this.Message = 'Errore loadFila' + '\n' + error.message;
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

navigate(pathNavigate: string, eventoposto: EventoPosto) {

 console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${eventoposto.id} `);


 switch (pathNavigate) {

   case 'Edit':
     alert('da fare');
    // this.route.navigate(['evento/edit/' + evento.id + '/' + evento.idmanif]);
     break;
   case 'Ticket':
     alert('funzione non prevista');
    // this.route.navigate(['evento/' + evento.id + '/tipobiglietti']);
     break;
   case 'Posti':
     alert('da fare');
    // this.route.navigate(['evento/' + evento.id + '/Posti']);
     break;



   default:
     alert('scelta errata \n navigazione non possibile');
     break;
 }
}

attenzione() {
  alert(' da errore inspiegabile');
}



open(content: any, eventoposto: EventoPosto) {
console.log(`open_content - user ${eventoposto.idbiglietto}`);
this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
this.closeResult = `Closed with: ${result}`;
// alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
if(result === 'Cancel click') {
this.cancellazioneAbort();
}
if(result === 'Delete click') {
 console.log('fare routine di cancellazione: ' + eventoposto.id + ' - ' + eventoposto.idbiglietto );
//this.cancellaProdotto(this.prodotto);
 this.delete(eventoposto);
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

delete(eventoposto: EventoPosto) {
// console.log(id,'cancelllllllllllllllllllllllo --->');
 this.eventopostoService.delete(eventoposto).subscribe(
   res => {
         this.type = 'success';
         this.Message = `cancellazione Eventoposto ${eventoposto.idbiglietto}  eseguita con successo `;
         this.showNotification(this.type, this.Message);
       },
       error => {
           alert('delete evento: ' + error.message);
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
