import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faCheck } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Evento } from '../../../classes/Evento';
import { W_Prenotazevento } from '../../../classes/W_Prenotazevento';
import { LogPosto } from '../../../classes/Logposto';
import { WEventoTagliaBiglietto } from '../../../classes/W_evento_taglia_biglietto';
import { EventoPosto } from '../../../classes/Eventoposto';
// Service
import { EventoService } from './../../../services/evento.service';
import { PrenotazeventoService } from './../../../services/prenotazevento.service';
import { W_PrenotazeventoService } from './../../../services/w_prenotazevento.service';
import { LogpostoService } from './../../../services/logposto.service';
import { WEventoTagliaBigliettoService } from './../../../services/w-evento-taglia-biglietto.service';
import { EventopostoService } from 'src/app/services/eventoposto.service';
import { EventosettoreService } from '../../../services/eventosettore.service';
import { EventofilaService } from '../../../services/eventofila.service';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-prenotazione-detail-posto',
  templateUrl: './prenotazione-detail-posto.component.html',
  styleUrls: ['./prenotazione-detail-posto.component.css']
})
export class PrenotazioneDetailPostoComponent implements OnInit {


 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;
 faCheck = faCheck;

// variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';


 public evento: Evento;

 public wprenotazevento: W_Prenotazevento;


 public logposto: LogPosto;  // da cancellare
 public logpostojob: LogPosto; // da cancellare

 public wEventoTagliaBiglietto: WEventoTagliaBiglietto;
 public wEventoTagliaBiglietti: WEventoTagliaBiglietto[] = [];
 public eventoPosto: EventoPosto;
 public eventoPostojob: EventoPosto;

 public title = '';
 public prenotate = 0;
 public alertSuccess = false;
 public isVisible = false;

 public dataOdierna;
 public idpassed = 0;
 public idposto = 0;
 public prenotati = 0;
 public disponibili = 0;
 public pathimageEvent = '';
 public msgwarning = 'siamo quasi alla fine ';





public token = '';
public stato = 0;

p = 1;

//  parametri per zoom della locandina
//  https://stackoverflow.com/questions/73838711/how-to-use-ngx-img-zoom-with-html-range-in-angular
scaleRange: number;
xValue: number;
yValue: number;

// per normalizzare la descrizione del Posto

public searchPosto = 'POSTO';
public searchFila = 'FILA';

public postoUser = 'posto xxx';
public settoreUser = '';
public filaUser = '';

public startFila = 0;
public startPosto = 0;
public importobiglietto = 0;
public dtagliabiglietto = '';

 constructor(private eventoService: EventoService,
             private prenotazeventoService: PrenotazeventoService,
             private wprenotazeventoService: W_PrenotazeventoService,
             private logpostoService: LogpostoService,
             private wEventoTagliaBigliettoService: WEventoTagliaBigliettoService,
             private eventopostoService: EventopostoService,
             private eventosettoreService: EventosettoreService,
             private eventofilaService: EventofilaService,
             private route: ActivatedRoute,
             private router: Router,
             private modalService: NgbModal,
             private datePipe: DatePipe,
             private notifier: NotifierService) {
             this.notifier = notifier;
 }

 ngOnInit(): void {
  this.goApplication();

}

goApplication() {

  // this.logpostojob = new LogPosto();   da cancellare
  this.eventoPostojob = new EventoPosto();
  const date = Date();
  this.dataOdierna = new Date(date);

  this.isVisible = true;
  this.alertSuccess = true;

/*
  this.dtagliabiglietto = localStorage.getItem('tipoBiglietto')
  this.importobiglietto = parseInt(localStorage.getItem('importoBiglietto'));   // , String(this.wEventoTagliaBiglietto.id)

  localStorage.removeItem('tipoBiglietto');
  localStorage.removeItem('importoBiglietto');
*/


  this.title = 'Prenotazione Posto - prenotazione-detail-posto';
  this.route.paramMap.subscribe(p => {
  this.idpassed = +p.get('id');
  console.log('prenotazioneEvento ------- id recuperato: ' + this.idpassed);
  });
  this.route.paramMap.subscribe(p => {
    this.idposto = +p.get('idposto');
    console.log('id posto: ' + this.idposto);
    });


    this.loadPosto(this.idposto);

    this.Message = 'pronto per inserimento dati prenotazione';

  }

async loadPrenotazione(id: number) {
  let rc = await this.wprenotazeventoService.getbyid(id).subscribe(
    resp => {
          console.log('--------------------------selectedPosto ----------> :  ' + JSON.stringify(resp['data']));
          if(resp['rc'] === 'ok') {
            this.wprenotazevento = resp['data'];
            // salvo cellulare ed email per editarlo in mappa sui campi dell'utente
            this.eventoPostojob.email = this.wprenotazevento.email;
            this.eventoPostojob.cellulare = this.wprenotazevento.telefono;
            this.loadEvento(this.wprenotazevento.idevento);
          }
    },
    error => {
         alert('sono in selectedPosto');
         console.log('selectedPosto - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });
}

async loadEvento(id: number) {

  console.log('frontend -------------- loadEvento ----------------------------------------------------- loadEvento: ' + id);
  let rc = await  this.eventoService.getbyId(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('evento da editare : ' + JSON.stringify(response['data']));
      this.evento = response['data'];
      this.loadTipobiglietto(this.wprenotazevento.idTipoBiglietto);  //
     /*   non serve più
      if(this.evento.tipobiglietto === 2) {
        this.stato = 1;
        this.loadwEventotaglabiglietto(this.evento.id, this.stato);
      } */
    }
  },
  error => {
          alert('loadEvento: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
    });
  }

  async  loadTipobiglietto(id: number) {
    console.log('...........................  loadTipobiglietto - Appena entrato ' + id );
    let rc = await this.wEventoTagliaBigliettoService.getbyid(id).subscribe(
        resp => {
          console.log('                     trovati wEvento. ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
               if(resp['rc'] === 'ok') {
                 this.wEventoTagliaBiglietto = resp['data'];
              }
           },
        error => {
             alert('sono in loadTipobiglietto');
             console.log('loadTipobiglietto - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
         });
     }





// non serve piu
  async  loadwEventotaglabiglietto(id: number, stato: number) {
    console.log('...........................  loadwEventotaglabiglietto - Appena entrato' + id + ' stato: ' + stato);
    let rc = await this.wEventoTagliaBigliettoService.getAll(id, stato).subscribe(
        resp => {
          console.log('                     trovati wEvento. ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
               if(resp['rc'] === 'ok') {
                 this.wEventoTagliaBiglietti = resp['data'];
              }
           },
        error => {
             alert('sono in loadwEventotaglabiglietto');
             console.log('loadwEventotaglabiglietto - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
         });
     }



  async loadPosto(id: number) {

    console.log('frontend -  ................. loadPosto: ' + id);
    let rc = await  this.eventopostoService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('posto da editare : ' + JSON.stringify(response['data']));
        this.eventoPosto = response['data'];
        this.normalisePosto(this.eventoPosto);
        this.loadPrenotazione(this.idpassed);
      }
    },
      error => {
      alert('loadPosto: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
    }

goback() {
this.router.navigate(['/socio']);
}

reset() {
  alert('da fare');
  /*
this.socio = new Socio();
this.selectedOperativita = '?';
this.selectedSesso = '?';   */
}

async conferma() {
  //this.loadLogposto(this.wprenotazevento.idPosto);   attenzione


  this.eventoPosto.token = this.wprenotazevento.token;
  this.eventoPosto.keypren = this.wprenotazevento.token + this.wprenotazevento.email;
  this.eventoPosto.tipobiglietto = this.wprenotazevento.idTipoBiglietto;
  this.eventoPosto.cognome = this.eventoPostojob.cognome;
  this.eventoPosto.nome = this.eventoPostojob.nome;
  this.eventoPosto.cellulare = this.eventoPostojob.cellulare;
  this.eventoPosto.email = this.eventoPostojob.email;
  this.eventoPosto.stato =  1;

  let rc = await  this.eventopostoService.update(this.eventoPosto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          // devo aggiornare il posto

          this.evento.npostiDisponibili = this.evento.npostiDisponibili - 1;
          this.evento.npostipren = this.evento.npostipren + 1;
          let posti = 1;
          this.aggiornaEvento(this.evento);
          this.aggiornaSettore(this.eventoPosto.idSettore, posti);
          this.aggiornaFila(this.eventoPosto.idFila, posti);

       }
    },
    error => {
        alert('creaEventoPosto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'creaEventoPosto --- Errore ' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
  //   this.updatelogPosto(this.wprenotazevento);   da fare
  }



  async aggiornaSettore(id: number, posti: number) {

    console.log('frontend -------------- aggiornaSettore ------------------------ ' + id);
    let rc = await  this.eventosettoreService.aggiornaPostiPrenotati(id,posti).subscribe(
    response => {
      if(response['rc'] !== 'ok') {
        this.alertSuccess = false;
        this.Message = 'errore in aggiornamento posti prenotati per il settore ' + id;
        this.type = 'error';
        this.showNotification( this.type, this.Message);

      }
    },
    error => {
            alert('aggiornaSettore: ' + error.message);
            console.log(error);
            this.alertSuccess = false;
            this.Message = error.message;
            this.type = 'error';
            this.showNotification( this.type, this.Message);
      });
    }

    async aggiornaFila(id: number, posti: number) {

      console.log('frontend -------------- aggiornaFila ------------------------ ' + id);
      let rc = await  this.eventofilaService.aggiornaPostiPrenotati(id,posti).subscribe(
      response => {
        if(response['rc'] !== 'ok') {
          this.alertSuccess = false;
          this.Message = 'errore in aggiornamento posti prenotati per la fila ' + id;
          this.type = 'error';
          this.showNotification( this.type, this.Message);

        }
      },
      error => {
              alert('aggiornaFila: ' + error.message);
              console.log(error);
              this.alertSuccess = false;
              this.Message = error.message;
              this.type = 'error';
              this.showNotification( this.type, this.Message);
        });
      }



  async aggiornaEvento(evento: Evento) {

    console.log('frontend -------------- aggiornaEvento ------------------------ ' + JSON.stringify(evento));
    let rc = await  this.eventoService.update(evento).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        this.alertSuccess = true;
        this.Message = 'Prenotazione Registrata correttamente';
        this.type = 'success';
        this.showNotification( this.type, this.Message);
        this.router.navigate(['/prenEventi/new/' + evento.id]);
      }
    },
    error => {
            alert('aggiornaEvento: ' + error.message);
            console.log(error);
            this.alertSuccess = false;
            this.Message = error.message;
            this.type = 'error';
            this.showNotification( this.type, this.Message);
      });
    }





async countEvento(evento: Evento) {

  let rc = await  this.prenotazeventoService.getCountbyevento(evento.id).subscribe(
    response => {

      console.log('rc dopo countbyevento ' + response['rc'] + ' evento.id ' + evento.id);
        if(response['rc'] === 'ok') {
          this.prenotati =  response['prenotati'];
          this.disponibili = evento.nposti - response['prenotati'];
          // test
          // this.disponibili = 5;  // togliere dopo il test


       }
    },
    error => {
        alert('loadManifActive: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadManifActive' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

//
// Show a notification
//
// @param {string} type    Notification type
// @param {string} message Notification message
//

showNotification( type: string, message: string ): void {
// alert('sono in showNot - ' + message);
this.notifier.notify( type, message );
console.log(`sono in showNotification  ${type}`);
//   alert('sono in notifier' + message);
}

/*   vecchia versione senza la gestione da logposto
async normalisePosto() {

  this.postoUser = localStorage.getItem('prenEvPosto');
  this.settoreUser = localStorage.getItem('prenEvSettore');
  this.filaUser =  localStorage.getItem('prenEvFila');

  console.log('normalisePosto ------  P ' +  this.postoUser + ' S ' + this.settoreUser + ' F ' + this.filaUser);



/*
     this.startFila = desposto.indexOf(this.searchFila);
     this.startPosto = desposto.indexOf(this.searchPosto);

//     console.log('stringa completa: ' + str);
// console.log(' ricerco POSTO: ' + str.indexOf(searchPosto) + ' startPosto ' + startPosto + ' lunghezza ' + str.length);
// console.log(' ricerco FILA: ' + str.indexOf(searchFila) + '  startFila ' + startFila);

 this.postoUser = desposto.substring(this.startPosto);  // ok
 this.filaUser = desposto.substring(this.startFila, (this.startPosto - 4)); // ok
 this.settoreUser = desposto.substring(0, (this.startFila - 1)); // ok

 console.log(' filaUser: ' + this.filaUser);
 console.log(' postoUser: ' + this.postoUser);
 console.log(' settoreUser: ' + this.settoreUser);





     }  */
// nuova versione da logposto


     async normalisePosto(posto: EventoPosto) {

      /*
      this.wprenotazevento.idevento = this.evento.id;
      this.wprenotazevento.idlogistica = this.evento.idlogistica;
      this.wprenotazevento.persone = 1;
      let dataodierna = '';
      let mese = '';
      var data = new Date();
      var gg, mm, aaaa;
      gg = data.getDate() + "/";
      mm = data.getMonth() + 1
      if(mm < 10) {
         mese = '0' + mm;
      } else  {
        mese = mm;
      }
      mese = mese + "/";
      aaaa = data.getFullYear();
      dataodierna = gg + mese + aaaa;
      this.wprenotazevento.datapren = dataodierna;
    */

     // normalizzo la dicitura del settore - fila - posto

     const str = posto.desposto;
     const lenstr = str.length;
     const searchPosto = 'POSTO';
     const searchFila = 'FILA';

     let startFila = 0;
     let startPosto = 0;
         startFila = str.indexOf(searchFila);
         startPosto = str.indexOf(searchPosto);

         console.log('stringa completa: ' + str);
     console.log(' ricerco POSTO: ' + str.indexOf(searchPosto) + ' startPosto ' + startPosto + ' lunghezza ' + str.length);
     console.log(' ricerco FILA: ' + str.indexOf(searchFila) + '  startFila ' + startFila);

     this.postoUser = str.substring(startPosto);  // ok
     this.filaUser = str.substring(startFila, (startPosto - 4)); // ok
    // this.settoreUser = str.substring(0, (startFila - 1)); // ok
     this.settoreUser = str.substring(0, 10); // ok





     console.log(' filaUser: ' + this.filaUser);
     console.log(' postoUser: ' + this.postoUser);
     console.log(' settoreUser: ' + this.settoreUser);
     /*
     settoreuser = str.substring(1,2));
     var str = "Apples are round, and apples are juicy.";
     console.log("(1,2): "    + str.substring(1,2));
     console.log("(0,10): "   + str.substring(0, 10));
     console.log("(5): "      + str.substring(5));
    */


    }


//  vecchia modalità sbagliata --- devo fare updaye e non create
async loadLogposto(id: number) {

  console.log('frontend -  ................. loadLogposto: ' + id);
  let rc = await  this.logpostoService.getbyId(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('posto da editare : ' + JSON.stringify(response['data']));
      this.logposto = response['data'];
     // preparo i dati per la registrazione di eventopostos

      this.eventoPosto = new EventoPosto();
      this.eventoPosto.token = this.wprenotazevento.token;
      this.eventoPosto.keypren = this.wprenotazevento.token + this.wprenotazevento.email;
      this.eventoPosto.idEvento = this.wprenotazevento.idevento;
      this.eventoPosto.tipobiglietto = this.wprenotazevento.idTipoBiglietto;
      this.eventoPosto.idlogistica = this.wprenotazevento.idlogistica;
      this.eventoPosto.key_utenti_operation = 1
      this.eventoPosto.idFila = this.eventoPosto.idFila;
      this.eventoPosto.idSettore = this.eventoPosto.idSettore;
      this.eventoPosto.idPosto = this.eventoPosto.idPosto;
      this.eventoPosto.desposto = this.eventoPosto.desposto;
      this.eventoPosto.tipobiglietto = this.wprenotazevento.idTipoBiglietto;

      this.eventoPosto.cognome = this.eventoPostojob.cognome;
      this.eventoPosto.nome = this.eventoPostojob.nome;
      this.eventoPosto.email = this.eventoPostojob.email;
      this.eventoPosto.cellulare = this.eventoPostojob.cellulare;

console.log('loadLogposto  ----- creo eventoposto: ' + JSON.stringify(this.eventoPosto));
      // salvo i dati della registrazione per una nuova prenotazione


      this.creaEventoPosto(this.eventoPosto, this.wprenotazevento.idTipoBiglietto);
    }
  },
    error => {
          alert('loadPosto: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
    });
  }
// vecchio metodo non più usato  -- ora devo fare update su eventoPosto e non create su logposto
  async creaEventoPosto(eventoPosto: EventoPosto, id: number) {
    let rc = await  this.eventopostoService.create(eventoPosto).subscribe(
      response => {

          if(response['rc'] === 'ok') {
            // devo aggiornare il posto
            this.alertSuccess = true;
            this.Message = 'Registrata correttamente la prenotazione';
            this.type = 'success';
            this.showNotification( this.type, this.Message);
            this.router.navigate(['/prenEventi/new/' + eventoPosto.idEvento]);
         }
      },
      error => {
          alert('creaEventoPosto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'creaEventoPosto --- Errore ' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
  }



}






