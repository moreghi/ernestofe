import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PrenotazioneService} from '../../../services/prenotazione.service';
import { Prenotazione } from '../../../classes/Prenotazione';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'tr[app-prenotazione]',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.css']
})
export class PrenotazioneComponent implements OnInit {
// variabili passate dal componente padre
@Input('prenotazione-data') prenotazione: Prenotazione;
@Input('prenotazione-prog') i: number;

// passo dati a persona-detail
@Output('onSelectPrenotazione') onSelectPrenotazione = new EventEmitter();







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

constructor(public modal: NgbModal,
            private prenotazioneService: PrenotazioneService,
            private route: Router,
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


selectedPrenotazione() {

// passo i dati dal figlio al padre

alert('ho selezionato: ' + this.prenotazione.cognome + ' da passare al padre');
// vedere come passare i dati dal figlio al padre
 // this.onSelectPrenotazione = this.prenotazione;



 this.onSelectPrenotazione.emit(this.prenotazione);


}



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}


}
