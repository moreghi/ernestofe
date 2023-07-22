import { Component, OnInit } from '@angular/core';
// Service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService} from './../../../services/evento.service';
import { TstatoeventoService } from './../../../services/tstatoevento.service';
import { TtipologisticaService } from './../../../services/ttipologistica.service';
import { LogisticaService } from './../../../services/logistica.service';
import { LogsettfilapostoService } from '../../../services/logsettfilaposto.service';  // non serve - cancellare
import { LogpostoService } from '../../../services/logposto.service';
import { LogsettoreService } from '../../../services/logsettore.service';
import { EventosettfilapostiService } from '../../../services/eventosettfilaposti.service';  // non serve
import { EventopostoService } from '../../../services/eventoposto.service';
import { EventofilaService } from '../../../services/eventofila.service';
import { EventosettoreService } from '../../../services/eventosettore.service';
import { UploadFilesService } from './../../../services/upload-files.service';
import { LocandinaService } from './../../../services/locandina.service';
import { WEventoTagliaBigliettoService } from 'src/app/services/w-evento-taglia-biglietto.service';
import { TtagliabigliettoService } from './../../../services/ttagliabiglietto.service';
import { TtipobigliettoService } from 'src/app/services/ttipobiglietto.service';
import { LogfilaService } from '../../../services/logfila.service';

// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { Evento } from '../../../classes/Evento';
import { TstatoUtente } from './../../../classes/T_stato_utente';
import { Logistica } from '../../../classes/Logistica';
import { Ttipologistica } from './../../../classes/T_tipo_logistica';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';  // non serve eliminare
import { LogPosto } from '../../../classes/Logposto';
import { LogSettore } from '../../../classes/Logsettore';
import { EventoPosto } from '../../../classes/Eventoposto';
import { EventoFila } from '../../../classes/Eventofila';
import { EventoSettore } from '../../../classes/Eventosettore';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';  // non serve
import { Locandina } from '../../../classes/Locandina';
import { WEventoTagliaBiglietto } from './../../../classes/W_evento_taglia_biglietto';
import { Ttagliabiglietto } from './../../../classes/T_taglia_biglietto';
import { Ttipobiglietto } from 'src/app/classes/T_tipo_biglietto';
import { LogFila } from './../../../classes/Logfila';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
// Varie
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// popup
import { LogimagepopComponent } from '../../../components/popups/logimagepop/logimagepop.component';  // popup per registrazione nuovi settori/file
import { LocandinapopComponent } from '../../../components/popups/locandinapop/locandinapop.component'; // visualizzazione locandina








@Component({
  selector: 'app-evento-detail',
  templateUrl: './evento-detail.component.html',
  styleUrls: ['./evento-detail.component.css']
})
export class EventoDetailComponent implements OnInit {

  // per fare zoom sulla foto
  title1 = 'angular-img-hover';
  myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";


  // per upload image
  selectedFiles?: FileList;
  selectFileUtente?: File;
  currentFile?: File;
  progress = 0;
  messageimage = '';
  fileInfos?: Observable<any>;
  messageupload = '';
  public folderImage = '';   // salvo la cartella in cui salvare immagine
// per upload image -- fine


 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faInfoCircle = faInfoCircle;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;

 public selectedStato = 0;
 public selectedLogistica = 0;
 public selectedtipoLogistica = 0;

 // variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';

 public stati: TstatoUtente[] = [];
 public manif: Manifestazione;
 public evento: Evento;
 public eventolast: Evento;
 public eventoPosto: EventoPosto;
 public eventoFila: EventoFila;
 public eventoFila1: EventoFila;
 public eventoFile: EventoFila[] = [];
 public eventoSettore: EventoSettore;
 public eventoSettori: EventoSettore[] = [];

 public logistiche: Logistica[] = [];
 public logistichenull: Logistica[] = [];
 public logistica: Logistica;
 public tipilogistica: Ttipologistica[] = [];
 public logsettfilaposti: LogSettFilaPosti[] = [];  // n on serve  -- eliminare
 public logposti: LogPosto[] = [];
 public logsettori: LogSettore[] = [];
 public logsettore: LogSettore;
 public eventosettfilaposto: Eventosettfilaposti;
 public eventosettfilaposti: Eventosettfilaposti[] = [];
 public locandina: Locandina;

 public wEventoTagliaBiglietto: WEventoTagliaBiglietto;
 public tagli: Ttagliabiglietto[] = [];

 public tipobiglietti: Ttipobiglietto[] = [];
 public logFile: LogFila[] = [];
 public logFila: LogFila;

 public title = '';
 public newTessera = 0;
 public newTesseraStr = '';
 public fase = '';
 public idBg = 1;
 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottafase = '';
 public dataOdierna;
 public anno  = 0;
 public idpassed = 0;
 public idManif = 0;
 public lenmaxtessera = 5;
 public namepage = ' - evento-detail';
 public pathimage = '';
 public pathimageloc = '';
 public eventocreato = true;
 public enabledButtonMappa = false;
 public enabledddownLogistica = false;
 public locandina2path = '';
 public locandinaLoaded = false;
 public locandinaidStart = 0;
 public loadedTipoBiglietti = false;

 public viewPrezzoUnico = false;
 public viewPrezzoFascie = false;
 public tipoPrezzo = 0;
 public tipoPrezzo1 = 0;
 public namePrezzo = '';
 options = [
  'Non Selezionato',
  'Prezzo Unico',
  'Prezzo a Taglie'
 ];

 public tipoBigliettoString = '';
 public D_Settore = '';
 public D_Fila = '';
 public D_Posto = ' -- Posto';
 public D_postoW = '';
 public visualizzaLocandina = false;




 constructor(private mnifestazioneService: ManifestazioneService,
             public eventoService: EventoService,
             private tstatoeventoService: TstatoeventoService,
             private logisticaService: LogisticaService,
             private logsettfilapostoService: LogsettfilapostoService,  // non serve - eliminare
             private logsettoreService: LogsettoreService,
             private eventosettfilapostiService: EventosettfilapostiService,  // non serve
             private eventosettoreService: EventosettoreService,
             private eventopostoService: EventopostoService,
             private eventofilaService: EventofilaService,
             private tipologisticaService: TtipologisticaService,
             private uploadService: UploadFilesService,
             private locandinaService: LocandinaService,
             private wEventoTagliaBigliettoService: WEventoTagliaBigliettoService,
             private tagliabigliettoService: TtagliabigliettoService,
             private tipobigliettoService: TtipobigliettoService,
             private logfilaService: LogfilaService,
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
  console.log('evento-detail -------------------  goApplication');
  const date = Date();
  this.dataOdierna = new Date(date);

  this.anno  = this.dataOdierna.getFullYear();
  this.visualizzaLocandina = false;
  console.log('EventoDetail ------------  goApplication - anno: ' + this.anno);

  this.isVisible = true;
  this.alertSuccess = true;
  this.viewPrezzoUnico = false;
  this.viewPrezzoFascie = false;
  this.loadedTipoBiglietti = false;

  this.rotta = this.route.snapshot.url[0].path;
  this.rottafase = this.route.snapshot.url[1].path;
  this.idManif = +this.route.snapshot.url[2].path;

  console.log('evento-detail - rotta: ' + this.rotta);
  console.log('evento-detail - rottafase: ' + this.rottafase);
  console.log('evento-detail - idmanif: ' + this.idManif);


  this.loadStati();
  this.loadLogistiche();
  this.loadTipiLogistica();

  if(this.rottafase === 'new') {
    console.log('evento-detail - sono in new ');
    this.fase = 'N';
    this.title = 'Inserimento nuovo Evento'  + this.namepage;
    this.Message = 'inserire i dati del nuovo Evento';
    this.evento = new Evento();
    this.evento.idmanif = this.idManif;
    this.evento.key_utenti_operation = +localStorage.getItem('id');
    console.log('evento-detail - sono in new -----  step_01 ' + this.fase);
    this.locandinaidStart = 0;     // imposto id per visualizzare immediatamente la locandina in apertura evento-detail
    this.loadManifestazione(this.idManif);
    console.log('goApplication -- NEW --- evento.idmanif -- ' + this.evento.idmanif);
   } else {
      this.fase = 'M';
      console.log('goApplication -- Modifica ---------  fase: ' + this.fase);
      this.title = 'Aggiornamento Evento '  + this.namepage;;
      this.route.paramMap.subscribe(p => {
      this.idpassed = +p.get('id');
      console.log('id recuperato: ' + this.idpassed);
      this.loadEvento(this.idpassed);
      this.Message = 'pronto per aggiornamento Evento';
     });
    }
}


async loadManifestazione(id: number) {
  console.log('loadManifestazione -- appena entrato: ' + id);
  let rc = await  this.mnifestazioneService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('manifestazione da editare in dettaglio: ' + JSON.stringify(response['data']));
        this.manif = response['data'];
     //   this.loadLocandinaOpen(this.locandinaidStart);   boooooo
        }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
          alert('Socio-Detail  --loadEvento: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
      });
}


async loadEvento(id: number) {
console.log('evento-detail ---- frontend - loadEvento: ' + id);
let rc = await  this.eventoService.getbyId(id).subscribe(
response => {
  if(response['rc'] === 'ok') {
    console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
    this.evento = response['data'];
    this.selectedLogistica = this.evento.idlogistica;
    this.selectedStato = this.evento.stato;
    this.selectedtipoLogistica = this.evento.idtipo;
    this.pathimageloc = environment.APIURL + '/upload/files/eventos_locandina/' + this.evento.photo;
    if(this.evento.idlogistica !== 0) {
      this.loadLogistica(this.evento.idlogistica);
    }
    this.locandinaidStart = this.evento.locandina;
    this.loadManifestazione(this.evento.idmanif);

    if(this.evento.tipobiglietto === 1) {
      this.namePrezzo = 'UNICO';
    }
    if(this.evento.tipobiglietto === 2) {
      this.namePrezzo = 'TAGLIE';
    }
    this.tipoBigliettoString = this.evento.tipobiglietto.toString();
    this.selectTipoBiglietto(this.tipoBigliettoString);
    this.loadTipobiglietti(this.evento.id);


  }
  if(response['rc'] === 'nf') {
    this.Message = response['message'];
    this.type = 'error';
    this.showNotification( this.type, this.Message);
  }
},
  error => {
      alert('Socio-Detail  --loadEvento: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
  });
}

// attenzoione   attenzione

async loadLocandinaOpen(id: number) {
  console.log('frontend - loadLocandinaOpen: ' + id);
  let rc = await  this.locandinaService.getbyId(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
      this.locandina = response['data'];
      this.pathimageloc = environment.APIURL + '/upload/files/eventos_locandina/' + this.locandina.photo;
      this.locandinaLoaded = true;
      }
    if(response['rc'] === 'nf') {
      this.locandinaLoaded = false;
      this.Message = response['message'];
      this.type = 'error';
      this.showNotification( this.type, this.Message);
    }
  },
    error => {
        alert('Socio-Detail  --loadEvento: ' + error.message);
        console.log(error);
        this.alertSuccess = false;
        this.Message = error.message;
        this.type = 'error';
        this.showNotification( this.type, this.Message);
    });
  }

onSelectedStato(selectedValue: number) {
//  alert('selezionato: ' + selectedValue);
      if(selectedValue ==  9999) {
        this.type = 'error';
        this.Message = 'selezione non corrette';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;
        this.selectedStato = 0;
        return;
     } else {
      this.selectedStato = selectedValue;
      this.evento.stato = selectedValue;
     }

}

onSelectedLogistica(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
        if(selectedValue ==  9999) {
          this.type = 'error';
          this.Message = 'selezione non corrette';
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
          this.isVisible = true;
          this.selectedLogistica = 0;
          return;
       } else {
        this.selectedLogistica = selectedValue;
        this.evento.idlogistica = selectedValue;
        this.Message = '';
        this.alertSuccess = true;
        this.isVisible = true;
        this.enabledButtonMappa = false;
        console.log('onSelectedLogisitica - selectedValue ' + selectedValue);
        if(selectedValue !== 0) {
          this.enabledButtonMappa = true;
         // this.loadLogistica(this.selectedLogistica);
        }
    }
  }

  onSelectedtipoLogistica(selectedValue: number) {

          if(selectedValue ==  9999) {
            this.type = 'error';
            this.Message = 'selezione non corrette';
            this.showNotification(this.type, this.Message);
            this.alertSuccess = false;
            this.isVisible = true;
            this.selectedtipoLogistica = 0;
            return;
         } else {
          this.selectedtipoLogistica = selectedValue;
          this.evento.idtipo = selectedValue;
          this.evento.idlogistica = 0;
          this.Message = '';
          this.alertSuccess = true;
          this.isVisible = true;

      //    this.enabledButtonMappa = false;
          console.log('onSelectedtipoLogistica - selectedValue ' + selectedValue);
          if(selectedValue === 2) {
            this.selectedLogistica = 9;
            this.evento.idlogistica = 9;
          }
      }
    }


async  loadStati() {

  let rc = await this.tstatoeventoService.getAll().subscribe(
      resp => {
            console.log('loadStato: ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.stati = resp['data'];
            }
         },
      error => {
           alert('sono in loadStato');

           console.log('loadStato - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
   }

   async   loadLogistiche() {

    let stato = 1;
    let rc = await this.logisticaService.getAllActive(stato).subscribe(
        resp => {
              console.log('loadLogistiche: ' + JSON.stringify(resp['data']));
              if(resp['rc'] === 'ok') {
                this.logistiche = resp['data'];
              }
              if(resp['rc'] === 'nf') {
                this.logistiche = this.logistichenull;
              }
           },
        error => {
             alert('sono in loadLogistiche');

             console.log('loadLogistiche - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
         });
     }

     async  loadTipiLogistica() {

      let rc = await this.tipologisticaService.getAll().subscribe(
          resp => {
                console.log('loadTipiLogistica: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.tipilogistica = resp['data'];
                }
             },
          error => {
               alert('sono in loadTipiLogistica');

               console.log('loadTipiLogistica - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }

     async   loadLogistica(id: number) {

      let rc = await this.logisticaService.getbyId(id).subscribe(
          resp => {
                console.log('loadLogistica: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.logistica = resp['data'];
                  this.pathimage = environment.APIURL + '/upload/files/eventos/logistica/' + this.logistica.photo;   // questa non serve più

                }
                if(resp['rc'] === 'nf') {
                  this.logistiche = this.logistichenull;
                  this.pathimage = '';
                }
             },
          error => {
               alert('sono in loadLogistiche');

               console.log('loadLogistiche - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }


       async  loadTipobiglietti(id: number) {

        let rc = await this.tipobigliettoService.getbyevento(id).subscribe(
            resp => {
                  console.log('loadTipobiglietti: ' + JSON.stringify(resp['data']));
                  if(resp['rc'] === 'ok') {
                    this.tipobiglietti = resp['data'];
                    this.loadedTipoBiglietti = true;
                  }
               },
            error => {
                 alert('sono in loadTipiLogistica');

                 console.log('loadTipiLogistica - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
             });
         }


         viewLocandina() {

          if(this.visualizzaLocandina === true) {
            this.visualizzaLocandina = false;
          } else {
            this.visualizzaLocandina = true;
          }
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

goback() {
this.router.navigate(['/socio']);
}

reset() {
this.evento = new Evento();

}

conferma() {

          if(this.evento.tipobiglietto === 0) {
            this.type = 'error';
            this.Message = 'Effettuare la Gestione Prezzi per poter completare la registrazione';
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
            return;
          }


            this.evento.idmanif = this.manif.id;

            console.log('conferma - fase: ' + this.fase + ' this.evento ' + JSON.stringify(this.evento));
            switch (this.fase)  {
              case 'N':

              //  passi originali della creazione evento fino al 02/05/2023
              // dal 02/05/2023 opero nel seguente modo;
              /*
                 se statobiglietti = 0 messaggio di eseguire creazione biglietti e
                 creare metodo su "Gestione Prezzo" un cui
                 - creo evento;
                 - prendo ultimo numero
                 - faccio route.navigate[tbiglietto/new/id]
                 qui faccio la gestione prezzo unico o a fascie e quando finisco
                 facco route.navigate[evento/edit/:idevento/idManifestazione]
                 e qui concludo le attivitò impostando a operativo l'evento
              */

              if(this.evento.statobiglietti === 0) {
                alert('Effettuare la Gestione Prezzi per poter completare la registrazione 2222');

                this.type = 'error';
                this.Message = 'Effettuare la Gestione Prezzi per poter completare la registrazione';
                this.alertSuccess = false;
                this.showNotification(this.type, this.Message);
                return;
              }
                 alert('Non procedere');
                 return;

/*   parte spostata in "Gestione ..."
                 this.evento.idmanif = this.manif.id;
                 this.evento.statoposti = 0;
                 if(this.evento.idtipo == 1) {
                  this.evento.statoposti = 1;
                 }
                 this.eventoService.create(this.evento).subscribe(
                    res => {
                      this.aggiornaManifestazione(this.manif);
                      console.log('evento-detai ----  conferma_Nuovo: ' + JSON.stringify(this.evento));
                      if(this.evento.stato == 1) {
                        this.eventocreato = true;
                        this.eventoService.createEvento(this.eventocreato);
                          }
                      if(this.evento.idtipo == 2) {
                            this.createAllPosti();
                           }
                      },
                      error => {
                         console.log(error);
                         this.type = 'error';
                         this.Message = error.message;
                         this.alertSuccess = false;
                         this.showNotification( this.type, this.Message);
                      });
*/

                 break;
            case 'M':

            console.log(`pronto per fare modifica : ${JSON.stringify(this.evento)}`);

            if(this.evento.statobiglietti === 1 && this.evento.statoposti === 1) {
              this.evento.stato = 1;
            }
            if(this.evento.photo !== '') {
              this.evento.locandina = 1;
             }
            this.evento.key_utenti_operation = +localStorage.getItem('id');
            this.eventoService.update(this.evento).subscribe(
                res => {
                      this.aggiornaManifestazione(this.manif);
                      console.log('evento-detail ----  conferma_Modifica: ' + JSON.stringify(this.evento));
                      this.router.navigate(['/manif/' + this.manif.id]);
                      // if(this.evento.stato == 1) {
                    //    this.eventocreato = true;
                    //    this.eventoService.createEvento(this.eventocreato);
                    //  }
                   },
                  error => {
                     console.log(error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                     this.showNotification( this.type, this.Message);
                  });
            break;
            default:
              alert('nav - funzione non ancora attivata');
              break;
          }
        }

        async aggiornaManifestazione(manif: Manifestazione) {
      //  console.log('aggiornamentoManifestaZIONE ' + JSON.stringify(manif));

        if(manif.dtInizio == '01/01/9999') {
          manif.dtInizio = this.evento.data;
          manif.dtFine = this.evento.data;
        } else {
          manif.dtFine = this.evento.data;
        }


    //    console.log('aggiornamentoManifestaZIONE ------   dopo test sella data ' + JSON.stringify(manif));

        let rc = await  this.mnifestazioneService.update(manif).subscribe(
            res => {
                  if(res['rc'] === 'ok') {

                  }
              },
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
                 this.showNotification( this.type, this.Message);
              });
}


Test() {

  alert('test non eseguibile  -- metodo di creazione posti inibito')
return;

  this.evento = new Evento();
  this.evento.descrizione = 'prova creazione sett-file-posti';
  this.evento.idtipo = 2;
  this.evento.idlogistica = 11;
  this.evento.id = 1;
 //  this.creaAllSettori(this.evento);

// this.loadEventiFilebyEventoLogistica(this.evento);
}



async aggiornaEvento(evento: Evento) {
  console.log('-----> aggiornaEvento   appena entrato ' );
// leggo l'ultimo evento inserito
let rc = await this.eventoService.update(evento).subscribe(
  resp => {
       console.log('aggiornaEvento: ' + JSON.stringify(resp['data']));
      if(resp['rc'] === 'ok') {
        console.log('aggiornaEvento correttamente -  vado a fare route: /tbiglietto/new/' + this.evento.id);
        this.router.navigate(['/tbiglietto/new/' + this.evento.id]);
      }
  },
   error => {
       alert('sono in aggiornaEvento');
       console.log('aggiornaEvento - errore: ' + error);
       this.type = 'error';
       this.Message = error.message;
       this.showNotification(this.type, this.Message);
   });
}

async loadLastEvento() {
  console.log('-----> loadLasrEvento   appena entrato ' );
// leggo l'ultimo evento inserito
let rc = await this.eventoService.getlast().subscribe(
  resp => {
       console.log('loadLastEvento: ' + JSON.stringify(resp['data']));
      if(resp['rc'] === 'ok') {
        this.evento = resp['data'];
        this.creaAllSettori(this.evento);
      }
  },
   error => {
       alert('sono in loadLasrEvento');
       console.log('loadLasrEvento - errore: ' + error);
       this.type = 'error';
       this.Message = error.message;
       this.showNotification(this.type, this.Message);
   });

}

async creaAllSettori(evento: Evento) {
  let stato = 0;
 // console.log('-- 1 ---> creaAllSettori -------  -------   appena entrato');
  let rc = await this.logsettoreService.getAll(evento.idlogistica).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
            this.logsettori = resp['data'];
       //       console.log(' 2LogSettori ----------   creaAllSettori ---- logsettori: ' + JSON.stringify(this.logsettori));
            let c = 0;
            for(const settore of this.logsettori) {
           //   console.log(' 4EventoSettore  ----------   createAllfile ---- settore: ' + JSON.stringify(settore))

                c = c + 1;
                this.eventoSettore = new EventoSettore();
                this.eventoSettore.idLogistica = settore.idLogistica;
                this.eventoSettore.idEvento = evento.id;    //  leggere ultimo creato
                this.eventoSettore.idSettore = settore.idSettore;
                this.eventoSettore.dsettore = settore.dsettore;
                this.eventoSettore.nposti = settore.nposti;
                this.eventoSettore.npostipren = settore.npostipren;
                this.eventoSettore.nfile = settore.nfile;
                this.eventoSettore.nposti = settore.nposti;
                this.eventoSettore.key_utenti_operation = 1;

                // salvo la descrizione del settore per creare il nome dettagliato
                this.D_Settore = settore.dsettore;

             // console.log('c6 -------- CreateAllPosti ---- pronto per create: c: ' + c + ' ....... ' + JSON.stringify(this.eventoPosto))
                this.eventosettoreService.create(this.eventoSettore).subscribe(
                  response => {
                      if(response['rc'] === 'ok') {

                     //   non funziona
                   //     leggo ultimo inserito e creo le file del settore
                    //    this.loadLastSettore();
                     }
                 },
                 error => {
                       alert('sono in createAllFile');
                        console.log('createAllFile - errore: ' + error);
                       this.type = 'error';
                       this.Message = error.message;
                       this.showNotification(this.type, this.Message);
                   });
              }
              this.loadEventiSettorebyEventoLogistica(evento);
           }
      },
      error => {
           alert('sono in creaAllSettori');
           console.log('creaAllSettori - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
   }

  async loadEventiSettorebyEventoLogistica(evento: Evento) {

      //  console.log('-- 1Settore ----------------> loadEventiSettorebyEvento -------  -------   appena entrato ');
        let rc = await this.eventosettoreService.getbyIdEventoLogistica(evento.idlogistica, evento.id).subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                this.eventoSettori = resp['data'];
                for(const settore of this.eventoSettori) {
                     this.createAllFile(settore);
                   }
                 }
              },
               error => {
                       alert('sono in loadEventiSettorebyEventoLogistica');
                       console.log('loadEventiSettorebyEventoLogistica - errore: ' + error);
                       this.type = 'error';
                       this.Message = error.message;
                       this.showNotification(this.type, this.Message);
                    });
                }

async createAllFile(eventoSettore: EventoSettore) {
  let c = 0;
 // console.log('-- 1EventoSettore  per creaqre Fila   -------createAllFile  -------   appena entrato +  ---- eventoSettore: ' + JSON.stringify(eventoSettore));
  let rc = await this.logfilaService.getbylogisticaeSettore(eventoSettore.idLogistica, eventoSettore.idSettore).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
            this.logFile = resp['data'];
         //     console.log(' 2 ----------   createAllFile ---- logfile: ' + JSON.stringify(this.logFile))

            for(const fila of this.logFile) {
       //       console.log(' 4----------   createAllfile ---- fila: ' + JSON.stringify(fila))

                c = c + 1;
                this.eventoFila = new EventoFila();
                this.eventoFila.idLogistica = eventoSettore.idLogistica;
                this.eventoFila.idEvento = eventoSettore.idEvento;    //  leggere ultimo creato
                this.eventoFila.idSettore = eventoSettore.id;
                this.eventoFila.dfila = fila.dfila;
                this.eventoFila.nposti = fila.nposti;
                this.eventoFila.npostipren = fila.npostipren;
                this.eventoFila.nstart = fila.nstart;
                this.eventoFila.nend = fila.nend;
                this.eventoFila.key_utenti_operation = 1;
                this.creafila(this.eventoFila, c);
          //      console.log('c6 -------- CreateAllFile ---- pronto per create: c: ' + c + ' ....... ' + JSON.stringify(this.eventoFila))
              }
              console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    evento-detail ------------------   finita creazione file --- vado a fafre router-naavigate e gestione prezzi')
              this.router.navigate(['/tbiglietto/new/' + this.evento.id]);
             // this.loadAllFilebyPosti(eventoSettore.idLogistica, eventoSettore.idEvento, c);
         }
      },
      error => {
           alert('sono in createAllFile');
           console.log('lcreateAllFile - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });

      }


  async creafila(eventoFila: EventoFila, c: number)  {
    let xx = 0;
  let rc = await  this.eventofilaService.create(eventoFila).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.eventoFila1 = response['data'];
           xx = response['ultimoid'];
           console.log('creafila -----  inserito c: ' + c + ' eventoFila: ' + JSON.stringify(eventoFila));
           console.log('createfila--------- ultimo id: ' + response['ultimoid']);
           this.creapostidellafila(response['ultimoid']);
          }
   },
   error => {
         alert('sono in creafila');
          console.log('creafila - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });
}


async creapostidellafila(id: number) {
  let rc = await  this.eventofilaService.getbyId(id).subscribe(  // eventofilaService.getlast
    resp => {
        if(resp['rc'] === 'ok') {
          this.eventoFila1  = resp['data'];
            this.createAllPosti(this.eventoFila1);
          }
   },
   error => {
         alert('sono in creapostidellafila');
          console.log('creapostidellafila - errore: ' + error.error.message);
         this.type = 'error';
         this.Message = error.error.message;
         this.showNotification(this.type, this.Message);
     });
}




// nuova versione CreaAllPosti  2023/05/14  (festa della mamma)
async createAllPosti(fila: EventoFila) {
 console.log('....................................................  CreateAllPosti  --- Appena entrato')
    let c = 0;
    console.log(' 4CreateAllPosti ---- fila: ' + JSON.stringify(fila))
    for (let i = fila.nstart; i < fila.nend +1; i++) {

      console.log(' 5---------- i: ' + i + ' ---- fila.nend : ' + fila.nend + ' C: ' + c);

      c = c + 1;
      this.eventoPosto = new EventoPosto();
      this.eventoPosto.idlogistica = fila.idLogistica;
      this.eventoPosto.idEvento = fila.idEvento    //  leggere ultimo creato
      this.eventoPosto.idSettore = fila.idSettore;
      this.eventoPosto.idFila = fila.id;
      this.eventoPosto.idPosto = i;
      this.eventoPosto.desposto = this.D_Settore + ' -- ' + fila.dfila + ' -- Posto: ' + i;
      this.eventoPosto.key_utenti_operation = 1;

     // console.log('>>>>>>>> --- CreateAllPosti ---- pronto per create: c: ' + c + ' ....... desposto: ' + this.eventoPosto.desposto); //JSON.stringify(this.eventoPosto))

     let rc = await  this.eventopostoService.create(this.eventoPosto).subscribe(
      response => {
          if(response['rc'] === 'ok') {
       //     console.log('createPosti --- creato posto per posto: ' + posto.idPosto)
  //                non faccio nulla
         }
     },
     error => {
           alert('sono in inserisciPosto');
            console.log('inserisciPosto - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });

      }

    }


    async  inserisciPosto(eventoPosto: EventoPosto) {
console.log('inserisciPosto ---- desposto: ' + eventoPosto.desposto);
      let rc = await  this.eventopostoService.create(eventoPosto).subscribe(
        response => {
            if(response['rc'] === 'ok') {
         //     console.log('createPosti --- creato posto per posto: ' + posto.idPosto)
    //                non faccio nulla
           }
       },
       error => {
             alert('sono in inserisciPosto');
              console.log('inserisciPosto - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
         });
}




 // --------------   metodi per upload

 selectFile(event: any): void {
  this.selectedFiles = event.target.files;
  console.log('selectfile - nome file: ' + JSON.stringify(this.selectedFiles));
}

upload(): void {
  this.progress = 0;

  if (this.selectedFiles) {
    const file: File | null = this.selectedFiles.item(0);
    console.log('.............................................. upload - file pronto per upload in backend: ' + file.name);


    if (file) {
      this.evento.photo = file.name;   // salvo su record il nome del file selezionato
      this.folderImage = 'eventos_locandina';    // imposto la cartella in cui passare
      this.currentFile = file;

      this.uploadService.upload(this.currentFile, this.folderImage).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.messageimage = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.messageimage = err.error.message;
          } else {
            this.messageimage = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        });
    }

    this.selectedFiles = undefined;
  }
}

// apro la form di popup per dettaglio mappa evento
openpopup() {

          const ref = this.modalService.open(LogimagepopComponent, {size:'lg'});
          ref.componentInstance.selectedUser = this.logistica;
          ref.result.then(
               (yes) => {
                 console.log('Click YES');

                 // non faccio niente


                // this.loadlocalita();
                 //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
               },
               (cancel) => {
                 console.log('click Cancel');

               }
             );

      }


openpopuplocandina()  {

  this.locandinaLoaded = false;
  this.loadLocandina(this.evento.locandina);

}


async loadLocandina(id: number) {
  let rc = await this.locandinaService.getbyId(id).subscribe(
    resp => {
          console.log('loadLocandina: ' + JSON.stringify(resp['data']));
          if(resp['rc'] === 'ok') {
            this.locandina = resp['data'];
            this.locandina.idEvento = this.evento.id;
            this.locandina.idManif = this.evento.idmanif;
            const ref = this.modalService.open(LocandinapopComponent, {size:'lg'});
            ref.componentInstance.selectedUser = this.locandina;
            ref.result.then(
                 (yes) => {
                   console.log('Click YES');

                   // a ritorno della popup visualizzo il messaggio di corretta conclusione del lavoro
                   this.type = 'success';
                   this.alertSuccess = true;
                   this.Message = 'Selezionata correttamente la locandina';
                   this.showNotification(this.type, this.Message);


                   this.locandina2path = localStorage.getItem('locandina');
                   this.pathimageloc = environment.APIURL + '/upload/files/eventos_locandina/' + this.locandina2path;
                   this.locandinaLoaded = true;
                   localStorage.removeItem('locandina');

                   // this.loadlocalita();
                   //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
                 },
                 (cancel) => {
                   console.log('click Cancel');
                     // rivisualizzo la locandina in essere
                   this.loadLocandinaOpen(this.evento.locandina);
                 }
               );
          }
       },
    error => {
         alert('sono in loadLocandin');
         console.log('loadLocandin - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });

}


selectTipoBiglietto(tipo: string) {

localStorage.setItem('tipoBiglietto', tipo);
this.tipoPrezzo = +tipo;
this.tipoPrezzo1 = +tipo;

switch (tipo) {
    case "0":
        this.viewPrezzoUnico = false;
        this.viewPrezzoFascie = false;
        break;
    case "1":
        this.viewPrezzoFascie = false;
        this.viewPrezzoUnico = true;
        break;
    case "2":
        this.viewPrezzoFascie = true;
        this.viewPrezzoUnico = false;
        break;
    default:
    alert('Scelta errata' + '\n' + 'Selezionare tipo di costo' + tipo);
        break;
   }

}

GestionePrezzo() {
  console.log('-------------------------> GestionePrezzo   -----------   appena entrato ' + JSON.stringify(this.evento));
//  alert('Creare Evento ed eseguire navigate a tbihlietto');
/*
if(this.evento.tipobiglietto === 0) {
  alert('Selezionare il tipo di biglietto per la manifestazione')
  this.alertSuccess = false;
  this.Message = 'Selezionare il tipo di biglietto per la manifestazione';
  this.type = 'error';
  this.showNotification(this.type, this.Message);
  return;
}
*/
this.createEvento();
  }


  async createEvento() {
    // leggo l'ultimo evento inserito
    let rc = await this.eventoService.getlast().subscribe(
      resp => {
            console.log('createEvento: -------------- LAST --------  LAST  -----------------' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.eventolast = resp['data'];
              this.evento.id = this.eventolast.id + 1;
            }
            if(resp['rc'] === 'nf') {
              this.evento.id =  1;
            }
           this.evento.idmanif = this.manif.id;
           this.evento.stato = 0;
           this.evento.statobiglietti = 1;
           this.evento.statoposti = 1;
           this.evento.tipobiglietto = this.tipoPrezzo1;
           if(this.evento.photo !== '') {
            this.evento.locandina = 1;
           }
           /*
           if(this.evento.tipobiglietto == 1) {
            this.evento.statoposti = 1;
           } */

          this.creaNewEvento(this.evento);
       },
      error => {
           alert('sono in createEvento');
           console.log('createEvento - errore: ' + error);
           this.alertSuccess = false;
           this.Message = error.message;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
       });
}



//  viene eseguito correttamente
      async  CreaFascieTagliBiglietti() {

          //  console.log('CreaFascieTagliBiglietti - Appena entrato');
            let rc = await this.tagliabigliettoService.getAll().subscribe(
                resp => {
                  //    console.log('CreaFascieTagliBiglietti: ' + JSON.stringify(resp['data']));
                      if(resp['rc'] === 'ok') {
                        this.tagli = resp['data'];
                        for(const taglio of this.tagli) {
                            if(taglio.id > 0) {
                              this.wEventoTagliaBiglietto = new WEventoTagliaBiglietto();
                                 switch(this.tipoPrezzo) {
                                  case 1:
                                      if(taglio.d_taglia === 'PREZZO UNICO') {
                                        this.wEventoTagliaBiglietto.idEvento = this.evento.id;
                                        this.wEventoTagliaBiglietto.d_taglia = taglio.d_taglia;
                                        this.wEventoTagliaBiglietto.flagpu = taglio.flagpu;
                                        this.wEventoTagliaBiglietto.tagliaUser = taglio.tagliaUser;
                                        this.wEventoTagliaBiglietto.key_utenti_operation = 1;
                                      }
                                    break
                                  case 2:
                                      if(taglio.d_taglia !== 'PREZZO UNICO') {
                                        this.wEventoTagliaBiglietto.idEvento = this.evento.id;
                                        this.wEventoTagliaBiglietto.d_taglia = taglio.d_taglia;
                                        this.wEventoTagliaBiglietto.flagpu = taglio.flagpu;
                                        this.wEventoTagliaBiglietto.tagliaUser = taglio.tagliaUser;
                                        this.wEventoTagliaBiglietto.key_utenti_operation = 1;
                                      }
                                    break
                                }
                                this.wEventoTagliaBigliettoService.create(this.wEventoTagliaBiglietto).subscribe(
                                      response => {
                                          if(response['rc'] === 'ok') {
                                  //                non faccio nulla
                                   //   console.log('-----> registrato wEventoTagliaBiglietto ');
                                          }
                                      },
                                      error =>
                                      {
                                        console.log(error);
                                        this.Message = error.message;
                                        this.alertSuccess = false;
                                      });
                                }
                              }
                          }
                },
                error => {
                     console.log('loadFascie - errore: ' + error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.showNotification(this.type, this.Message);
                 });
             }


// this.router.navigate(['/tbiglietto/new/' + this.evento.id]);

async creaNewEvento(evento: Evento) {
  let rc = await this.eventoService.create(evento).subscribe(
    res => {
      if(res['rc'] === 'ok') {
        this.eventocreato = true;
        this.CreaFascieTagliBiglietti();           //  viene eseguito correttamente
        this.aggiornaManifestazione(this.manif);   //  viene eseguito correttamente

        if(this.evento.idtipo == 2) {
           this.loadLastEvento();   // creo eventoSettore/fila/posto
           } else {
           this.router.navigate(['/tbiglietto/new/' + this.evento.id]);
          }

          if(this.evento.idtipo == 1) {
               alert('evento senza logistica -- controllare se ok per prenotazioni')
               this.type = 'success';
               this.Message = 'evento senza logistica -- controllare se ok per prenotazioni';
               this.alertSuccess = true;
               this.showNotification( this.type, this.Message);
            // this.router.navigate(['/tbiglietto/new/' + this.evento.id]);
            }

/*
          this.aggiornaManifestazione(this.manif);
          console.log('evento-detai ----  conferma_Nuovo: ' + JSON.stringify(this.evento));
          if(this.evento.stato == 1) {
            this.eventocreato = true;
            this.eventoService.createEvento(this.eventocreato);
           this.CreaFascieTagliBiglietti();
          }
          */
        }
      },
      error => {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification( this.type, this.Message);
      });
   }

 // metodo ok
/*
 async loadAllFilebyPosti(idLog: number, idEvento: number, c: number) {

 // console.log('-- 1EventoFile ------------->>>>>>>>>>>>>>>  loadAllFilebyPosti  >>>>>>>>>>  loadAllFilebyPosti  >>>>>>>>>>>>>>>>>>>>>>>---> loadAllFilebyPosti ------loadAllFilebyPosti-  -------   appena entrato c: ' + c);
  let rc = await this.eventofilaService.getfilebyPosti(idLog, idEvento).subscribe(
    resp => {

// console.log('loadAllFilebyPosti   ------step_Lettura eventoFile ---------------------- rc: ' + resp['rc']);


        if(resp['rc'] === 'ok') {
          console.log('loadAllFilebyPosti_step_01 + ' +  JSON.stringify(resp['data']));
          this.eventoFile = resp['data'];
          for(const fila of this.eventoFile) {
            console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(fila))
            this.createAllPosti(fila);
             }
             console.log('------  CreateAllPosti ---------------------- finita elaborazione:  --------- fine di tutto');
             this.router.navigate(['/tbiglietto/new/' + this.evento.id]);
           }
         },
         error => {
                 alert('sono in loadAllFilebyPosti');
                 console.log('loadAllFilebyPosti - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
              });
        }
*/


// metodo che va in postman e non in codice  ????????????????????????????????
/*  metodo usato in Test()
async loadEventiFilebyEventoLogistica(evento: Evento) {

  // usato solo per fare test



                    console.log('loadEventiFilebyEventoLogistica ---- <<<<<<< TEST TEST >>>>>>>--------<<<<<<< TEST TEST >>>>>>>  -------   appena entrato ');
                    let rc = await this.eventofilaService.getfilebyPosti(evento.idlogistica, evento.id).subscribe(
                      resp => {

  console.log('loadEventiFilebyEventoLogistica  ------------------------- step_Lettura eventoFile ---------------------- rc: ' + resp['rc']);


                          if(resp['rc'] === 'ok') {
                            console.log('loadEventiFilebyEventoLogistica_step_01 + ' +  JSON.stringify(resp['data']));
                            this.eventoFile = resp['data'];
                            for(const fila of this.eventoFile) {
                              console.log(' 4eventoFile by Posti----------   createAllPosti ---- settore: ' + JSON.stringify(fila))
                              this.createAllPosti(fila);

                               }
                             }
                             console.log('------  CreateAllPosti ---------------------- finita elaborazione:  --------- fine di tutto');
                             this.evento.statoposti = 1;
                             this.aggiornaEvento(this.evento);
                           },
                           error => {
                                   alert('sono in loadLastSettore');
                                   console.log('loadLastSettore - errore: ' + error);
                                   this.type = 'error';
                                   this.Message = error.message;
                                   this.showNotification(this.type, this.Message);
                                });
                  }

*/


}

