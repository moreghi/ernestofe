
import { Component, OnInit } from '@angular/core';
// services
import { ManifestazioneService} from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { EventosettfilapostiService } from './../../../services/eventosettfilaposti.service';
import { MessageService } from '../../../services/message.service';
import { EventopostoService } from '../../../services/eventoposto.service';
// Models
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';
import { EventoPosto } from '../../../classes/Eventoposto';
import { Message } from '../../../classes/Message';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// componente
import { MessageComponent } from '../../../components/popups/message/message.component';
@Component({
  selector: 'app-evento-posti',
  templateUrl: './evento-posti.component.html',
  styleUrls: ['./evento-posti.component.css']
})
export class EventoPostiComponent implements OnInit {

 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faInfoCircle = faInfoCircle;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;

  public title = 'merdaaaaaaa';

  public manif: Manifestazione;
  public evento: Evento;
  public eventonull: Evento;
  public eventosettfilaposti: Eventosettfilaposti[] = [];
  public eventosettfilapostinull: Eventosettfilaposti[] = [];
  public eventosettfilaposto: Eventosettfilaposti;
  public eventoposto: EventoPosto;
  public message: Message;

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutti',
    'Attivi',
    'Bloccati'
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
public mess = '';



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
public dataEvento: Date;
public tot = 0;
public tok = 0;
public tko = 0;
public nmaxloop = 0;
public nposto = 0;
public i = 0;

constructor(private manifestazioneService: ManifestazioneService,
            private eventoService: EventoService,
            private eventosettfilapostiService: EventosettfilapostiService,
            private eventopostoService: EventopostoService,
            private messageService: MessageService,
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
                console.log('goApplication - evento Ticket --------  appena entrato');

                this.isVisible = true;
                this.alertSuccess = true;
                //  this.loadlocalita();

                // this.rotta = this.route.snapshot.url[0].path;
                // this.rottafase = this.route.snapshot.url[1].path;

                this.route.paramMap.subscribe(p => {
                this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
                this.loadEvento(this.idpassed);
                this.Message = 'pronto per aggiornamento Tipologie Biglietti';
                });

              }

              async loadManifestazione(id: number) {
                    console.log('frontend - loadManifestazione: ' + id);
                    let rc = await  this.manifestazioneService.getbyId(id).subscribe(
                    response => {
                        this.manif = response['data'];
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

              async loadEvento(id: number) {
                    console.log('frontend - loadEvento: ' + id);
                    let rc = await  this.eventoService.getbyId(id).subscribe(
                    response => {
                    if(response['rc'] === 'ok') {
                      this.evento = response['data'];
                      this.loadManifestazione(this.evento.idmanif);
                      this.loadsettfilaposti(this.evento.id);
                      this.recuperaTotali(id);
                     }
                    if(response['rc'] === 'nf') {
                      this.evento = this.eventonull;
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
    this.evento.statoposti = 1;
    if(this.evento.statobiglietti == 1) {
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



