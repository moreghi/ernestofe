import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { Prenotazione } from '../../../classes/Prenotazione';
import { PrenotazioneService} from '../../../services/prenotazione.service';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-prenotazione1]',
  templateUrl: './prenotazione1.component.html',
  styleUrls: ['./prenotazione1.component.css']
})
export class Prenotazione1Component implements OnInit {

  // variabili passate dal componente padre
@Input('prenotazione1-data') prenotazione: Prenotazione;
@Input('prenotazione1-prog') i: number;
@Input('prenotazione1-level') level: number;
// passo al figlio la segnalazione che ho effettuato la cancellazione- serve per rifare l'elemco aggiornato
@Output('onDeletedPrenotazione') onDeletedPrenotazione = new EventEmitter();

faUserEdit = faUserEdit;
faTrash = faTrash;
faInfo = faInfo;
faInfoCircle = faInfoCircle;

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
public funcSearch = 0;
public nRec = 0;

public type = '';
public utenteFedele = false;
public functionEnabled = false;
public idDay = 0;
public deletedPrenot = 'Dpren';



// parametri per interfaccia a ghost
// Parametri obbligatori:
// - routeApp
// parametri facoltativi
// keyn ---->  se numerico trasformarlo in stringa
// tipo
//     S--> campo string
//     N--> campo Numerico
//     *--> non serve key

// se impostato tipo = '*'  va impostato anche key a '*'

public routeApp = '';
public keyn = 0;
public keys = '';
public tipo = '';
public routePersona = '';

public dateString = '';

public data1 = '';

public gg = '';
public mm = '';
public yyyy = '';
public initialDate: any;

closeResult = '';

constructor(public modal: NgbModal,
            private route: Router,
            private prenotazioneService: PrenotazioneService,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
            this.notifier = notifier;
          }

ngOnInit(): void {

   //   per gestire eventuale popup
   this.headerPopup = 'Registrazione Persone';
   this.textMessage1 = '?????????? ';
//   this.textUser = this.messa.demessa;
   this.textMessage2 = 'Registrazione non possibile';
 //  this.controllaGiornata();
  // this.loadManifestazioni();

  console.log('prenotazione1 - OnInit ----- level: ' + this.level);
  console.log('prenotazione1 - OnInit ----- i: ' + this.i);


}









/*   come passare da figlio a padre
showPersonaDetailNew() {
  //alert('creato evento per passare utente: ' + this.persona.cognome);
  this.onSelectUser.emit(this.persona);
  //alert(' ---- 2   creato evento per passare utente: ' + this.persona.cognome);
}

*/


/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
        this.notifier.notify( type, message );
        }


        // menu per cancellazione
        open(content) {
          this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
            if(result ===  'Cancel click') {
               this.cancellazioneAbort();
            }
            if(result ===  'Delete click') {
              // gestire uscita da popup
              this.cancellaUser(this.prenotazione);
            }
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
         //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
            this.cancellazioneAbort();
          });

        }

        // menu per modifica
        openmod(contentmod) {
          this.modal.open(contentmod, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
            if(result ===  'Cancel click') {
               this.cancellazioneAbort();
            }
            if(result ===  'Modifica click') {
              // gestire uscita da popup
              this.modificaPrenotazione(this.prenotazione);
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

        cancellaUser(prenotazione: Prenotazione) {
          console.log('cancella - emetto onDeleteprenotazione');
         // this.onDeletedPrenotazione.emit(this.deletedPrenot);

          this.prenotazioneService.deletePrenotazione(prenotazione).subscribe(
              response => {
                if(response['rc'] === 'ok') {
                  this.onDeletedPrenotazione.emit(this.deletedPrenot);  // imposto l'evento per passare la segnalazione di cancellazione al padre
                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.type = 'success';
                  this.Message = 'Prenotazione cancellata correttamente';
                  this.showNotification(this.type, this.Message);
                }
            },
            error =>
                {
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore cancellazione prenotazione' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
                });

        }


        modificaPrenotazione(prenotazione: Prenotazione) {

//  devo normalizzare la data per effettuare la corretta modifica

/*
        console.log('prenotazione modificata come n.persone - ' + JSON.stringify(prenotazione));


        this.dateString = prenotazione.datapren.toString();
        console.log('date---- su prenotazione: ' + prenotazione.datapren + '    su stringa: ' + this.dateString);

       // date---- su prenotazione: 2022-03-17T23:00:00.000Z    su stringa: 2022-03-17T23:00:00.000Z


        this.gg = this.dateString.substr(8, 2);
        this.mm =  this.dateString.substr(5, 2);
        this.yyyy =  this.dateString.substr(0, 4);

        this.data1 = this.yyyy + '-' + this.mm + '-' + this.gg;





        this.initialDate = this.datePipe.transform(this.data1, 'yyyy-MM-dd');

        console.log('onInit - manipolazione this.dateString: ' + this.dateString);
        console.log('onInit - gg mm yyyy ' + this.gg + ' -- ' + this.mm + ' -- ' + this.yyyy);
        console.log('onInit - data1 ' + this.data1);
        console.log('onInit - initialDate ' + this.initialDate);

        prenotazione.datapren = this.initialDate;

        */


          this.prenotazioneService.updatePrenotazione(prenotazione).subscribe(
              response => {
                if(response['rc'] === 'ok') {
                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.type = 'success';
                  this.Message = 'Prenotazione modificata correttamente';
                  this.showNotification(this.type, this.Message);
                }
            },
            error =>
                {
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore modifica prenotazione' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
                });
        }



}
