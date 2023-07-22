import { Component, OnInit } from '@angular/core';
// Service
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';
import { EventoService } from '../../../services/evento.service';
// Model
import { Cassa } from '../../../classes/Cassa';
import { Cassamov } from '../../../classes/Cassamov';
import { Evento} from '../../../classes/Evento';
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




@Component({
  selector: 'app-cassa-detail',
  templateUrl: './cassa-detail.component.html',
  styleUrls: ['./cassa-detail.component.css']
})
export class CassaDetailComponent implements OnInit {

 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faInfoCircle = faInfoCircle;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;


 // variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';

 public cassa: Cassa;
 public cassamovs: Cassamov[] = [];
 public evento: Evento;

 public title = 'Gestione Cassa Giornaliera';

 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottadata = '';
 public rottafase = '';
 public dataOdierna;
 public statocassa = '';
 public datadioggi = '';
 public keystatocassa = '';
 public fase = '';
 public idEvento = 0;
 public idEventoPosto = 0;
 // per paginazone
  p = 1;

 constructor(private cassaService: CassaService,
             private cassamovService: CassamovService,
             private eventoService: EventoService,
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

  this.title = 'Gestione Cassa Giornaliera';
  const date = Date();
  this.dataOdierna = new Date(date);
  this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');

  this.isVisible = true;
  this.alertSuccess = true;


  this.rotta = this.route.snapshot.url[0].path;
  this.rottadata = this.route.snapshot.url[1].path;
  this.rottafase = this.route.snapshot.url[3].path;

  this.idEvento = JSON.parse(localStorage.getItem('cassaEvento'));
  this.idEventoPosto = +localStorage.getItem('idPagamento');
console.log('cassa-detail    Valore idEvento Passato: ' + this.idEvento);
  this.loadEvento(this.idEvento);

  localStorage.removeItem('cassaEvento');

  console.log('evento-detail - rotta: ' + this.rotta);
  console.log('evento-detail - rottadata: ' + this.rottadata);
  console.log('evento-detail - rottafase: ' + this.rottafase);


  if(this.rottafase === 'A') {
    console.log('evento-detail - sono in new ');
    this.statocassa = 'Apertura Cassa';
    this.Message = 'Premere invio per aprire la cassa giornaliera';
    this.cassa = new Cassa();
    this.cassa.datacassa = this.datadioggi;
    this.cassa.stato = 1;
    this.cassa.key_utenti_operation = +localStorage.getItem('id');
    this.keystatocassa = 'nf';
    this.fase = 'N';
   } else {

      this.loadCassa(this.datadioggi, this.idEvento);

      this.Message = 'pronto per aggiornamento Evento';
     }

 }




async loadEvento(id: number) {
  console.log('frontend---- CassaDetail - loadEvento: ' + id);
  let rc = await  this.eventoService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.evento = response['data'];
       }
  },
  error => {
      alert('loadEvento: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadEvento' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}









// metodo alterato   --- verificare le modifiche da apportare  2023/05/25
 async loadCassa(oggi: string, idEvento: number) {

  console.log('loadCassa -- appena entrato: ' + oggi);
  let rc = await  this.cassaService.getbydata(oggi, idEvento).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('cassa: ' + JSON.stringify(response['data']));
        this.cassa = response['data'];
        this.loadmovCassa(this.cassa.id);
        this.keystatocassa = 'ok';
        this.fase = 'M';
        this.statocassa = 'Chiusura Cassa';
        this.Message = 'Premere invio per chiudere la cassa giornaliera';
        }
    },
      error => {
          alert('loadCassa: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
      });
}

async loadmovCassa(id: number) {
  console.log('loadCassamov -- appena entrato: ' + id);
  let rc = await  this.cassamovService.getAllbyCassa(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('cassamov: ' + JSON.stringify(response['data']));
        this.cassamovs = response['data'];

        }
    },
      error => {
          alert('loadCassamov: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
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


  conferma(){

    switch (this.fase)  {
      case 'N':
         this.cassa.idEvento = this.idEvento;
         this.cassaService.create(this.cassa).subscribe(
            res => {
              if(res['rc'] === 'ok') {
                // Vecchia modalità  -  dismessa dal 25/05/2023
                localStorage.removeItem('idPagamento');
                this.router.navigate(['biglietto/' + this.idEventoPosto + '/edit']);
               }
              },
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
                 this.showNotification( this.type, this.Message);
              });
         break;
    case 'M':

          this.cassa.stato = 2;
          this.cassa.key_utenti_operation = +localStorage.getItem('id');
          this.cassaService.update(this.cassa).subscribe(
            res => {
                this.router.navigate(['pronotevento']);
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
      alert('funzione non ancora attivata');
      break;
  }
  }

  goback() {
    alert('da fare');
  }



}


/*






conferma() {


            console.log('conferma - fase: ' + this.fase + ' this.evento ' + JSON.stringify(this.evento));
            switch (this.fase)  {
              case 'N':
                 this.evento.idmanif = this.manif.id;
                 this.evento.statoposti = 0;
                 if(this.evento.idtipo == 2) {
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
                 break;
            case 'M':

            console.log(`pronto per fare modifica : ${JSON.stringify(this.evento)}`);
            this.evento.key_utenti_operation = +localStorage.getItem('id');
            this.eventoService.update(this.evento).subscribe(
                res => {
                      this.aggiornaManifestazione(this.manif);
                      console.log('evento-detail ----  conferma_Modifica: ' + JSON.stringify(this.evento));
                      if(this.evento.stato == 1) {
                        this.eventocreato = true;
                        this.eventoService.createEvento(this.eventocreato);
                      }
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
        console.log('aggiornamentoManifestaZIONE ' + JSON.stringify(manif));

        if(manif.dtInizio == '01/01/9999') {
          manif.dtInizio = this.evento.data;
          manif.dtFine = this.evento.data;
        } else {
          manif.dtFine = this.evento.data;
        }


        console.log('aggiornamentoManifestaZIONE ------   dopo test sella data ' + JSON.stringify(manif));

        let rc = await  this.mnifestazioneService.update(manif).subscribe(
            res => {
              this.type = 'success';
              this.Message = 'evento inserito correttamente';
              this.alertSuccess = true;
              this.showNotification( this.type, this.Message);
              this.router.navigate(['/manif/' + manif.id]);
               },
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
                 this.showNotification( this.type, this.Message);
              });

}


async createAllPosti() {
  let rc = await this.logsettfilapostoService.getAll(this.evento.idlogistica).subscribe(
    resp => {
          console.log('createAllPosti: ' + JSON.stringify(resp['data']));
          if(resp['rc'] === 'ok') {
            this.logsettfilaposti = resp['data'];
            this.createPosti();

          }
       },
    error => {
         alert('sono in createAllPosti');
         console.log('lcreateAllPosti - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });

}


async createPosti() {
// leggo l'ultimo evento inserito
let rc = await this.eventoService.getlast().subscribe(
  resp => {
        console.log('createPosti: ' + JSON.stringify(resp['data']));
        if(resp['rc'] === 'ok') {
          this.evento = resp['data'];
          for(const settfila of this.logsettfilaposti) {
            this.eventosettfilaposto = new Eventosettfilaposti();
            this.eventosettfilaposto.idEvento = this.evento.id;
            this.eventosettfilaposto.idLogistica = settfila.idLogistica;
            this.eventosettfilaposto.idSettore = settfila.idSettore;
            this.eventosettfilaposto.idFila = settfila.idFila;
            this.eventosettfilaposto.postoStart = settfila.postoStart;
            this.eventosettfilaposto.postoEnd = settfila.postoEnd;
            this.eventosettfilaposto.utilizzo = 'ATTIVO'
            this.eventosettfilaposto.key_utenti_operation = settfila.key_utenti_operation;

            this.eventosettfilapostiService.create(this.eventosettfilaposto).subscribe(
                    response => {
                        if(response['rc'] === 'ok') {
                //                non faccio nulla
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
        }
     },
  error => {
       alert('sono in createAllPosti');
       console.log('lcreateAllPosti - errore: ' + error);
       this.type = 'error';
       this.Message = error.message;
       this.showNotification(this.type, this.Message);
   });

}




*/
