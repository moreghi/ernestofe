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
  selector: 'app-eventi-mappa',
  templateUrl: './eventi-mappa.component.html',
  styleUrls: ['./eventi-mappa.component.css']
})
export class EventiMappaComponent implements OnInit {

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
public inx = 0;

public stato = 1;  // stato aperto
public nomeevento: string[] = [];
public idevento: number[] = [];

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



             this.stato = 1;
             this.loadManifestazioneActive(this.stato);

             }

             async loadManifestazioneActive(stato: number) {
              console.log('frontend - loadManifestazioneActive: ' + stato);
              let rc = await  this.manifestazioneService.getManifAttiva(stato).subscribe(
                response => {
                    this.manif = response['data'];
                    this.loadEventi(this.manif.id);
                  },
                error => {
                  alert('Manif-Data  --loadManifestazioneActive: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadManifestazioneActive' + '\n' + error.message;
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
                        this.salvanomieventi();
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

      async registra(id: number) {
        // alert('tratto evento: ' + id);
        console.log('eventi-mappa ------ registra: ' + id);
        // leggo evento e in funzione se con logistica o senza modifico la rotta per la visualizzazione della mappa di richiesta prenotazione

        let rc = await  this.eventoService.getbyId(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                this.evento = response['data'];
                console.log('eventi-mappa ---  registra: ' + JSON.stringify(response['data']));
                if(this.evento.idtipo == 2) { // con logistica
                  let xx = 'evento/registrazione/logisticax/' + this.evento.id;   // test
                  console.log('lancio: ' + xx);
                  this.router.navigate(['evento/registrazione/logisticax/' + this.evento.id]);
                }
                if(this.evento.idtipo == 0) { // senza logistica
                  let xx1 = 'evento/registrazione/normalx/' + this.evento.id;   // test
                  console.log('lancio: ' + xx1);
                  this.router.navigate(['evento/registrazione/normalx/' + this.evento.id]);
                }
               }
              if(response['rc'] === 'nf') {
                this.Message = 'evento ineststente - non prenotabile';
                this.nRec = 0;
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
                return;
               }

            },
          error => {
            alert('registra: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore registra' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
           });

      }


      salvanomieventi() {

        for(const evento of this.eventi) {
          this.nomeevento.push(evento.descrizione);
          this.idevento.push(evento.id);
        }
        /*
        for(let x:number=0;x<this.nomeevento.length;x++) {
          console.log((x+1) + ')' + this.nomeevento[x]);
        } */
        for(this.inx = 0; this.inx < this.nomeevento.length; this.inx++) {
          console.log((this.inx + 1) + ')' + this.nomeevento[this.inx] + ' ' + this.idevento[this.inx]);
        }

      }


    }






