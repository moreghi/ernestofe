import { Component, OnInit } from '@angular/core';

import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { ManifestazioneService} from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// import { JsonpClientBackend } from '@angular/common/http';


@Component({
  selector: 'app-manifestazione-days',
  templateUrl: './manifestazione-days.component.html',
  styleUrls: ['./manifestazione-days.component.css']
})
export class ManifestazioneDaysComponent implements OnInit {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco giornate Manifestazione - manifestazione-days";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faLocationArrow = faLocationArrow;

  public eventi: Evento[] = [];
  public evento: Evento;
  public manif: Manifestazione;
  public eventinull: Evento[] = [];

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutte',
    'Aperta',
     'Chiusa'
  ];

   // per paginazone
p: number = 1;

// -----------------------------    da detail1



// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public nRecMan = 0;
public nRec = 0;
public trovatoRec = false;
public Message = '';
public isSelected = false;

public saveValueStd: boolean;
public lastNumber = 0;
public fase = '';


public isLoading = false;
public fieldVisible = false;
public messageTest1  = 'Operazione conclusa correttamente ';

// variabili per visualizzazione messaggio di esito con notifier
public type = '';
public message = '';



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


public href = '';
public idpassed = 0;
public functionUser = '';

public statoModulo  = '?';
public ricercaIniziale = '';

closeResult = '';

public level = 0;
public nRecord = 0;
public enabledFunc = false;
public rotta = '';
public rottaId = 0;
public rottaFunz = '';


// variabili per editazione messaggio

public Message1 = '';
public Message2 = '';
public Message3 = '';
public Message1err = 'Contattare il gestore dell applicazione.';

public isValid = false;
public idManif = 0;
public functionSelected = '';


// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';
public rottafase = '';


constructor(private manifestazioneService: ManifestazioneService,
            private eventoService: EventoService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }


  ngOnInit(): void {
    this.goApplication();
  }

  goApplication() {
    console.log('goApplication - appena entrato');

    this.isVisible = true;
    this.alertSuccess = true;
  //  this.loadlocalita();

   // this.rotta = this.route.snapshot.url[0].path;
   // this.rottafase = this.route.snapshot.url[1].path;


    this.route.paramMap.subscribe(p => {
    this.idpassed = +p.get('id');
    console.log('id recuperato: ' + this.idpassed);
    this.loadManifestazione(this.idpassed);

   });







    console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);
/*

    if(this.rottafase === 'new') {
      this.fase = 'N';
      this.title = 'Inserimento nuova Giornata Evento';
      this.Message = 'inserire i dati della nuova Giornata Evento';
      this.evento = new Evento();
      this.evento.key_utenti_operation = +localStorage.getItem('id');
      this.manif.d_stato_manifestazione = 'in fase inserimento';
    } else {
        this.fase = 'M';
        this.title = 'Aggiornamento Manifestazione';

        console.log('id recuperato: ' + this.idpassed);

       });
      }
      */

}




async loadManifestazione(id: number) {
  console.log('frontend - loadManifestazione: ' + id);
  let rc = await  this.manifestazioneService.getbyId(id).subscribe(
    response => {
        this.manif = response['data'];
        this.loadEventi(this.manif.id);
      },
    error => {
      alert('Manif-Data  --loadManifestazione: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadManifestazione' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
     });

  }

  async loadEventi(id: number) {
    console.log('frontend - loadEventi: ' + id);
    let rc = await  this.eventoService.getbyIdManif(id).subscribe(
      response => {
          if(response['rc'] === 'ok') {
            this.eventi = response['data'];
            this.nRec = response['number'];
            this.Message = 'situazione attuale Eventi';
           }
          if(response['rc'] === 'nf') {
            this.eventi = this.eventinull;
            this.Message = 'nessun Evento presente';
            this.nRec = 0;
           }

        },
      error => {
        alert('Manif-Data  --loadEventi: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadEventi' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
       });

    }



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  //   alert('sono in notifier' + message);
  }

  registra() {

  this.router.navigate(['evento/new/' + this.manif.id]);

  }



}


/*


@Component({
  selector: 'app-manifestazione-days',
  templateUrl: './manifestazione-days.component.html',
  styleUrls: ['./manifestazione-days.component.css']
})
export class ManifestazioneDaysComponent implements OnInit {





  ngOnInit(): void {
    console.log('manifestazione-day - sono in oninit  ');

    this.checkFunctionbylevel();

    console.log('manifestazione-day - ----------------------->    finito  ');


  }






onSelectionChange(tipo: string)   {

// alert('onSelectionChange - Tipo Richiesta: ' + tipo);

this.tipoRichiesta = tipo.substring(0, 1);


this.trovatoRec = false;
this.isVisible = true;
this.giornataService.getGiornateforManif(this.idpassed, this.tipoRichiesta).subscribe(
// sentire hidran per lettura particolare
// this.fedeleService.getFedeliforMessa(id).subscribe(
  response => {
      console.log('dopo ricerca per tipo ' + this.tipoRichiesta + ' esito: ' + response['rc'] + ' dati: ' + JSON.stringify(response['data']) + ' record: ' + response['number']) ;
      if(response['rc'] === 'ok') {
        this.giornate = response['data'];
        this.nRec = response['number'];
        this.textMessage = response['message'];
        this.trovatoRec = true;
        this.alertSuccess = true;
        this.Message = 'Situazione Attuale';
      }
      if(response['rc'] === 'nf') {
        this.giornate = this.giornatenull;
        this.nRec = response['number'];
        this.textMessage = response['message'];
        this.trovatoRec = false;
        this.alertSuccess = false;
        this.Message = 'Situazione Attuale - Nessuna giornata presente per il tipo di richiesta';
      }


   //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
   //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
  },
  error => {
     alert('Manifestazione-day  -- onSelectionChange: ' + error.message);
     console.log(error);
     this.alertSuccess = false;
     this.Message = error.message;
  });




}


}



*/
