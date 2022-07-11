
import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
// services
import { ManifestazioneService} from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { EventosettfilapostiService } from './../../../services/eventosettfilaposti.service';
// Models
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';

import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

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

  public title = 'merdaaaaaaa';

  public manif: Manifestazione;
  public evento: Evento;
  public eventonull: Evento;
  public eventosettfilaposti: Eventosettfilaposti[] = [];
  public eventosettfilapostinull: Eventosettfilaposti[] = [];
  public eventosettfilaposto: Eventosettfilaposti;

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
public dataEvento: Date;
public tot = 0;
public tok = 0;
public tko = 0;

constructor(private manifestazioneService: ManifestazioneService,
            private eventoService: EventoService,
            private eventosettfilapostiService: EventosettfilapostiService,
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
                  alert('ricevuto da figlio - totale ' + totale);
                  this.tot = totale;
                }
                totalefilepostiok(totaleok: number) {
                  alert('ricevuto da figlio - totaleok ' + totaleok);
                  this.tok = totaleok;
                }
                totalefilepostiko(totaleko: number) {
                  alert('ricevuto da figlio - totaleko ' + totaleko);
                  this.tko = totaleko;

                }


}





/*




@Component({
  selector: 'app-evento-ticket',
  templateUrl: './evento-ticket.component.html',
  styleUrls: ['./evento-ticket.component.css']
})
export class EventoTicketComponent implements OnInit {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco tipologia biglietti  - evento ticket";







  registra() {
  //alert('da fare');
   this.router.navigate(['tbiglietto/new/' + this.evento.id]);



  }



  }



*/
