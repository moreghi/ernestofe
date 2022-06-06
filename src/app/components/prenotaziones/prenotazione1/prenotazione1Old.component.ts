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
@Input('prenotazione-data') prenotazione: Prenotazione;
@Input('prenotazione-prog') i: number;


 @Input('prenotazione-level') level: number;

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

          this.prenotazioneService.deletePrenotazione(prenotazione).subscribe(
              response => {
                if(response['ok']) {
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


}
