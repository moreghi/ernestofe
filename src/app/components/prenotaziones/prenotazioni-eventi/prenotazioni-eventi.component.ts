import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { Evento } from '../../../classes/Evento';
import { Locandina } from '../../../classes/Locandina';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { PrenotazeventoService } from './../../../services/prenotazevento.service';
import { LocandinaService } from './../../../services/locandina.service';



// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-prenotazioni-eventi',
  templateUrl: './prenotazioni-eventi.component.html',
  styleUrls: ['./prenotazioni-eventi.component.css']
})
export class PrenotazioniEventiComponent implements OnInit {

  public manif: Manifestazione;
  public eventi: Evento[] = [];
  public evento: Evento;
  public locandina: Locandina;

  public title = "Eventi della Manifestazione";

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
  public Message = '';
  public isSelected = false;

  public saveValueStd: boolean;
  public lastNumber = 0;
  public fase = '';
  public pathimage = '';
  public pathimageEvent = '';

  public isLoading = false;
  public fieldVisible = false;
  public messageTest1  = 'Operazione conclusa correttamente ';

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';

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

  public functionInqu =  false;
  public functionEdit = false;
  public functionEdits = false;
  public functionNew = false;

  // funzioni di navigazione
  public navigateNew = 'new';
  public navigateInqu = 'inqu';
  public navigateEdit = 'edit';
  public navigateEdits = 'edits';

  public functionUser = '';


  // ---------------------


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

public selectedTit = 0;
public selectedRuo = 0;
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
public dataOdierna;
public anno  = 0;
public namepage = 'Prenotazione Eventi';
public selectedStato = 0;
public xxx = 5;

public activemanif1 = false;
public activemanif2 = false;
public activemanif3 = false;
public activemanif4 = false;
public activemanif5 = false;
public activemanif6 = false;
public activemanif7 = false;
public activemanif8 = false;
public activemanif9 = false;
public activemanif10 = false;
public activemanif11 = false;
public activemanif12 = false;

public pathimage0 = environment.APIURL + '/upload/files/eventos_locandina/nessunalocandina.png';

public pathimageEvento = environment.APIURL + '/upload/files/manifestaziones/';
public pathimageEvento1 = '';
public pathimageEvento2 = '';
public pathimageEvento3 = '';
public pathimageEvento4 = '';
public pathimageEvento5 = '';
public pathimageEvento6 = '';
public pathimageEvento7 = '';
public pathimageEvento8 = '';
public pathimageEvento9 = '';
public pathimageEvento10 = '';
public pathimageEvento11 = '';
public pathimageEvento12 = '';

public disponibileEvento1 = 0;
public disponibileEvento2 = 0;
public disponibileEvento3 = 0;
public disponibileEvento4 = 0;
public disponibileEvento5 = 0;
public disponibileEvento6 = 0;
public disponibileEvento7 = 0;
public disponibileEvento8 = 0;
public disponibileEvento9 = 0;
public disponibileEvento10 = 0;
public disponibileEvento11 = 0;
public disponibileEvento12 = 0;

public nameEvento1 = '';
public nameEvento2 = '';
public nameEvento3 = '';
public nameEvento4 = '';
public nameEvento5 = '';
public nameEvento6 = '';
public nameEvento7 = '';
public nameEvento8 = '';
public nameEvento9 = '';
public nameEvento10 = '';
public nameEvento11 = '';
public nameEvento12 = '';

public dataEvento1 = '';
public dataEvento2 = '';
public dataEvento3 = '';
public dataEvento4 = '';
public dataEvento5 = '';
public dataEvento6 = '';
public dataEvento7 = '';
public dataEvento8 = '';
public dataEvento9 = '';
public dataEvento10 = '';
public dataEvento11 = '';
public dataEvento12 = '';

public nEvento1 = 0;
public nEvento2 = 0;
public nEvento3 = 0;
public nEvento4 = 0;
public nEvento5 = 0;
public nEvento6 = 0;
public nEvento7 = 0;
public nEvento8 = 0;
public nEvento9 = 0;
public nEvento10 = 0;
public nEvento11 = 0;
public nEvento12 = 0;

public stato = 0;
public numEventi = 0;
public visualizzaLocandina = false;

constructor(private manifestazioneService: ManifestazioneService,
            private eventoService: EventoService,
            private prenotazeventoService: PrenotazeventoService,
            private locandinaService: LocandinaService,
            private route: ActivatedRoute,
            private router: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

            ngOnInit(): void {

               console.log('prenotazioni-eventi - sono in oninit' + this.Message);

               this.goApplication();

             }


             goApplication() {

              console.log('goApplication - appena entrato');
              this.isVisible = true;
              this.alertSuccess = true;
              this.visualizzaLocandina = false;

              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[1].path;

              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);

              this.title = this.namepage;
              this.route.paramMap.subscribe(p => {
              this.idpassed = +p.get('id');
              this.numEventi = +p.get('nev');
              console.log('id recuperato: ' + this.idpassed + ' numEventi:' + this.numEventi);
              if(this.idpassed > 0) {
                this.loadManifestazione(this.idpassed);
                this.loadeventibyManifestazione(this.idpassed);
                this.Message = 'Effettuare Prenotazione sugli Eventi disponibili';
              } else {
                this.Message = 'situazione eventi da Prenotare';
              }
              this.impostaCardEventi(this.numEventi);

              });

          }


          async loadManifestazione(id: number) {
            console.log('frontend - loadManifestazione: ' + id);
            let rc = await  this.manifestazioneService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('manifestazione da editare  ' + JSON.stringify(response['data']));
                this.manif = response['data'];
                this.pathimage = environment.APIURL + '/upload/files/manifestaziones/' + this.manif.photo;
                console.log('pathimageManif: ' + this.pathimage);
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


          async loadeventibyManifestazione(id: number) {

            console.log('frontend - loadeventibyManifestazione: ' + id);
            let rc = await  this.eventoService.getActivebyIdManif(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('loadeventibyManifestazione  ' + JSON.stringify(response['data']));
                this.eventi = response['data'];
                this.editaEventi(this.eventi);
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

            editaEventi(eventi: Evento[]) {

              let prg = 0;

              for(let evento of eventi) {
                prg = prg + 1;
                if(evento.locandina === 0) {
                  this.pathimageEvent =  this.pathimage0;
                } else {
                  this.pathimageEvent =  environment.APIURL + '/upload/files/eventos_locandina/' +  evento.photo;
                }
                this.countEvento(evento, prg, this.pathimageEvent);

                /*   vecchia logica -- fino al 07/06/2023
                if(evento.locandina === 0) {
                  this.pathimageEvent =  this.pathimage0;
                  this.countEvento(evento, prg, this.pathimageEvent);
                } else {
                  this.loadLocandina(evento, prg);
                }
                */
              }
              this.isVisible = true;
              this.alertSuccess = true;
              this.type = 'success';
              this.Message = 'situazione attuale Eventi da prenotare';
              this.showNotification(this.type, this.Message);

            }

  async loadLocandina(evento: Evento, prg: number) {
    console.log('frontend - loadLocandina: ' + evento.locandina);
    let rc = await  this. locandinaService.getbyId(evento.locandina).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('loadLocandina  ' + JSON.stringify(response['data']));
        this.locandina = response['data'];
        this.pathimageEvent =  environment.APIURL + '/upload/files/eventos_locandina/' +  this.locandina.photo;
        this.countEvento(evento, prg, this.pathimageEvent);
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

    async loadevento(id: number) {
      console.log('frontend - loadevento: ' + id);
      let rc = await  this.eventoService.getbyId(id).subscribe(
      response => {
        if(response['rc'] === 'ok') {
          console.log('loadevento  ' + JSON.stringify(response['data']));
          this.evento = response['data'];
          if(this.evento.idtipo === 1) {
            this.router.navigate(['evento/registrazione/normal/' + id]);    // 'prenEventi/nol/new/' + id
          }
          if(this.evento.idtipo === 2) {
            this.router.navigate(['prenEventi/new/' + id]);
          }
        }
        if(response['rc'] === 'nf') {
          this.Message = response['message'];
          this.type = 'error';
          this.showNotification( this.type, this.Message);
        }
      },
        error => {
              alert('Prenotazioni-eventi  --loadevento: ' + error.message);
              console.log(error);
              this.alertSuccess = false;
              this.Message = error.message;
              this.type = 'error';
              this.showNotification( this.type, this.Message);
        });
      }


  async countEvento(evento: Evento, prg: number, pathloc: string ) {
    console.log('frontend - countEvento -- appena entrato  - prg ' + prg + ' path0: ' + this.pathimage0);
    let rc = await  this.prenotazeventoService.getCountbyevento(evento.id).subscribe(
      response => {

        console.log('rc dopo countbyevento ' + response['rc'] + ' evento.id ' + evento.id);
          if(response['rc'] === 'ok') {

          switch (prg) {
              case 1:
                  this.pathimageEvento1 = pathloc;
                  this.activemanif1 = true;
                  this.disponibileEvento1 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento1 = evento.descbreve;
                  this.dataEvento1 = evento.data;
                  this.nEvento1 = evento.id;
                  break;
              case 2:
                  this.pathimageEvento2 = pathloc;
                  this.activemanif2 = true;
                  this.disponibileEvento2 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento2 = evento.descbreve;
                  this.dataEvento2 = evento.data;
                  this.nEvento2 = evento.id;
                  break;
              case 3:
                  this.pathimageEvento3 = pathloc;
                  this.activemanif3 = true;
                  this.disponibileEvento3 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento3 = evento.descbreve;
                  this.dataEvento3 = evento.data;
                  this.nEvento3 = evento.id;
                  break;
              case 4:
                  this.pathimageEvento4 = pathloc;
                  this.activemanif4 = true;
                  this.disponibileEvento4 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento4 = evento.descbreve;
                  this.dataEvento4 = evento.data;
                   this.nEvento4 = evento.id;
                  break;
              case 5:
                  this.pathimageEvento5 = pathloc;
                  this.activemanif5 = true;
                  this.disponibileEvento5 = evento.nposti - evento.npostipren; //response['prenotati'];
                   this.nameEvento5 = evento.descbreve;
                   this.dataEvento5 = evento.data;
                   this.nEvento5 = evento.id;
                  break;
              case 6:
                  this.pathimageEvento6 = pathloc;
                  this.activemanif6 = true;
                  this.disponibileEvento6 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento6 = evento.descbreve;
                  this.dataEvento6 = evento.data;
                  this.nEvento6 = evento.id;
                  break;
              case 7:
                  this.pathimageEvento7 = pathloc;
                  this.activemanif7 = true;
                  this.disponibileEvento7 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento7 = evento.descbreve;
                  this.dataEvento7 = evento.data;
                   this.nEvento7 = evento.id;
                  break;
              case 8:
                  this.pathimageEvento8 = pathloc;
                  this.activemanif8 = true;
                  this.disponibileEvento8 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento8 = evento.descbreve;
                  this.dataEvento8 = evento.data;
                   this.nEvento8 = evento.id;
                  break;
              case 9:
                  this.pathimageEvento9 = pathloc;
                  this.activemanif9 = true;
                  this.disponibileEvento9 = evento.nposti - evento.npostipren; //response['prenotati'];
                   this.nameEvento9 = evento.descbreve;
                   this.dataEvento9 = evento.data;
                   this.nEvento9 = evento.id;
                  break;
              case 10:
                  this.pathimageEvento10 = pathloc;
                  this.activemanif10 = true;
                  this.disponibileEvento10 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento10 = evento.descbreve;
                  this.dataEvento10 = evento.data;
                  this.nEvento10 = evento.id;
                  break;
              case 11:
                  this.pathimageEvento11 = pathloc;
                  this.activemanif11 = true;
                  this.disponibileEvento11 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento11 = evento.descbreve;
                   this.dataEvento11 = evento.data;
                   this.nEvento11 = evento.id;
                  break;
              case 12:
                  this.pathimageEvento12 = pathloc;
                  this.activemanif12 = true;
                  this.disponibileEvento12 = evento.nposti - evento.npostipren; //response['prenotati'];
                  this.nameEvento12 = evento.descbreve;
                  this.dataEvento12 = evento.data;
                  this.nEvento12 = evento.id;
                  break;
              default:
              alert('troppe eventostazioni attive' + '\n' + 'avvisare ced');
              break;
           }
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

  Prenota(id: number) {
    localStorage.removeItem('tokenPrenotazione');  // elimino eventuali localstorage per prenotazioni precedenti
    this.loadevento(id)
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

  impostaCardEventi(numEventi: number)  {
    this.activemanif1 = false;
    this.activemanif2 = false;
    this.activemanif3 = false;
    this.activemanif4 = false;
    this.activemanif5 = false;
    this.activemanif6 = false;
    this.activemanif7 = false;
    this.activemanif8 = false;
    this.activemanif9 = false;
    this.activemanif10 = false;
    this.activemanif11 = false;
    this.activemanif12 = false;


    switch (numEventi) {
      case 1:
          this.activemanif1 = true;
          break;
      case 2:
          this.activemanif1 = true;
          this.activemanif2 = true;
          break;
      case 3:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          break;
      case 4:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          break;
      case 5:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          break;
      case 6:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          break;
      case 7:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          break;
      case 8:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          this.activemanif8 = true;
          break;
      case 9:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          this.activemanif8 = true;
          this.activemanif9 = true;
          break;
      case 10:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          this.activemanif8 = true;
          this.activemanif9 = true;
          this.activemanif10 = true;
          break;
      case 11:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          this.activemanif8 = true;
          this.activemanif9 = true;
          this.activemanif10 = true;
          this.activemanif11 = true;
          break;
      case 12:
          this.activemanif1 = true;
          this.activemanif2 = true;
          this.activemanif3 = true;
          this.activemanif4 = true;
          this.activemanif5 = true;
          this.activemanif6 = true;
          this.activemanif7 = true;
          this.activemanif8 = true;
          this.activemanif9 = true;
          this.activemanif10 = true;
          this.activemanif11 = true;
          this.activemanif12 = true;
          break;
      default:
      alert('troppe manifestazioni attive' + '\n' + 'avvisare ced');
      break;
   }

  }



}
