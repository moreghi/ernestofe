import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faCoins } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Logistica } from '../../../classes/Logistica';
import { TstatoLogistica } from './../../../classes/T_stato_logistica';
// Wsettori sostituisce LogSettore
import { Wsettori } from '../../../classes/W_Settori';
import { WFile } from '../../../classes/W_File';
import { WorkSettore } from '../../../classes/Work_settore';
import { WorkFila } from '../../../classes/Work_fila';
// service
import { LogisticaService } from './../../../services/logistica.service';
import { TstatologisticaService } from './../../../services/tstatologistica.service';
import { UploadFilesService } from './../../../services/upload-files.service';
import { WSettoriService } from './../../../services/w-settori.service';
import { WFileService } from './../../../services/w_file.service';
import { WorksettoreService } from './../../../services/worksettore.service';
import { WorkfilaService } from './../../../services/workfila.service';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NgForm } from '@angular/forms';
// popup per visualizzazione logistica
import { LogisticapopComponent } from '../../../components/popups/logisticapop/logisticapop.component';



@Component({
  selector: 'app-logistica-detail',
  templateUrl: './logistica-detail.component.html',
  styleUrls: ['./logistica-detail.component.css']
})
export class LogisticaDetailComponent implements OnInit {



  // per upload image
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  messageimage = '';
  fileInfos?: Observable<any>;
  messageupload = '';
  public folderImage = '';   // salvo la cartella in cui salvare immagine
// per upload image -- fine

  public logistica: Logistica;
  public statilogistica: TstatoLogistica[] = [];

// 2023/04/16
public wsettori: Wsettori[] = [];
public wsettoriSelected: Wsettori[] = [];
public wsettore: Wsettori;
public wfile: WFile[]= [];
public wfila: WFile;
public workSettori: WorkSettore[]= [];
  public workSettore: WorkSettore;
  public WorkFile: WorkFila[]= [];
  public workFila: WorkFila;
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
  faCoins = faCoins;

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

  /*    buttare
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

*/
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
public idlogistica = 0;
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
public namepage = ' - Logistica-detail';
public selectedStato = 0;
public pathimage = '';
public namefileDefault = 'nessunaImmaginePosti.png';
public lastLogistica = 0;
public trovatiSettori = false;

constructor(public modalService: NgbModal,
            private logisticaService: LogisticaService,
            private wSettoriService: WSettoriService,
            private wFileService: WFileService,
            private worksettoreService: WorksettoreService,
            private workfilaService: WorkfilaService,
            private statologisticaService: TstatologisticaService,
            private uploadService: UploadFilesService,
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
              this.loadStati();

              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[1].path;

              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);


              if(this.rottafase === 'new') {
                this.fase = 'N';
                this.title = 'Inserimento nuova logistica' + this.namepage;
                this.Message = 'inserire i dati della nuova logistica';
                this.logistica = new Logistica();
                this.logistica.photo = this.namefileDefault;
                this.logistica.key_utenti_operation = +localStorage.getItem('id');
                this.logistica.d_stato_logistica = 'in fase inserimento';
              } else {
                  this.fase = 'M';
                  this.title = 'Aggiornamento logistica '  + this.namepage;
                  this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('id');
                  console.log('id recuperato: ' + this.idpassed);
                  this.loadLogistica(this.idpassed);
                  this.Message = 'pronto per aggiornamento Logistica';
                 });
                }
          }


          async loadLogistica(id: number) {
            console.log('frontend - loadSocio: ' + id);
            let rc = await  this.logisticaService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('logisticaestazione da editare  ' + JSON.stringify(response['data']));
                this.logistica = response['data'];
                this.selectedStato = this.logistica.stato;
               // this.pathimage = environment.APIURL + '/upload/files/eventos/' + this.logistica.photo;  // fino al 15/04/20023
                this.pathimage = environment.APIURL + '/upload/files/logistica/' + this.logistica.photo;  // dal 16/04/2023
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


                Nuovo() {
                  this.router.navigate(['logposti/' + this.logistica + '/new']);
                }




//
// Show a notification
//
// @param {string} type    Notification type
// @param {string} message Notification message
//

showNotification( type: string, message: string ): void {

  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);

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

    switch (this.fase)  {
        case 'N':
          this.logisticaService.create(this.logistica).subscribe(
          res => {
                this.logistica = res['data'];
                console.log('creata nuovo logistica ' + JSON.stringify(res['data']));
                this.loadLastlogistica();   // prendo id logistica oer fare la creazione settore e file
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
            });
          break;
        case 'M':

          console.log(`logistica-detail -- conferma (upd) : ${JSON.stringify(this.logistica)}`);


          this.logisticaService.update(this.logistica).subscribe(
          res => {
                this.logistica = res['data'];
                this.type = 'success';
                this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                this.alertSuccess = true;
                this.router.navigate(['/logistica']);
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




  async  loadLastlogistica() {
    console.log('');
    let rc = await this.logisticaService.getLast().subscribe(
        resp => {
              console.log('loadLastlogistica: ' + JSON.stringify(resp['data']));
              if(resp['rc'] === 'ok') {
                this.logistica = resp['data'];
                this.lastLogistica = this.logistica.id;
                this. creaworklogistica(this.lastLogistica);
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

     creaworklogistica(id:number) {
      console.log('---------      sono dentro a  creaworklogistica -- appena arrivato: ' + id);
         this.loadwSettori();

      // leggere w_settore e caricarli
      // leggere w_fila e caricarli
     }

     async  loadwSettori() {
      console.log('loadwSettori  --- appena entrato');
      let rc = await this.wSettoriService.getAll().subscribe(
          resp => {
                console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.wsettori = resp['data'];
                  let c = 0;
                  for(let wsett of this.wsettori) {
                      this.workSettore = new WorkSettore();
                     // this.workSettore.id = wsett.id;
                      this.workSettore.idLogistica = this.lastLogistica;
                      this.workSettore.idSettore = wsett.id;
                      this.workSettore.dsettore = wsett.descrizione;
                      c =+ 1;
                          console.log(`creanewworkSettore: ------- pronto per inserire ---------------->  ${JSON.stringify(this.workSettore)}  ------   contatore c: ${c} `);

                      this.registranewWorkSettore(this.workSettore, wsett.id);

                  }
                  this.registraallFilebysettori(this.lastLogistica)
                  this.type = 'success';
                  this.Message =  'creata nuova Logistica - impostare la mappatura dei posti';
                  this.alertSuccess = true;
                  this.router.navigate(['/logistica']);
              }
          },
          error => {
               alert('sono in loadwSettori');
               console.log('loadwSettori - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }

//  merda       if(resp['rc'] === 'ok') {
 // this.loadwFile(idsett);




      async  registranewWorkSettore(workSettore: WorkSettore, idsett: number)  {
          console.log('   sono dentro a registranewWorkSettore ---- appena entrato: ' )
          let rc = await this.worksettoreService.create(workSettore).subscribe(
            resp => {
                  if(resp['rc'] !== 'ok') {
                    alert('errore in registranewWorkSettore -- rc: ' + resp['rc']);
                    console.log('errore in registranewWorkSettore -- rc: ' + resp['rc']);
                    this.type = 'error';
                    this.Message = 'errore in registranewWorkSettore -- rc: ' + resp['rc'];
                    this.showNotification(this.type, this.Message);
                  }

             },
            error => {
                 alert('sono in registranewWorkSettore');
                 console.log('registranewWorkSettore - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
             });
       }


       async  registraallFilebysettori(idlogistica: number) {
        console.log('-_________________________________   sono dentro a registraallFilebysettori');

        let rc = await this.worksettoreService.getAllloc(idlogistica).subscribe(
            resp => {
                  console.log('-------------------- registraallFilebysettori: ' + JSON.stringify(resp['data']));
                  if(resp['rc'] === 'ok') {
                    this.workSettori = resp['data'];
                    for(let wsett of this.workSettori) {
                      this.loadwFile(wsett.id);
                   }
               }
            },
            error => {
                 alert('sono in registraallFilebysettori');
                 console.log('registraallFilebysettori - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
             });
         }

       async  loadwFile(idSettore: number) {
        console.log('-_________________________________   sono dentro a loadwFile -- idSettore: ' + idSettore);
        let rc = await this.wFileService.getAll().subscribe(
            resp => {
                  console.log('------------------------------------------------- loadwFile: ' + JSON.stringify(resp['data']));
                  if(resp['rc'] === 'ok') {
                    this.wfile = resp['data'];
                    for(let wfila of this.wfile) {
                      this.workFila = new WorkFila();
                      this.workFila.idLogistica = this.lastLogistica;
                      this.workFila.idSettore = idSettore;
                      this.workFila.dfila = wfila.descrizione;

                          console.log(`creanewworkSettore: ------- pronto per inserire ---------------->  ${JSON.stringify(this.workSettore)} `);
                      this.registranewWorkFila(this.workFila);
                  }
               }
            },
            error => {
                 alert('sono in loadwFile');
                 console.log('loadwFile - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
             });
         }

         async  registranewWorkFila(workFila: WorkFila)  {
          let rc = await this.workfilaService.create(workFila).subscribe(
            resp => {
                  console.log('------------------------------------ registranewWorkFila: ' + JSON.stringify(resp['data']));
                  if(resp['rc'] !== 'ok') {
                    alert('errore in registranewWorkFila -- rc: ' + resp['rc']);
                    console.log('errore in registranewWorkFila -- rc: ' + resp['rc']);
                    this.type = 'error';
                    this.Message = 'errore in registranewWorkFila -- rc: ' + resp['rc'];
                    this.showNotification(this.type, this.Message);
                  }
            },
            error => {
                 alert('sono in registranewWorkFila');
                 console.log('registranewWorkFila - errore: ' + error);
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
      this.logistica.photo = file.name;   // salvo su record il nome del file selezionato
      // this.folderImage = 'eventos';    // imposto la cartella in cui passare  // fino al 15/04/2023
      this.folderImage = 'logistica';  // dal 16/04/2023
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

viewlogistica() {
  // --------------  versione con utilizzo popup

// alert('nuovaLocalita - lancio la registrazione Prodotto via popup');

 // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione



 //  lancio con popup


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


 rilascia() {
  if (confirm('Sei siciro di voler rilasciare la logistica ?')) {
    // Save it!
    console.log('proseguo con la fase di rilascio');
    this.rilasciaLogistica();
  } else {
    // Do nothing!
    console.log('operazione abbandonata dall utente');
    alert('operazione abbandonata dall utente');
  }

}




  async rilasciaLogistica() {
  this.logistica.stato = 2; // resa operatività
  let rc = await this.logisticaService.update(this.logistica).subscribe(
      res => {
            this.logistica = res['data'];
            this.type = 'success';
            this.Message = 'Logistica Operativa'; // res['message'];          //'utente aggiornato con successo del cazzo';
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







}


