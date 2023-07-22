

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Logistica } from '../../../classes/Logistica';
// Wsettori sostituisce LogSettore
import { Wsettori } from '../../../classes/W_Settori';
import { WFile } from '../../../classes/W_File';
import { WorkSettore } from '../../../classes/Work_settore';
import { WorkFila } from '../../../classes/Work_fila';
import { LogSettore } from '../../../classes/Logsettore';  // da eliminare
import { LogFila } from '../../../classes/Logfila';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';  // da eliminare
import { LogPosto } from '../../../classes/Logposto';
import { Elemento } from '../../../classes/Elemento';

import { TstatoLogistica } from './../../../classes/T_stato_logistica';
// service
import { LogisticaService } from './../../../services/logistica.service';
import { WSettoriService } from './../../../services/w-settori.service';
import { WFileService } from './../../../services/w_file.service';

import { WorksettoreService } from './../../../services/worksettore.service';
import { WorkfilaService } from './../../../services/workfila.service';


import { LogsettoreService } from './../../../services/logsettore.service';  // da eliminare
import { LogfilaService } from './../../../services/logfila.service';



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
import { QuotatesseraInterface } from '../../../interfaces/quotatessera';






@Component({
  selector: 'app-logistica-detail-mappaposti',
  templateUrl: './logistica-detail-mappaposti.component.html',
  styleUrls: ['./logistica-detail-mappaposti.component.css']
})
export class LogisticaDetailMappapostiComponent implements OnInit {

  public logistica: Logistica;
  public logisticaw: Logistica;
  public statilogistica: TstatoLogistica[] = [];

  public logsettori: LogSettore[] = [];

  // 2023/04/16
  public wsettori: Wsettori[] = [];
  public wsettoriSelected: Wsettori[] = [];
  public wsettore: Wsettori;
  public wfile: WFile[]= [];
  public wfila: WFile;

  public workSettori: WorkSettore[]= [];
  public workSettorix: WorkSettore[]= [];
  public WorkFile: WorkFila[]= [];

  public workSettore: WorkSettore;
  public workFila: WorkFila;

  public logfila: LogFila;
  public logfile: LogFila[] = [];

  public logsettorinull: LogSettore[] = [];


  public logfilenull: LogFila[] = [];
  public logsettfilaposti: LogSettFilaPosti[] = [];
  public logsettfilapostinull: LogSettFilaPosti[] = [];
  public logsettfilaposto: LogSettFilaPosti;
  public logsettfilapostow: LogSettFilaPosti;
  public logsettfilapostowork: LogSettFilaPosti;
  public logsettfilapostonull: LogSettFilaPosti;
  public logposti: LogPosto[] = [];
  public logposto: LogPosto;

  public elemento: Elemento;


// da eliminare
public logsettore: LogSettore;



public title = "Gestione logisticaestazione -----  nuova";



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
  public wsettoreSelected = false;

  public isLoading = false;
  public fieldVisible = false;

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
public selectedSettore_a = '';
public selectedFila = 0;

public selectedweb = 0;
public selectedSta = 0;

// test
public selectedSettorex = 0;


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


public postoStart = 0;
public postoEnd = 0;
public lastoperation = '';
public lastoperationpop = '';

public idSet = 0;
public idFil = 0;
public swinerror = false;
public totposti = 0;
public stato = 0;

constructor(public modalService: NgbModal,
            private logisticaService: LogisticaService,
            private statologisticaService: TstatologisticaService,
            private wSettoriService: WSettoriService,
            private wFileService: WFileService,
            private worksettoreService: WorksettoreService,
            private workfilaService: WorkfilaService,
            private logsettoreService: LogsettoreService,   //  da eliminare
            private logfilaService: LogfilaService,     // da eliminare



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

              this.route.paramMap.subscribe(p => {
              this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
              this.loadLogistica(this.idpassed);
              });

              this.loadworkSettorix(this.idpassed);
              this.loadworkSettori(this.idpassed);


/*




              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[2].path;
              this.rottaLogistica = +this.route.snapshot.url[1].path;
              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);

              this.loadLogistica(this.rottaLogistica);
*/


              this.title = 'Gestione posti logistica';
              this.Message = 'pronto per aggiornamento Posti Logistica';

            }

            async  loadworkSettorix(id: number) {
              console.log('loadworkSettorix  --- appena entrato ' + id);
              let rc = await this.worksettoreService.getAllloc(id).subscribe(
                  resp => {
                        console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                        if(resp['rc'] === 'ok') {
                          this.workSettorix = resp['data'];
                      }
                  },
                  error => {
                       alert('sono in loadwSettorix');
                       console.log('loadwSettorix - errore: ' + error);
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

          async loadLogistica(id: number) {
            console.log('frontend - loadlogistica: ' + id);
            let rc = await  this.logisticaService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('logisticaestazione da editare  ' + JSON.stringify(response['data']));
                this.logistica = response['data'];
                this.pathimage = environment.APIURL + '/upload/files/eventos/' + this.logistica.photo;
                if(this.logistica.stato === 0) {
                  this.ctrworklogistica(this.logistica.id);
                }
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


            async  ctrworklogistica(id: number) {
              console.log('sono dentro a  ctrworklogistica -- appena arrivato: ' + id);
              let rc = await this.worksettoreService.getCountbylogistica(id).subscribe(
                  resp => {
                        console.log('---------------------------    ......... rc .................................. ctrworklogistica: ' + resp['rc'] + ' settori: ' + resp['settori'] );

                        if(resp['rc'] === 'nf') {
                          console.log('  vado a fare creaworklogistica per logistica: ' + id);
                          this.creaworklogistica(id);
                        }

                        if(resp['rc'] === 'ok') {
                          alert('trovati workSettori ' + resp['settori'] + ' per logistica ' + id)
                          if(resp['settori'] > 0) {
                            this.loadworkSettori(id);
                            this.loadworkFile(id);
                          }
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


               async  loadwSettoriSelected(stato:number) {
                console.log('');
                let rc = await this.wSettoriService.getAllselected(stato).subscribe(
                    resp => {
                          console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                          if(resp['rc'] === 'ok') {
                            this.wsettoriSelected = resp['data'];
                            this.wsettoreSelected = true;
                          }
                          if(resp['rc'] === 'nf') {
                            this.wsettoreSelected = false;
                          }
                    },
                    error => {
                         alert('sono in loadwSettoriSelected');
                         console.log('loadwSettoriSelected - errore: ' + error);
                         this.type = 'error';
                         this.Message = error.message;
                         this.showNotification(this.type, this.Message);
                     });
                 }



                 async  loadworkSettori(id: number) {
                  console.log('loadworkSettori  --- appena entrato ' + id);
                  let rc = await this.worksettoreService.getAllloc(id).subscribe(
                      resp => {
                            console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                            if(resp['rc'] === 'ok') {
                              this.workSettori = resp['data'];

/*
                              let c = 0;
                              for(let wsett of this.workSettori) {
                                  this.workSettore = new WorkSettore();
                                  this.workSettore.id = wsett.id;
                                  this.workSettore.idLogistica = this.rottaLogistica;
                                  this.workSettore.idSettore = wsett.id;
                                  this.workSettore.dsettore = wsett.dsettore;
                                  c =+ 1;
                                      console.log(`creanewworkSettore: ------- pronto per inserire ---------------->  ${JSON.stringify(this.workSettore)}  ------   contatore c: ${c} `);

                                  this.registranewWorkSettore(this.workSettore);

                              }
*/
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
                                this.workSettore.id = wsett.id;
                                this.workSettore.idLogistica = this.rottaLogistica;
                                this.workSettore.idSettore = wsett.id;
                                this.workSettore.dsettore = wsett.descrizione;
                                c =+ 1;
                                    console.log(`creanewworkSettore: ------- pronto per inserire ---------------->  ${JSON.stringify(this.workSettore)}  ------   contatore c: ${c} `);

                                this.registranewWorkSettore(this.workSettore);

                            }
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

                async  registranewWorkSettore(workSettore: WorkSettore)  {
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
                          if(resp['rc'] === 'ok') {
                            this.loadwFile(workSettore.id);
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


         async  loadwFile(idSettore: number) {
                console.log('-_________________________________   sono dentro a loadwFile -- idSettore: ' + idSettore);
                let rc = await this.wFileService.getAll().subscribe(
                    resp => {
                          console.log('------------------------------------------------- loadwFile: ' + JSON.stringify(resp['data']));
                          if(resp['rc'] === 'ok') {
                            this.wfile = resp['data'];
                            for(let wfila of this.wfile) {
                              this.workFila = new WorkFila();
                              this.workFila.idLogistica = this.rottaLogistica;
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


                 async  loadworkSettore(id: number) {
                  console.log('sono in  ----- loadworkSettore id: ' + id);
                  let rc = await this.worksettoreService.getbyid(id).subscribe(
                      resp => {
                            console.log('------------------------------------------------- loadwSettore: ' + JSON.stringify(resp['data']));
                            if(resp['rc'] === 'ok') {
                              this.workSettore = resp['data'];
                            }
                         },
                      error => {
                           alert('sono in loadworkSettore');
                           console.log('loadworkSettore - errore: ' + error);
                           this.type = 'error';
                           this.Message = error.message;
                           this.showNotification(this.type, this.Message);
                       });
                   }

                   ctrpostoStart(numPosto: number) {
                    this.alertSuccess = true;
                      alert('il posto iniziale è: ' + numPosto);
                      if(numPosto < 1) {
                        this.message = 'Numero iniziale della fila errato';
                        this.alertSuccess = false;
                      } else {
                        this.postoStart = numPosto;
                        this.logfila.nstart = this.postoStart;
                      }
                  }

                  ctrpostoend(numPosto: number) {
                    this.alertSuccess = true;
                    alert('il posto finale è: ' + numPosto);
                    if(numPosto < this.logfila.nstart) {
                      this.message = 'Numero finale deve essere maggiore del numero iniziale';
                      this.alertSuccess = false;
                    } else {
                      this.postoEnd = numPosto;
                      this.logfila.nposti = this.logfila.nend - this.logfila.nstart + 1;
                    }
                }


                   async  loadworkFile(id: number) {
                    console.log('');
                    let rc = await this.workfilaService.getAllloc(id).subscribe(
                        resp => {
                              console.log('------------------------------------------------- loadwSettore: ' + JSON.stringify(resp['data']));
                              if(resp['rc'] === 'ok') {
                                this.WorkFile = resp['data'];
                              }
                           },
                        error => {
                             alert('sono in loadworkFile');
                             console.log('loadworkFile - errore: ' + error);
                             this.type = 'error';
                             this.Message = error.message;
                             this.showNotification(this.type, this.Message);
                         });
                     }


                 async  loadwSettore(id: number) {
                  console.log('');
                  let rc = await this.wSettoriService.getbyid(id).subscribe(
                      resp => {
                            console.log('------------------------------------------------- loadwSettore: ' + JSON.stringify(resp['data']));
                            if(resp['rc'] === 'ok') {
                              this.wsettore = resp['data'];
                            }
                         },
                      error => {
                           alert('sono in loawdSettore');
                           console.log('loawdSettore - errore: ' + error);
                           this.type = 'error';
                           this.Message = error.message;
                           this.showNotification(this.type, this.Message);
                       });
                   }


                   async  loadwFila(id: number) {
                    console.log('');
                    let rc = await this.wFileService.getbyid(id).subscribe(
                        resp => {
                              console.log('------------------------------------------------- loadwSettore: ' + JSON.stringify(resp['data']));
                              if(resp['rc'] === 'ok') {
                                this.wfila = resp['data'];
                              }
                           },
                        error => {
                             alert('sono in loadwFilae');
                             console.log('loadwFila - errore: ' + error);
                             this.type = 'error';
                             this.Message = error.message;
                             this.showNotification(this.type, this.Message);
                         });
                     }

            nuovaRegistrazione()  {

              this.title = 'Inserimento nuova logistica' + this.namepage;
              this.Message = 'inserire i dati della nuova logistica';
              this.logfila = new LogFila();
              this.logfila.nposti = 0;
              this.logfila.nstart = -1;
              this.logfila.nend = -1;
              this.logfila.key_utenti_operation = +localStorage.getItem('id');
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

               onSelectedworkSettore(selectedValue: number) {
 //  alert('selezionato: ' + selectedValue);showNotification
                   if(selectedValue ==  9999) {
                    this.type = 'error';
                    this.Message = 'selezione non corrette';
                    this.showNotification(this.type, this.Message);
                    this.alertSuccess = false;
                    this.isVisible = true;
                    this.selectedSettore = 0;
                //    this.logfile = this.logfilenull;
                    return;
                  } else {
                  this.loadworkSettore(selectedValue);
                  console.log('fatto selezione Settore - selezionato: ' + this.logistica.id + ' settore ' + selectedValue);
                  this.selectedSettore = selectedValue;
                 }
              }

               onSelectedworkFila(selectedValue: number) {
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
                this.loadwFila(this.logistica.id);
                this.selectedFila = selectedValue;
               }
         }


    goback() {
      this.router.navigate(['logistica']);
    }


    // test
    conferma_test() {

      this.logfila.idSettore = this.selectedSettore;
      this.logsettore.idSettore = this.selectedSettore;

      console.log('---- conferma:  ----- logfila pronta per insert  --------------      ' + JSON.stringify(this.logfila));
      console.log('---- conferma:  ----- logSettore pronta per insert  .........      ' + JSON.stringify(this.logsettore));
      this.inseriscilogFila(this.logfila);

    }

    conferma() {


      let n: typeof this.logfila.nstart;
      console.log('nstart - typeof ' + n);

          this.logfila.idSettore = this.selectedSettore;
          this.logsettore.idSettore = this.selectedSettore;
          // mettere idfila in classe
       //   this.logfila.

      console.log('---- conferma:  ----- logfila pronta per insert  --------------      ' + JSON.stringify(this.logfila));
      console.log('---- conferma:  ----- logSettore pronta per insert  .........      ' + JSON.stringify(this.logsettore));


      if(this.selectedSettore == 0) {
          alert('Selezionare il Settore - registrazione non possibile');
          return;
      }
      if(this.selectedFila == 0) {
          alert('Selezionare la Fila - registrazione non possibile');
          return;
      }

      this.postoStart = +this.logfila.nstart;
      this.postoEnd = +this.logfila.nend

      if(this.postoEnd < this.postoStart) {
          alert('il posto finale deve essere maggiore del posto iniziale !!');
          return;
      }


  //    this.loadGetlogSettore(this.logfila.idLogistica, this.logfila.idSettore);
  //    this.inseriscilogFila(this.logfila);

    }

    async loadGetlogSettore(idLogistica: number, idSettore: number) {
      let rc = await this.logsettoreService.getbySettore(idLogistica,idSettore).subscribe(
         res => {
                if(res['rc'] === 'ok') {
                  // non deve fare nulla perchè settore già inserito
                }
                if(res['rc'] === 'nf') {
                  this.inseriscilogSettore(this.logsettore);
                }
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
     }


 async inseriscilogSettore(logsettore: LogSettore) {
    let rc = await this.logsettoreService.create(logsettore).subscribe(
         res => {
                if(res['rc'] === 'ok') {
                  // non deve fare nulla perchè settore già inserito
                }
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
     }

     async inseriscilogFila(logfila: LogFila) {
      let rc = await this.logfilaService.create(logfila).subscribe(
           res => {
                  if(res['rc'] === 'ok') {
                    this.AggiornaWfila(this.selectedFila)
                  }
              },
             error => {
                console.log(error);
                this.type = 'error';
                this.Message = error.message;
                this.alertSuccess = false;
             });
       }



       async AggiornaWfila(nfila: number) {
        console.log('aggiornawfilw ---   n.fila: ' + nfila);

        let rc = await this.wFileService.getbyid(nfila).subscribe(
             res => {
                    if(res['rc'] === 'ok') {


                      this.wfila = res['data'];
                      this.wfila.stato = 1;
                      this.AggiornaWfilaSelezionata(this.wfila);
                    }
                },
               error => {
                  console.log(error);
                  this.type = 'error';
                  this.Message = error.message;
                  this.alertSuccess = false;
               });
         }

         async  AggiornaWfilaSelezionata(wfila: WFile) {

          let rc = await this.wFileService.update(wfila).subscribe(
               res => {
                      if(res['rc'] === 'ok') {
                        // aggiorno il settore selezionato
                        this.AggiornawsettoreSelezionato(this.selectedSettore);
                        this.type = 'success';
                        this.Message = 'Fila assegnata regolarmente alla Logistica di progetto';
                        this.alertSuccess = true;
                        window.location.reload();
                        this.loadwFile(this.stato);
                      }
                  },
                 error => {
                    console.log(error);
                    this.type = 'error';
                    this.Message = error.message;
                    this.alertSuccess = false;
                 });
           }

           // per test  -- da buttar
           AggiornawsettoreSelezionato(selectedSettore: number) {

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
