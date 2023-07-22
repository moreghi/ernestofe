/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evento-posti-detail',
  templateUrl: './evento-posti-detail.component.html',
  styleUrls: ['./evento-posti-detail.component.css']
})
export class EventoPostiDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/

import { Component, OnInit } from '@angular/core';
// service
import { EventoService } from './../../../services/evento.service';
import { EventosettfilapostiService } from './../../../services/eventosettfilaposti.service';
import { EventopostoService } from './../../../services/eventoposto.service';
import { LogisticaService } from './../../../services/logistica.service';
import { LogsettoreService } from './../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';
// Model
import { Logistica } from '../../../classes/Logistica';
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';
import { LogPosto } from '../../../classes/Logposto';
import { Evento} from '../../../classes/Evento';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';
import { EventoPosto } from '../../../classes/Eventoposto';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-evento-posti-detail',
  templateUrl: './evento-posti-detail.component.html',
  styleUrls: ['./evento-posti-detail.component.css']
})
export class EventoPostiDetailComponent implements OnInit {

// icone
faPlusSquare = faPlusSquare;
faSearch = faSearch;
faInfoCircle = faInfoCircle;
faUserEdit = faUserEdit;
faSave = faSave;
faPlus = faPlus;
faTrash = faTrash;
faReply = faReply;

 public title = 'Dettaglio per settore fila - evento-posti-detail';

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';
 public Message = '';


  public logistica: Logistica;
  public logsettore: LogSettore;
  public logfila: LogFila;

  public logsettfilaposti: LogSettFilaPosti[] = [];
  public logsettfilapostinull: LogSettFilaPosti[] = [];
  public logsettfilaposto: LogSettFilaPosti;
  public logsettfilapostow: LogSettFilaPosti;

  public logposti: LogPosto[] = [];
  public logposto: LogPosto;

  public evento: Evento;
  public eventosettfilaposto: Eventosettfilaposti;
  public eventoposti: EventoPosto[] = [];
  public eventoposto: EventoPosto;

  // variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;
public idpassed = 0;
public idSett = 0;
public idFila = 0;
public postoStart = 0;
public postoEnd = 0;

   // per paginazone
   p: number = 1;

   public r1 = '';
   public r2 = '';
   public r3 = '';

constructor(private eventoService: EventoService,
            private eventosettfilapostiService: EventosettfilapostiService,
            private eventopostoService: EventopostoService,
            private logisticaService: LogisticaService,
            private logsettoreService: LogsettoreService,
            private logfilaService: LogfilaService,
            private route: ActivatedRoute,
            private router: Router,
            private datePipe: DatePipe,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

            ngOnInit(): void {
              this.goApplication();
              }

              goApplication() {
                console.log('goApplication - evento Posti detail --------  appena entrato');

                this.isVisible = true;
                this.alertSuccess = true;
                //  this.loadlocalita();

                // this.rotta = this.route.snapshot.url[0].path;
                // this.rottafase = this.route.snapshot.url[1].path;

                //test

                this.r1 = this.route.snapshot.url[0].path;
                this.r2 = this.route.snapshot.url[1].path;
                this.r3 = this.route.snapshot.url[2].path;
                console.log('r1 ' + this.r1 + ' r2 ' + this.r2 + ' r3 ' + this.r3);
// fine test




                this.route.paramMap.subscribe(p => {
                this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
                this.idpassed = +p.get('id');
                this.idSett = +p.get('idSett');
                this.idFila = +p.get('idFila');
                this.loadEvento(this.idpassed);
                this.Message = 'pronto per aggiornamento Tipologie Biglietti';
                });

              }

              async loadEvento(id: number) {
                    console.log('frontend - loadEvento: ' + id);
                    let rc = await  this.eventoService.getbyId(id).subscribe(
                    response => {
                    if(response['rc'] === 'ok') {
                      this.evento = response['data'];
                      this.loadSettore(this.evento.idlogistica, this.idSett)
               //       this.loadsettfilaposti(this.evento.id);
                 //     this.recuperaTotali(id);
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

              async loadSettore(id: number, idsett: number) {
                console.log('frontend - loadSettore: ' + id);
                let rc = await  this.logsettoreService.getbySettore(id, idsett).subscribe(
                response => {
                if(response['rc'] === 'ok') {
                  this.logsettore = response['data'];
                  this.loadFila(this.idFila);
           //       this.loadsettfilaposti(this.evento.id);
             //     this.recuperaTotali(id);
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

          async loadFila(id: number) {
            console.log('frontend - loadFila: ' + id);
            let rc = await  this.logfilaService.getbyId(id).subscribe(
            response => {
            if(response['rc'] === 'ok') {
              this.logfila = response['data'];
              this.loadSettFilaPosti(this.evento.id, this.idSett, this.idFila);
              this.loadPosti(this.evento.id, this.idSett, this.idFila);
            }

          },
          error => {
              alert('loadFila: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore loadFila' + '\n' + error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });

      }

    async  loadSettFilaPosti(id: number, idSett: number, idFila: number) {

      console.log('frontend - loadSettFilaPosti: ' + id);
      let rc = await  this.eventosettfilapostiService.getbyIdEventoSettFila(id, idSett, idFila).subscribe(
      response => {
      if(response['rc'] === 'ok') {
        this.eventosettfilaposto = response['data'];

       }

    },
    error => {
        alert('loadFila: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadFila' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });



      }








      async loadPosti(id: number, idSett: number, idFila: number) {

        console.log('frontend - loadPosti: ' + id);
        let rc = await  this.eventopostoService.getbyIdEventoSettFila(id, idSett, idFila).subscribe(
        response => {
        if(response['rc'] === 'ok') {
          this.eventoposti = response['data'];

         }

      },
      error => {
          alert('loadFila: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore loadFila' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });

      }



      /*
              async loadsettfilaposti(id: number) {
                console.log('frontend - loadsettfilaposti: ' + id);
                let rc = await  this.eventosettfilapostiService.getbyIdEvento(id).subscribe(
                response => {
                      if(response['rc'] === 'ok') {
                        this.eventosettfilaposti = response['data'];
                        this.nRec = response['number'];
                       }
                      if(response['rc'] === 'nf') {
                        this.eventosettfilaposti = this.eventosettfilapostinull;
                        this.nRec = 0;
                       }
                  },
              error => {
                  alert('loadsettfilaposti: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadsettfilaposti' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });

          }

*/

goback() {
  alert('da fare');
}


              /* Show a notification
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


}


/* -----------------------------------------------------    primo ----------------------------------------------------------



   // per paginazone
p: number = 1;

// -----------------------------    da detail1
















          async recuperaTotali(id: number) {
            console.log('frontend - lrecuperaTotali: ' + id);
            let rc = await  this.eventosettfilapostiService.getcountfileposti(id).subscribe(
            response => {
                  console.log('recuperatotali - messaggio ' + JSON.stringify(response['message']));
                  console.log('recuperatotali - rc ' + JSON.stringify(response['rc']));
                  console.log('recuperatotali - ' + JSON.stringify(response['tot']));
                  console.log('recuperatotali - totale' + JSON.stringify(response['totale']));
                  if(response['rc'] === 'ok') {
                    this.totalefileposti(response['tot']);
                    this.totalefilepostiok(response['totok']);
                    this.totalefilepostiko(response['totko']);
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





                totalefileposti(totale: number) {
             //     alert('ricevuto da figlio - totale ' + totale);
                  this.tot = totale;
                }
                totalefilepostiok(totaleok: number) {
             //     alert('ricevuto da figlio - totaleok ' + totaleok);
                  this.tok = totaleok;
                }
                totalefilepostiko(totaleko: number) {
             //     alert('ricevuto da figlio - totaleko ' + totaleko);
                  this.tko = totaleko;

                }

                rilascia() {
                    this.updateMessage();
                }


async updateMessage() {

  const key = 1;
  this.message = new Message();
  this.message.tipo = 'I';
  this.message.title = 'Rilascio Posti';
  this.message.message01 = 'intendi effettuare il rilascio ?';
  this.message.message02 = 'operazione non annullabile';
  this.message.image = 'Info.png';
  this.message.id = key;

  let res = await this.messageService.update(this.message).subscribe(
    response => {
         if(response['rc'] === 'ok') {
          // alert('aggiornato messaggio');
           this.showMessagePopup(this.message);
          }
      },
    error => {
      alert('nav  -- updateMessage - errore: ' + error.message);
      console.log(error);
    });
}

showMessagePopup(message: Message) {
  console.log('showMessagePopup - lancio popup');
 // this.prenotazione = new Prenotazione();
 // this.prenotazione.id = 1;

  const ref = this.modalService.open(MessageComponent , {size:'lg'});
  ref.componentInstance.selectedUser = message;

  ref.result.then(
      (yes) => {
        console.log('Click YES');
alert('effettuo il rilascio dei posti');
        this.loadsettfilaposti(this.evento.id);
        this.creaposti();
        this.aggiornaStatoBiglietti();
        // quando torno da save su popup faccio elenco per riaggiornare la situazione
        // non funziona perchè sono su prodotto e non prodotti
      },
      (cancel) => {
        alert('rilascio abbandonato da utente');
        console.log('click Cancel');
      }
    );


}

registra() {
  this.router.navigate(['/evento/' + this.evento.id + '/PostiDetail']);
}

goback() {
  this.router.navigate(['/socio']);
  }



     async creaposti() {

     //  alert('commandaW - creaarigheCommanda');

       for(const posto of this.eventosettfilaposti) {
          if(posto.stato == 1) {
            return;
          } else {
            this.nmaxloop = posto.postoEnd - posto.postoStart + 1;
            this.nposto = posto.postoStart - 1;
            for(this.i = 0; this.i < this.nmaxloop; this.i++) {
              this.eventoposto = new EventoPosto();
              this.eventoposto.idEvento = this.evento.id;
              this.eventoposto.idSettore = posto.idSettore;
              this.eventoposto.idFila = posto.idFila;
              this.eventoposto.idPosto = this.nposto += 1;
              this.eventoposto.key_utenti_operation = +localStorage.getItem('id');
              let rc =  await this.eventopostoService.create(this.eventoposto).subscribe(
                response => {
                    if(response['rc'] === 'ok') {
            //                  alert('----------------------    inserito commandariga' + prg);
                    }
                },
                error =>
                {
                  console.log(error);
                  this.Message = error.message;
                  this.alertSuccess = false;
                  this.isVisible = true;
                  this.showNotification(this.type, this.Message);
                });
             }
          }
        }

     }

  async aggiornaStatoBiglietti()  {
    this.evento.statobiglietti = 1;
    if(this.evento.statoposti == 1) {
      this.evento.stato = 1;
    }
    let rc =  await this.eventoService.update(this.evento).subscribe(
      response => {
          if(response['rc'] === 'ok') {
            this.Message = 'Posti rilasciati Regolarmente per i settori abilitati';
            this.Message1 = '';
            this.alertSuccess = true;
            this.isVisible = true;
            this.showNotification(this.type, this.Message);
          }
      },
      error =>
      {
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
        this.isVisible = true;
        this.showNotification(this.type, this.Message);
      });


     }











}



*/

/*   ----------------------------------------  secondo

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { Elemento } from '../../../classes/Elemento';

import { TstatoLogistica } from './../../../classes/T_stato_logistica';
// service

import { LogsettfilapostoService } from '../../../services/logsettfilaposto.service';
import { LogpostoService } from './../../../services/logposto.service';
import { ElementoService } from './../../../services/elemento.service';
import { TstatologisticaService } from './../../../services/tstatologistica.service';


// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NgForm } from '@angular/forms';
// popup
import { LogisticapopComponent } from '../../../components/popups/logisticapop/logisticapop.component';  // popup per visualizzazione logistica
import { ElempopComponent } from '../../../components/popups/elempop/elempop.component';  // popup per registrazione nuovi settori/file


@Component({
  selector: 'app-logistica-detail-posti',
  templateUrl: './logistica-detail-posti.component.html',
  styleUrls: ['./logistica-detail-posti.component.css']
})
export class LogisticaDetailPostiComponent implements OnInit {




  public elemento: Elemento;

  public title = "Gestione logisticaestazione";



// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTrash = faTrash;
  faReply = faReply;

  // variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;

  public isSelected = false;

  public saveValueStd: boolean;
  public lastNumber = 0;
  public fase = '';


  public isLoading = false;
  public fieldVisible = false;
  public messageTest1  = 'Operazione conclusa correttamente ';


  public statoStampa = '';

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
public idlogistica = 0;
public functionSelected = '';

public selectedSettore = 0;
public selectedFila = 0;

public selectedweb = 0;
public selectedSta = 0;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';


public searchInqu = 'Inqu';
public searchEdit = 'Edit';
public searchEdits = 'Edits';
public searchNew = 'New';

public functionUrlUp = '';
public functionUserUp = '';

public rottafase = '';
public rottaLogistica = 0;
public dataOdierna;
public anno  = 0;
public namepage = ' - Logistica-detail-Posti';
public selectedStato = 0;
public pathimage = '';
public tipoSettore = 'S';
public tipoFila = 'F';
public dsettore = '';
public viewAllSettori = false;
public viewAllFile = false;

public isCheckedSettori = '';
public isCheckedFile = '';

public postoStart = 0;
public postoEnd = 0;
public lastoperation = '';
public lastoperationpop = '';

public idSet = 0;
public idFil = 0;
public swinerror = false;


constructor(public modalService: NgbModal,
            private logisticaService: LogisticaService,
            private statologisticaService: TstatologisticaService,
            private logsettoreService: LogsettoreService,
            private logfilaService: LogfilaService,
            private logsettfilapostoService: LogsettfilapostoService,
            private elementoService: ElementoService,
            private logpostoService: LogpostoService,
            private route: ActivatedRoute,
            private router: Router,
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
              this.logsettfilaposto = new LogSettFilaPosti();
              this.logsettfilaposto.postoStart = 0;
              this.logsettfilaposto.postoEnd = 0;

              this.logsettfilapostow = new LogSettFilaPosti();
              this.logsettfilapostow.postoStart = -1;
              this.logsettfilapostow.postoEnd = -1;

              this.loadStati();

              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[2].path;
              this.rottaLogistica = +this.route.snapshot.url[1].path;
              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);


              this.loadLogistica(this.rottaLogistica);

              this.loadSettori(this.rottaLogistica);

              if(this.rottafase === 'new') {
                this.fase = 'N';
                this.title = 'Inserimento nuova logistica' + this.namepage;
                this.Message = 'inserire i dati della nuova logistica';
                this.logistica = new Logistica();
                this.logistica.key_utenti_operation = +localStorage.getItem('id');
                this.logistica.d_stato_logistica = 'in fase inserimento';
              } else {
                  this.fase = 'M';
                  this.title = 'Aggiornamento logistica '  + this.namepage;
                  this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('idp');
                  console.log('id recuperato: ' + this.idpassed);
                  //  this.loadLogistica(this.rottaLogistica);  // devo leggere solo la testata della logistica
                //  this.logsettfilapostow = new LogSettFilaPosti();    //2022/07/02
                //  this.loadLogisticaposti(this.idpassed);             // 2022/07/02

                // verifico se provengo da modifica posti con popup



                this.Message = 'pronto per aggiornamento Posti Logistica';

              });


              this.lastoperationpop = localStorage.getItem('lastoperationpop');
console.log('localstorage --- ' + localStorage.getItem('lastoperationpop'));



               if(this.lastoperationpop === 'logpostipop') {
                 alert('trovato localstorage per popup')
                 this.lastoperation = localStorage.getItem('lastoperation');
                 // normalizzo la variabile user salvata con JSON.stringify
                 const logsettfilapostow = new LogSettFilaPosti();
                 const data = JSON.parse(localStorage.getItem('logsettfilaposti'));
                 if (data) {
                   logsettfilapostow.idSettore = data.idSettore;
                   logsettfilapostow.idFila = data.idFila;
                 }
                 switch (this.lastoperation)  {
                   case 'SelectedFila':
                   console.log(' ------------  SelectedFila ---------------------------      uscita 1');
                        this.viewAllFile = true;
                        this.loadPostibySettFila(this.logistica.id, logsettfilapostow.idSettore, logsettfilapostow.idFila);

                        break;
                   case 'SelectedSettore':
                   console.log(' ------------  SelectedSettore ---------------------------      uscita 2');
                        this.viewAllSettori = true;
                        this.loadPostibySett(this.logistica.id, logsettfilapostow.idSettore);
                        break;
                   case 'ChangeSettori':
                   console.log(' ------------  ChangeSettori ---------------------------      uscita 3');
                         this.viewAllSettori = true;
                         this.loadlogSettori(this.logistica.id);
                         break;
                   case 'ChangeFile':
                   console.log(' ------------  ChangeFile ---------------------------      uscita 4');
                         this.viewAllFile = true;
                         this.loadlogSettoriFile(this.logistica.id, logsettfilapostow.idSettore);
                         break;
                 default:
                   alert('logistica-detail-posti - funzione non ancora attivata');
                   break;
                 }
                 localStorage.removeItem('lastoperationpop');
                 localStorage.removeItem('lastoperation');
                 localStorage.removeItem('logsettfilaposti');
                 localStorage.removeItem('lastFila');
                 localStorage.removeItem('lastSettore');
               }



             }
       }



       async loadLogisticaposti(id: number) {
         console.log('frontend - lloadLogisticaposti: ' + id);
         let rc = await  this.logsettfilapostoService.getbyId(id).subscribe(
         response => {
           if(response['rc'] === 'ok') {
             console.log('loadLogisticaposti da editare  ' + JSON.stringify(response['data']));
             this.logsettfilapostow = response['data'];
             this.selectedSettore = this.logsettfilapostow.idSettore;
             this.selectedFila = this.logsettfilapostow.idFila;
             this.onSelectedSettore(this.selectedSettore);
             this.onSelectedFila(this.selectedFila);
           }
           if(response['rc'] === 'nf') {
             console.log('loadLogisticaposti: --  nf ' + id);
             this.logsettfilapostow = this.logsettfilapostonull;
             this.selectedSettore = 0;
             this.selectedFila = 0;
             this.Message = response['message'];
             this.type = 'error';
             this.showNotification( this.type, this.Message);
           }
         },
           error => {
               alert('Socio-Detail  --loadSocio: ' + error.message);
               console.log(error);
               this.alertSuccess = false;
               this.Message = error.message;
               this.type = 'error';
               this.showNotification( this.type, this.Message);
           });
         }







       async loadLogistica(id: number) {
         console.log('frontend - loadlogistica: ' + id);
         let rc = await  this.logisticaService.getbyId(id).subscribe(
         response => {
           if(response['rc'] === 'ok') {
             console.log('logisticaestazione da editare  ' + JSON.stringify(response['data']));
             this.logistica = response['data'];
             this.pathimage = environment.APIURL + '/upload/files/eventos/' + this.logistica.photo;
           }
           if(response['rc'] === 'nf') {
             this.Message = response['message'];
             this.type = 'error';
             this.showNotification( this.type, this.Message);
           }
         },
           error => {
               alert('Socio-Detail  --loadSocio: ' + error.message);
               console.log(error);
               this.alertSuccess = false;
               this.Message = error.message;
               this.type = 'error';
               this.showNotification( this.type, this.Message);
           });
         }

         async  loadStati() {
           console.log('');
           let rc = await this.statologisticaService.getAll().subscribe(
               resp => {
                     console.log('loadStati: ' + JSON.stringify(resp['data']));
                     if(resp['rc'] === 'ok') {
                       this.statilogistica = resp['data'];
                     }
                  },
               error => {
                    alert('sono in loadStati');
                    console.log('loadStati - errore: ' + error);
                    this.type = 'error';
                    this.Message = error.message;
                    this.showNotification(this.type, this.Message);
                });
            }

            async  loadSettori(id: number) {
             console.log('');
             let rc = await this.logsettoreService.getAll(id).subscribe(
                 resp => {
                       console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                       if(resp['rc'] === 'ok') {
                         this.logsettori = resp['data'];
                       }
                       if(resp['rc'] === 'nf') {
                         this.logsettori = this.logsettorinull;
                       }
                    },
                 error => {
                      alert('sono in loadSettori');
                      console.log('loadSettori - errore: ' + error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.showNotification(this.type, this.Message);
                  });
              }

              async  loadSettore(id: number) {
               console.log('');
               let rc = await this.logsettoreService.getbyId(id).subscribe(
                   resp => {
                         console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                         if(resp['rc'] === 'ok') {
                           this.logsettore = resp['data'];
                           this.dsettore = this.logsettore.dsettore;
                         }
                         if(resp['rc'] === 'nf') {
                           this.logsettori = this.logsettorinull;
                         }
                      },
                   error => {
                        alert('sono in loadSettori');
                        console.log('loadSettori - errore: ' + error);
                        this.type = 'error';
                        this.Message = error.message;
                        this.showNotification(this.type, this.Message);
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
                 this.logistica.stato = selectedValue;
                }

            }




            onSelectedSettore(selectedValue: number) {
             //  alert('selezionato: ' + selectedValue);
               if(selectedValue ==  9999) {
                 this.type = 'error';
                 this.Message = 'selezione non corrette';
                 this.showNotification(this.type, this.Message);
                 this.alertSuccess = false;
                 this.isVisible = true;
                 this.selectedSettore = 0;
                 this.logfile = this.logfilenull;
                 return;
              } else {
               this.loadSettore(selectedValue);
               console.log('fatto selezione Settore - selezionato: ' + this.logistica.id + ' settore ' + selectedValue);
               this.loadFile(this.logistica.id, selectedValue);
               this.selectedSettore = selectedValue;
               this.logsettfilaposto.idSettore = selectedValue;
               this.loadPostibySett(this.logistica.id, this.selectedSettore);
               this.viewAllSettori = true;
               this.viewAllFile = false;
               this.lastoperation = 'SelectedSettore';
               localStorage.setItem('lastoperation', this.lastoperation);
               localStorage.setItem('lastSettore', String(this.logsettfilaposto.idSettore));
              }

          }



          onSelectedFila(selectedValue: number) {
           //  alert('selezionato: ' + selectedValue);
             if(selectedValue ==  9999) {
               this.type = 'error';
               this.Message = 'selezione non corrette';
               this.showNotification(this.type, this.Message);
               this.alertSuccess = false;
               this.isVisible = true;
               this.selectedFila = 0;
               return;
            } else {
             console.log('fatto selezione file - selezionato: ' + this.logistica.id + ' fila ' + selectedValue);
             this.loadFilaposti(this.logistica.id);
             this.selectedFila = selectedValue;
             this.logsettfilaposto.idFila = selectedValue;
             this.loadPostibySettFila(this.logistica.id, this.selectedSettore, this.selectedFila);
             this.lastoperation = 'SelectedFila';
             localStorage.setItem('lastoperation', this.lastoperation);
             localStorage.setItem('lastSettore', String( this.selectedSettore));
             localStorage.setItem('lastFila', String(this.logsettfilaposto.idFila));
            }

        }

 async    loadPostibySettFila(idlog: number, idSettore: number, idFila: number) {
    let rc = await   this.logsettfilapostoService.getbySettFila(idlog, idSettore, idFila).subscribe(
         res => {
               if(res['rc'] === 'ok') {
                 this.logsettfilapostow = res['data'];
               }
               if(res['rc'] === 'nf') {
                 this.logsettfilapostow.postoStart = -1;
                 this.logsettfilapostow.postoEnd = -1;
               }
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
     }

     async    loadPostibySett(idlog: number, idSettore: number) {
       let rc = await   this.logsettfilapostoService.getbySett(idlog, idSettore).subscribe(
            res => {
                  if(res['rc'] === 'ok') {
                    this.logsettfilapostow = res['data'];
                  }
                  if(res['rc'] === 'nf') {
                    this.logsettfilapostow.postoStart = -1;
                    this.logsettfilapostow.postoEnd = -1;
                  }
               },
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
        }








   async     loadFile(id: number, idsett: number) {

     console.log(' ------------------   loadFile: ' + id + ' idsett: ' + idsett);

     let rc = await this.logfilaService.getAll(id, idsett).subscribe(
       resp => {
             console.log(' ------------------------------   loadFile: ' + JSON.stringify(resp['data']));
             if(resp['rc'] === 'ok') {
               this.logfile = resp['data'];
             }
             if(resp['rc'] === 'nf') {
               this.logfile = this.logfilenull;
             }
          },
       error => {
            alert('sono in loadFile');
            console.log('loadFile - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.showNotification(this.type, this.Message);
          });
        }

     async   loadFilaposti(id: number)  {

       let rc = await this.logsettfilapostoService.getAll(id).subscribe(
         resp => {
               console.log('loadFilaposti: ' + JSON.stringify(resp['data']));
               if(resp['rc'] === 'ok') {
                 this.logsettfilaposto = resp['data'];
               }
               if(resp['rc'] === 'nf') {
                 this.logsettfilaposto = this.logsettfilapostonull;
               }
           },
         error => {
              alert('sono in loadFilaposti');
              console.log('loadFilaposti - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
            });
          }


        nuovoElemento(tipo: string) {
         alert('da fare --- passato: ' + tipo);
         if(tipo === 'F') {
           if(this.selectedSettore === 0) {
             alert('Selezionare il settore se vuoi inserire la fila !!');
             return;
           }
           alert('richiesto fila - settore: ' + this.selectedSettore);
         }
         if(tipo === 'S') {
           this.selectedSettore = 0;
           this.dsettore = '';
           alert('richiesto Settore - settore: ' + this.selectedSettore);
         }

         this.cancellaAllelementi();
         this.elemento = new Elemento();
         this.elemento.idsettore = this.selectedSettore;
         this.elemento.dsettore = this.dsettore;

         console.log('nuovoElemento ----------  dati passati: ' + JSON.stringify(this.elemento));


         const ref = this.modalService.open(ElempopComponent, {size:'lg'});
         ref.componentInstance.selectedUser = this.elemento;

         ref.result.then(
            (yes) => {
              console.log('Click YES');

              // leggo il file con elemento caricato
              this.loadElementoNuovo();


             // this.loadlocalita();
              //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
            },
            (cancel) => {
              console.log('click Cancel');
            }
          );
        }

        loadElementoNuovo() {
         this.elementoService.getlast().subscribe(
           resp => {
                if(resp['rc'] === 'ok') {
                 console.log('loadelementoNuovo ---- per creare nuovo settore/file ' + JSON.stringify(resp['data']));
                 this.elemento = resp['data'];
                 if(this.elemento.idsettore !== 0) {
                   this.logfila = new LogFila();
                   this.logfila.idSettore = this.elemento.idsettore;
                   this.logfila.idLogistica = this.logistica.id;
                   this.logfila.dfila = this.elemento.delemento;
                   this.logfila.key_utenti_operation = +localStorage.getItem('id');
                   console.log('loadnuovoelemento- creazione fila ' + JSON.stringify(this.logfila));
                   this.creazioneNuovaFila(this.logfila);
                }  else {
                   this.logsettore = new LogSettore();
                   this.logsettore.idLogistica = this.logistica.id;
                   this.logsettore.dsettore = this.elemento.delemento;
                   this.logsettore.key_utenti_operation = +localStorage.getItem('id');
                   console.log('loadnuovoelemento- creazione Settore ' + JSON.stringify(this.logsettore));
                   this.creazioneNuovoSettore(this.logsettore);

                 }
               }
             },
           error => {
                alert('sono in cancellaAllelementi');
                console.log('cancellaAllelementi - errore: ' + error);
                this.type = 'error';
                this.Message = error.message;
                this.showNotification(this.type, this.Message);
              });
        }

       creazioneNuovoSettore(logsettore: LogSettore) {
         this.logsettoreService.create(logsettore).subscribe(
           resp => {
                if(resp['rc'] === 'ok') {
                 console.log('creazioneNuovoSettore ---- inserito nuovo settore ' + JSON.stringify(resp['data']));
                 this.loadSettori(this.logistica.id);
                 }
             },
           error => {
                alert('sono in creazioneNuovoSettore');
                console.log('creazioneNuovoSettore - errore: ' + error);
                this.type = 'error';
                this.Message = error.message;
                this.showNotification(this.type, this.Message);
              });
       }


       creazioneNuovaFila(logfila: LogFila) {
         this.logfilaService.create(logfila).subscribe(
           resp => {
                if(resp['rc'] === 'ok') {
                 console.log('creazioneNuovaFila ---- inserito nuova fila ' + JSON.stringify(resp['data']));
               }
             },
           error => {
                alert('sono in creazioneNuovoSettore');
                console.log('creazioneNuovoSettore - errore: ' + error);
                this.type = 'error';
                this.Message = error.message;
                this.showNotification(this.type, this.Message);
              });
       }


        cancellaAllelementi() {
          this.elementoService.deleteAll().subscribe(
           resp => {
                if(resp['rc'] === 'ok') {
                // non fa noiente
                 }
             },
           error => {
                alert('sono in cancellaAllelementi');
                console.log('cancellaAllelementi - errore: ' + error);
                this.type = 'error';
                this.Message = error.message;
                this.showNotification(this.type, this.Message);
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


 open(content) {
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     this.closeResult = `Closed with: ${result}`;
     // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
     if(result ===  'Cancel click') {
        this.cancellazioneAbort();
     }
     if(result ===  'Delete click') {
       // gestire uscita da popup
       this.cancellaUser(this.logistica);
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


 cancellaUser(logistica: Logistica) {

   this.logisticaService.delete(logistica).subscribe(
       response => {
         if(response['ok']) {
           this.isVisible = true;
           this.alertSuccess = true;
           this.type = 'success';
           this.Message = 'logisticaestazione cancellata correttamente';
           this.showNotification(this.type, this.Message);
         }
     },
     error =>
         {
           this.isVisible = true;
           this.alertSuccess = false;
           this.type = 'error';
           this.Message = 'Errore cancellazione User' + '\n' + error.message;
           this.showNotification(this.type, this.Message);
           console.log(error);
         });
 }

 goback() {
   this.router.navigate(['logistica']);
 }

 conferma() {
   console.log('conferma - fase: ' + this.fase);
   if(this.selectedSettore == 0) {
     if(this.fase === 'N') {
       alert('Selezionare il Settore - Inserimento non possibile');
       return;
     }
     if(this.fase === 'M') {
       alert('Selezionare il Settore - Modifica non possibile');
       return;
     }
   }
   if(this.selectedFila == 0) {
     if(this.fase === 'N') {
       alert('Selezionare la Fila - Inserimento non possibile');
       return;
     }
     if(this.fase === 'M') {
       alert('Selezionare la Fila - Modifica non possibile');
       return;
     }
   }

   this.postoStart = +this.logsettfilapostow.postoStart;
   this.postoEnd = +this.logsettfilapostow.postoEnd;


   if(this.postoEnd < this.postoStart) {
       alert('il posto finale deve essere maggiore del posto iniziale !!');
       return;
   }

   this.logsettfilapostowork = new LogSettFilaPosti();
   this.logsettfilaposto = new LogSettFilaPosti();

   this.logsettfilaposto.idLogistica = this.logistica.id;
   this.logsettfilaposto.idSettore = this.selectedSettore;
   this.logsettfilaposto.idFila = this.selectedFila;
   this.logsettfilaposto.stato = this.selectedStato;
   this.logsettfilaposto.postoStart = this.postoStart;
   this.logsettfilaposto.postoEnd = this.postoEnd;
   this.logsettfilaposto.key_utenti_operation = +localStorage.getItem('id');

   // ogni volta devo fare una verifica se esiste un record con settore e file.
   // se esiste faccio modifica
   // se non esiste faccio insert
   this.logsettfilapostoService.getbySettFila(this.logistica.id, this.selectedSettore, this.selectedFila).subscribe(
     res => {
           if(res['rc'] === 'ok') {
             this.logsettfilapostowork = res['data'];
             this.logsettfilaposto.id = this.logsettfilapostowork.id;
             this.modificalogsettorefilaposti(this.logsettfilaposto);
           }
           if(res['rc'] === 'nf') {
             this.inseriscilogsettorefilaposti(this.logsettfilaposto);
           }
        },
       error => {
          console.log(error);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
       });




 }

async modificalogsettorefilaposti(logsettfilaposto: LogSettFilaPosti) {
  let rc = await this.logsettfilapostoService.update(logsettfilaposto).subscribe(
     res => {
           this.type = 'success';
           this.Message = res['message'];
           this.alertSuccess = true;
           this.viewAllSettori = false;
           this.viewAllFile = true;
           this.loadlogSettoriFile(this.logistica.id, this.selectedSettore);
        },
       error => {
          console.log(error);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
       });
 }

 async inseriscilogsettorefilaposti(logsettfilaposto: LogSettFilaPosti) {
   let rc = await this.logsettfilapostoService.create(logsettfilaposto).subscribe(
      res => {
            this.type = 'success';
            this.Message = res['message'];
            this.alertSuccess = true;
            this.viewAllSettori = false;
            this.viewAllFile = true;
            this.loadlogSettoriFile(this.logistica.id, this.selectedSettore);
         },
        error => {
           console.log(error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
        });
  }


  async   loadlogSettoriFile(idlog: number, idsett: number) {
   console.log('loadlogSettoriFile - appena entrato -- idLogistica ' + idlog + ' srttore: ' + idsett);
   let rc = await this.logsettfilapostoService.getbySett(idlog, idsett).subscribe(
       resp => {
             console.log('loadlogSettoriFile: ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
             if(resp['rc'] === 'ok') {
               this.logsettfilaposti = resp['data'];
             }
             if(resp['rc'] === 'nf') {
               this.logsettfilaposti = this.logsettfilapostinull;
             }
          },
       error => {
            alert('sono in loadlogSettoriFile');
            console.log('loadlogSettoriFile - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.showNotification(this.type, this.Message);
        });
 }


 reset() {
   switch (this.fase)  {
       case 'N':
       this.logistica = new Logistica();
       this.type = 'success';
       this.Message = 'Inserire i dati della logisticaestazione';
       this.alertSuccess = true;
       break;
     case 'M':
       this.logisticaService.getbyId(this.logistica.id).subscribe(
       res => {
             this.logistica = res['data'];
             this.type = 'success';
             this.Message = 'situazione attuale logistica';
             this.alertSuccess = true;
          },
         error => {
            console.log(error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
         });
       break;
     default:
       alert('nav - funzione non ancora attivata');
       break;
   }
   this.showNotification(this.type, this.Message);
 }

async rilascia() {
this.logistica.stato = 1; // rilasciati posti
let rc = await this.logisticaService.update(this.logistica).subscribe(
   res => {
         this.logistica = res['data'];
         this.type = 'success';
         this.Message = 'Posti rilasciati - Logistica utilizzabile'; // res['message'];          //'utente aggiornato con successo del cazzo';
         this.alertSuccess = true;
         this.router.navigate(['/logistica']);
      },
     error => {
        console.log(error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
     });
}





async checkAllPosti() {

   let rc = await this.logsettfilapostoService.getAll(this.logistica.id).subscribe(
     resp => {
           console.log('rilascia: ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
           if(resp['rc'] === 'ok') {
             this.logsettfilaposti = resp['data'];
             this.controllaPosti();
           }
     },
     error => {
          alert('sono in loadlogSettori');
          console.log('loadlogSettori - errore: ' + error);
          this.type = 'error';
          this.Message = error.message;
          this.showNotification(this.type, this.Message);
      });
 }


 async controllaPosti() {

   //  alert('commandaW - creaarigheCommanda');
     let prg = 0;
     let pStart = 0;
     let pEnd = 0;
     let stato = 0;
     let dstato = '';
     this.swinerror = false;

     for(const filaposti of this.logsettfilaposti) {
       prg = prg + 1;
       if(prg === 1) {
         pStart = filaposti.postoStart;
         pEnd = filaposti.postoEnd;
         dstato = 'Correct';
         stato = 2;
       } else {
         if(filaposti.postoStart <= pEnd) {
           stato = 1;
           dstato = 'In Error';
           this.swinerror = true;
         }
         if(filaposti.postoStart > pEnd) {
           stato = 2;
           dstato = 'Correct';
         }
       }
       pEnd = filaposti.postoEnd;
       filaposti.stato = stato;
       filaposti.errorposti = dstato;
       await this.logsettfilapostoService.update(filaposti).subscribe(
               response => {
                   if(response['rc'] === 'ok') {
           //     non fa niente
                   }
               },
               error =>
               {
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
               }
           );
     }
     if(this.swinerror === true) {
        this.Message = "Rilevati errori";
        this.alertSuccess = false;
     }
     if(this.swinerror === false) {
       this.Message = "Situazione corretta dei posti";
       this.alertSuccess = true;
    }
     this.loadsituazionePosti();
 }







async loadsituazionePosti() {
let rc = await this.logsettfilapostoService.getAll(this.logistica.id).subscribe(
 resp => {
       console.log('loadsituazionePosti: ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
       if(resp['rc'] === 'ok') {
         this.logsettfilaposti = resp['data'];
       }
 },
 error => {
      alert('sono in loadlogSettori');
      console.log('loadlogSettori - errore: ' + error);
      this.type = 'error';
      this.Message = error.message;
      this.showNotification(this.type, this.Message);
  });
}




 onChangeSettori(e){
  // console.log(e.target.checked); // {}, true || false
   console.log(e);
   if(e === 'S') {
//     alert('ho fleggato il checkbox per settori');
     this.viewAllSettori = true;
     this.viewAllFile = false;
     // creare metodo per elenco con settori
     this.loadlogSettori(this.logistica.id);
     this.lastoperation = 'ChangeSettori';
     localStorage.setItem('lastoperation', this.lastoperation);   // creata solo in fase di modifica posti con popup
     // eseguo
   }
   if(e === 'N') {
     this.viewAllSettori = false;
   }
 }

 onChangeFile(e){
   // console.log(e.target.checked); // {}, true || false
    console.log(e);
    if(e === 'S') {
  //    alert('ho fleggato il checkbox per file');
      this.viewAllSettori = false;
      this.viewAllFile = true;
     //      this.isCheckedSettori = 'N';
      this.loadlogSettoriFile(this.logistica.id, this.selectedSettore);
      this.lastoperation = 'ChangeFile';
      localStorage.setItem('lastoperation', this.lastoperation);
      localStorage.setItem('lastSettore', String(this.selectedSettore));
    }
  }



   async  loadlogSettori(id: number) {
     console.log('');
     let rc = await this.logsettfilapostoService.getAll(id).subscribe(
         resp => {
               console.log('loadlogSettori: ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
               if(resp['rc'] === 'ok') {
                 this.logsettfilaposti = resp['data'];
                 this.controllaPosti();
               }
               if(resp['rc'] === 'nf') {
                 this.logsettfilaposti = this.logsettfilapostinull;
               }
            },
         error => {
              alert('sono in loadlogSettori');
              console.log('loadlogSettori - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
          });
      }







 viewlogistica() {
   // --------------  versione con utilizzo popup

 // alert('nuovaLocalita - lancio la registrazione Prodotto via popup');

  // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione



  //  lancio con popup

  this.logisticaw = new Logistica();
  this.logisticaw = this.logistica;

   console.log('viewlogistica ----------  dati passati: ' + JSON.stringify(this.logisticaw));


  const ref = this.modalService.open(LogisticapopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = this.logistica;

  ref.result.then(
     (yes) => {
       console.log('Click YES');
       // non devo fare nulla

     },
     (cancel) => {
       console.log('click Cancel');
     }
   );
}






}




*/
