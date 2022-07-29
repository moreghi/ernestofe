

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Service
import { EventosettfilapostiService } from '../../../services/eventosettfilaposti.service';
import { LogsettoreService } from '../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';
// Model
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';

import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-evento-settfila]',
  templateUrl: './evento-settfila.component.html',
  styleUrls: ['./evento-settfila.component.css']
})
export class EventoSettfilaComponent implements OnInit {

  @Input('evento-settfila-data') eventosettfila: Eventosettfilaposti;
  @Input('evento-settfila-prog') i: number;

 // passo dati a persona-detail   --  da fare
 @Output('totalefileposti') totalefileposti = new EventEmitter();
 @Output('totalefilepostiok') totalefilepostiok = new EventEmitter();
 @Output('totalefilepostiko') totalefilepostiko = new EventEmitter();


  public logSettore: LogSettore;
  public logFila: LogFila;

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


  public navigatePosti = 'Posti';


  public messagenull = 'Nessun record presente !!!';

  closeResult = '';


// variabili per notifica esito operazione con Notifier
 public type = '';
 public attiva = 0;
 public disattiva = 1;



  constructor(private eventosettfilapostiService: EventosettfilapostiService,
              private logsettoreService: LogsettoreService,
              private logfilaService: LogfilaService,
              private modalService: NgbModal,
              private route: Router,
              private datePipe: DatePipe,
              private notifier: NotifierService) {
               this.notifier = notifier;
             }


  ngOnInit(): void {
    this.loadSettore(this.eventosettfila.idLogistica, this.eventosettfila.idSettore);
    this.loadFila(this.eventosettfila.idLogistica, this.eventosettfila.idFila);
  }


async  loadSettore(idLog: number, idSet: number) {
    console.log('frontend - loadSettore: ' + idLog + ' idSett: ' + idSet);
    let rc = await  this.logsettoreService.getbySettore(idLog, idSet).subscribe(
    response => {
          if(response['rc'] === 'ok') {
            this.logSettore = response['data'];
          }
      },
  error => {
      alert('loadSettore: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadSettore' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });

  }


  async  loadFila(idLog: number, idfila: number) {
    console.log('frontend - loadSettore: ' + idLog + ' idfila: ' + idfila);
    let rc = await  this.logfilaService.getbyFila(idLog, idfila).subscribe(
    response => {
          if(response['rc'] === 'ok') {
            this.logFila = response['data'];
          }
      },
  error => {
      alert('loadSettore: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadSettore' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });

  }


async  modifica(eventosettfila: Eventosettfilaposti, flag: number) {
  eventosettfila.stato = flag;
  if(flag == 0) {
    eventosettfila.utilizzo = 'ATTIVO';
  }
  if(flag == 1) {
    eventosettfila.utilizzo = 'DISATTIVO';
  }
  let rc = await  this.eventosettfilapostiService.update(eventosettfila).subscribe(
    response => {
          if(response['rc'] === 'ok') {
           //  effettuo il recupero dei totali dei settori/file  modificati
            this.recuperaTotali(eventosettfila.idEvento);
          }
      },
  error => {
          alert('modifica: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore modifica' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
  }



async recuperaTotali(id: number) {
  console.log('frontend - lrecuperaTotali: ' + id);
  let rc = await  this.eventosettfilapostiService.getcountfileposti(id).subscribe(
  response => {
        console.log('recuperatotali - messaggio ' + JSON.stringify(response['message']));
        console.log('recuperatotali - rc ' + JSON.stringify(response['rc']));
        console.log('recuperatotali - ' + JSON.stringify(response['tot']));
        console.log('recuperatotali - totale' + JSON.stringify(response['totale']));
        if(response['rc'] === 'ok') {
          this.totalefileposti.emit(response['tot']);
          this.totalefilepostiok.emit(response['totok']);
          this.totalefilepostiko.emit(response['totko']);
        }
    },
error => {
    alert('recuperaTotali: ' + error.message);
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'Errore recuperaTotali' + '\n' + error.message;
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

  getColor(stato: number) {
    switch (stato) {
      case 0:
        return 'green';
      case 1:
        return 'red';
    }
  }

  getBackground(stato: number) {
    switch (stato) {
      case 0:
        return 'yellow';
      case 1:
        return 'black';
    }
  }


  navigate(pathNavigate: string, eventosettfila: Eventosettfilaposti) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${eventosettfila.id} `);


    switch (pathNavigate) {


      case 'Posti':
        this.route.navigate(['evento/' + eventosettfila.idEvento + '/S/' + eventosettfila.idSettore + '/F/' + eventosettfila.idFila  ]);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }





}


