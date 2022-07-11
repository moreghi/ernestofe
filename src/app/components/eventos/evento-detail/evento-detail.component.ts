
import { Component, OnInit } from '@angular/core';
// Service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService} from './../../../services/evento.service';
import { TstatoeventoService } from './../../../services/tstatoevento.service';
import { TtipologisticaService } from './../../../services/ttipologistica.service';
import { LogisticaService } from './../../../services/logistica.service';
import { LogsettfilapostoService } from '../../../services/logsettfilaposto.service';
import { EventosettfilapostiService } from '../../../services/eventosettfilaposti.service';
import { UploadFilesService } from './../../../services/upload-files.service';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { Evento } from '../../../classes/Evento';
import { TstatoUtente } from './../../../classes/T_stato_utente';
import { Logistica } from '../../../classes/Logistica';
import { Ttipologistica } from './../../../classes/T_tipo_logistica';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';

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
 public logistiche: Logistica[] = [];
 public logistichenull: Logistica[] = [];
 public logistica: Logistica;
 public tipilogistica: Ttipologistica[] = [];
 public logsettfilaposti: LogSettFilaPosti[] = [];
 public eventosettfilaposto: Eventosettfilaposti;
 public eventosettfilaposti: Eventosettfilaposti[] = [];

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
 public eventocreato = true;
 public enabledButtonMappa = false;
 public enabledddownLogistica = false;

 constructor(private mnifestazioneService: ManifestazioneService,
             public eventoService: EventoService,
             private tstatoeventoService: TstatoeventoService,
             private logisticaService: LogisticaService,
             private logsettfilapostoService: LogsettfilapostoService,
             private eventosettfilapostiService: EventosettfilapostiService,
             private tipologisticaService: TtipologisticaService,
             private uploadService: UploadFilesService,
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
  const date = Date();
  this.dataOdierna = new Date(date);

  this.anno  = this.dataOdierna.getFullYear();

  console.log('goApplication - anno: ' + this.anno);

  this.isVisible = true;
  this.alertSuccess = true;


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
    this.loadManifestazione(this.idManif);
    console.log('goApplication -- NEW --- evento.idmanif -- ' + this.evento.idmanif);
   } else {
      this.fase = 'M';
      this.title = 'Aggiornamento Evento '  + this.namepage;;
      this.route.paramMap.subscribe(p => {
      this.idpassed = +p.get('id');
      console.log('id recuperato: ' + this.idpassed);
      this.loadEvento(this.idpassed);
      this.Message = 'pronto per aggiornamento Evento';
     });
    }


  // this.level = parseInt(localStorage.getItem('user_ruolo'));
 // this.rottaId = parseInt(this.route.snapshot.url[1].path);


//  console.log('rotta -------- 1 ------ ' + this.route.snapshot.url[1].path);
//   console.log('rotta -------- 2 ------ ' + this.route.snapshot.url[2].path);





}

async loadManifestazione(id: number) {
  console.log('loadManifestazione -- appena entrato: ' + id);
  let rc = await  this.mnifestazioneService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('manifestazione da editare in dettaglio: ' + JSON.stringify(response['data']));
        this.manif = response['data'];
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
console.log('frontend - loadEvento: ' + id);
let rc = await  this.eventoService.getbyId(id).subscribe(
response => {
  if(response['rc'] === 'ok') {
    console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
    this.evento = response['data'];
    this.selectedLogistica = this.evento.idlogistica;
    this.selectedStato = this.evento.stato;
    this.selectedtipoLogistica = this.evento.idtipo;
    if(this.evento.idlogistica !== 0) {
      this.loadLogistica(this.evento.idlogistica);
    }

    this.loadManifestazione(this.evento.idmanif);

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
  console.log('');
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
    console.log('');
    let rc = await this.logisticaService.getAllActive().subscribe(
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
      console.log('');
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
      console.log('');
      let rc = await this.logisticaService.getbyId(id).subscribe(
          resp => {
                console.log('loadLogistica: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.logistica = resp['data'];
                  this.pathimage = environment.APIURL + '/upload/files/eventos/' + this.logistica.photo;   // questa non serve più
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
            this.evento.idmanif = this.manif.id;

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
      this.folderImage = 'eventos';    // imposto la cartella in cui passare
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

}

