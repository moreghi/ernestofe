//la funzione di rilascia crea logsettore/logfila/logposto, ma i dati sono ancora non corretti

import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Logistica } from '../../../classes/Logistica';
// Wsettori sostituisce LogSettore

import { WorkSettore } from '../../../classes/Work_settore';
import { WorkFila } from '../../../classes/Work_fila';
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';  // da eliminare
import { LogPosto } from '../../../classes/Logposto';
import { Elemento } from '../../../classes/Elemento';

import { TstatoLogistica } from './../../../classes/T_stato_logistica';
// service
import { LogisticaService } from './../../../services/logistica.service';
import { LogsettoreService } from './../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';
import { LogsettfilapostoService } from '../../../services/logsettfilaposto.service';
import { LogpostoService } from './../../../services/logposto.service';

import { WorksettoreService } from './../../../services/worksettore.service';
import { WorkfilaService } from './../../../services/workfila.service';



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
import { QuotatesseraInterface } from '../../../interfaces/quotatessera';
import { W_Prenotazevento } from '../../../classes/W_Prenotazevento';








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
  public logsettore: LogSettore;



  public workSettori: WorkSettore[]= [];
  public worksettoriSelected: WorkSettore[]= [];
  public workSettore: WorkSettore;
  public workSettoreDetail: WorkSettore;
  public workSettoreSelected: WorkSettore;

  public workFile: WorkFila[]= [];
  public workfileSelected: WorkFila[]= [];
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




public selectComplete = false;
public fieldCorrect = false;

  public title = "Gestione logisticaestazione   ---  logistica-detail-mappaposti";



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
  public Messagework = '';
  public isSelected = false;

  public saveValueStd: boolean;
  public lastNumber = 0;
  public fase = '';

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

public selectedSettore = 1;  // ?????????
public selectedSettore_a = '';
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
public dSettore = '';
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
public totposti = 0;
public stato = 0;

public worksettoreSelected = false;   // da controllare
public workfilaSelected = false;
 // per paginazone
 p_righe = 1;
 public pathPosto = '';
 public pathpostowork = '';
 public pathpostowork1 = '';

constructor(public modalService: NgbModal,
            private logisticaService: LogisticaService,
            private statologisticaService: TstatologisticaService,
            private worksettoreService: WorksettoreService,
            private workfilaService: WorkfilaService,
            private logsettoreService: LogsettoreService,   //  da eliminare
            private logfilaService: LogfilaService,     // da eliminare
            private logsettfilapostoService: LogsettfilapostoService,
            private elementoService: ElementoService,
            private logpostoService: LogpostoService,
            private route: ActivatedRoute,
            private router: Router,
            private renderer: Renderer2,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }



            ngOnInit(): void {
              this.goApplication();
            }

            goApplication() {

              this.workSettoreDetail = new WorkSettore();
              console.log('goApplication - appena entrato');
              this.isVisible = true;
              this.alertSuccess = true;

              this.loadStati();

              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[2].path;
              this.rottaLogistica = +this.route.snapshot.url[1].path;
              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);

              this.loadLogistica(this.rottaLogistica);

              this.loadworkSettori(this.rottaLogistica);

              this.stato = 1;
              this.loadworkSettoriSelected(this.rottaLogistica, this.stato);



          //    this.loadwSettori();  leggere work
          //    this.loadwFile(this.stato);

          // da fare
          /*  <---------------------------------------  fare da qui
          this.stato = 0;
          this.loadworkSettori(this.rottaLogistica);
          this.loadworkFile(this.rottaLogistica, this.stato);
*/

/*  old caricamento combo  -- prima leggevo da wsettore / wfila  ora leggo da workSettore / workFila

              //   lwggwre da worksettori
              this.loadWsettoriSelected();

              this.title = 'Inserimento nuova logistica' + this.namepage;
              this.Message = 'inserire i dati della nuova logistica';
              this.logfila = new LogFila();
              this.logfila.idLogistica = this.rottaLogistica;
              this.logfila.key_utenti_operation = +localStorage.getItem('id');

              this.logsettore = new LogSettore();
              this.logsettore.idLogistica = this.rottaLogistica;
              this.logsettore.key_utenti_operation = +localStorage.getItem('id');
*/


              this.Message = 'pronto per aggiornamento Posti Logistica';
              this.Messagework = localStorage.getItem('Messagework');
              localStorage.removeItem('Messagework');
              if(this.Messagework !== '') {
                this.Message = this.Messagework;
              }

            }


/*   old caricamento combo  -- prima leggevo da wsettore / wfila  ora leggo da workSettore / workFila

          loadWsettoriSelected() {
            this.stato = 1;
            this.loadwSettoriSelected(this.stato);

          }
*/


ctrpostoStart(event: any){
 // alert(' sono dentro a ctrpostoStart ---- event: ' + event);
  console.log('ctrStart ---  evento: ' + event);
  this.postoStart = event;
  var element = this.renderer.selectRootElement('#postoEnd');  // per impostare getbySettoreActil focus cul controllo
      element.focus();
}

ctrpostoend(event: any){
 // alert(' sono dentro a ctrpostoEnd ---- event: ' + event);
  // console.log('ctrEnd: ' + event);
  this.postoEnd = event;
 // alert('n.ro start: ' + this.postoStart + ' n.ro end: ' + this.postoEnd);
 //  console.log('n.ro start: ' + this.postoStart + ' n.ro end: ' + this.postoEnd);

  if((this.postoEnd - this.postoStart) < 0) {
    this.Message = 'il numero finale deve essere maggiore del iniziale -- start: ' + this.postoStart + ' postoend: ' + this.postoEnd;
    this.alertSuccess = false;
    return;
 //   console.log('ctrollo ---   uscita 1');
 //   alert('il numero finale deve essere maggiore del iniziale')
  } else {
    this.workFila.nposti = this.workFila.nend - this.workFila.nstart + 1;
    this.Message = 'premere conferma per registrare la fila';
    this.alertSuccess = true;
    this.selectComplete = true;
    var element = this.renderer.selectRootElement('conferma_Button');  // per impostare il focus cul controllo
      element.focus();

  }
}

/*
viewfilebySettore(id: number) {
  alert('visualizzo le file del sttore: ' + id);





  this.workfilaSelected = true;

}
*/

async  viewfilebySettore(settore: WorkSettore) {

  let idloc = settore.idLogistica;
  let id = settore.id
  let dsettore = settore.dsettore;

  this.workSettoreSelected = new WorkSettore();
  this.workSettoreSelected.id = settore.id;
  this.workSettoreSelected.idLogistica = settore.idLogistica
  this.workSettoreSelected.idSettore = settore.idSettore;
  this.workSettoreSelected.dsettore = settore.dsettore;
  this.workSettoreSelected.nfile = settore.nfile;
  this.workSettoreSelected.nposti = settore.nposti;
  this.workSettoreSelected.stato = settore.stato;
  this.workSettoreSelected.key_utenti_operation = settore.key_utenti_operation;
  this.workSettoreSelected.created_at = settore.created_at;
  this.workSettoreSelected.updated_at = settore.updated_at;

  this.workSettoreDetail.dsettore = dsettore;   // per editarlo sulla testata delle file
  let stato = 1;
  console.log('viewfilebySettore  --- appena entrato ' + id);

  let rc = await this.workfilaService.getAllfilebySector(idloc, id, stato).subscribe(
      resp => {
            console.log('--------------------------viewfilebySettore ----------> :  ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.workfileSelected = resp['data'];
              this.workfilaSelected = true;

            }
            if(resp['rc'] === 'nf') {
               this.workfilaSelected = false;
            }
      },
      error => {
           alert('sono in viewfilebySettore');
           console.log('viewfilebySettore - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
   }












valuechange(event: any) {

  console.log('valuechange: ' + event);

}


          ctrpostoStartOriginale(numPosto: number) {
            this.alertSuccess = true;
              alert('il posto iniziale è: ' + numPosto);
              if(numPosto < 1) {
                this.message = 'Numero iniziale della fila errato';
                this.alertSuccess = false;
              } else {
                this.postoStart = numPosto;
                this.alertSuccess = true;
                this.isVisible = true;
                this.Message = 'inserire il numero finale';
         //       this.workFila.nstart = this.postoStart;
              }
          }



          ctrpostoendOriginale(numPosto: number) {

            console.log('---->  ctrpostoend --------- ' + numPosto + ' this.workFila.nstart ' + this.workFila.nstart);






            this.alertSuccess = true;
            alert('il posto finale è: ' + numPosto);
            if(numPosto < this.workFila.nstart) {
              console.log('test sul n.ro postend ----- uscita 1');
              this.message = 'Numero finale deve essere maggiore del numero iniziale';
              this.alertSuccess = false;
              return;
            } else {
              console.log('test sul n.ro postend ----- uscita 2');
              this.postoEnd = numPosto;
              this.workFila.nposti = this.workFila.nend - this.workFila.nstart + 1;
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






                 async  loadworkSettori(id: number) {
                  console.log('loadworkSettori  --- appena entrato ' + id);
                  let rc = await this.worksettoreService.getAllloc(id).subscribe(
                      resp => {
                            console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                            if(resp['rc'] === 'ok') {
                              this.workSettori = resp['data'];
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

                 async  loadworkSettore(id: number) {
                  console.log('sono in  ----- loadworkSettore id: ' + id);
                  let rc = await this.worksettoreService.getbyid(id).subscribe(
                      resp => {
                            console.log('------------------------------------------------- loadworkSettore: ' + JSON.stringify(resp['data']));
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

                   // leggo le file del settore
                   async  loadworkFile(id: number, idsec: number, stato: number) {
                    console.log('frontend --- loadworkFile -- logistica/settore ' + id + '/' + idsec);
                    let rc = await this.workfilaService.getAllfilebySector(id, idsec, stato).subscribe(
                        resp => {
                          console.log('--------------------- rc ---------------------------- loadworkFile: ' + resp['rc']);
                              console.log('------------------------------------------------- loadworkFile: ' + JSON.stringify(resp['data']));
                              if(resp['rc'] === 'ok') {
                                this.workFile = resp['data'];
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

   // leggo le file del settore
   async  loadworkFila(id: number) {
    console.log('frontend --- loadworkFila -- ' + id);
    let rc = await this.workfilaService.getbyid(id).subscribe(
        resp => {
          console.log('---- rc ----------------------- loadworkFila: ' + resp['rc'] + ' ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
                this.workFila = resp['data'];
              }
           },
        error => {
             alert('sono in loadworkFila');
             console.log('loadworkFila - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.showNotification(this.type, this.Message);
         });
     }


     async  loadworkSettoriSelected(id: number, stato: number) {
      console.log('loadworkSettoriSelected  --- appena entrato ' + id);

      let rc = await this.worksettoreService.getbySettoreAct(id, stato).subscribe(
          resp => {
                console.log('------------------------------------------------- loadSettori: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.worksettoriSelected = resp['data'];
                  this.worksettoreSelected = true;
                }
                if(resp['rc'] === 'nf') {
                   this.worksettoreSelected = false;
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
                  this.selectComplete = false;
                  this.selectedFila = 0;
                  this.loadworkSettore(selectedValue);
                  console.log('fatto selezione Settore - selezionato: ' + this.logistica.id + ' settore ' + selectedValue);
                  this.selectedSettore = selectedValue;
                  this.stato = 0;  // solo file  non selezionate
                  this.loadworkFile(this.rottaLogistica, this.selectedSettore, this.stato);
                  this.alertSuccess = true;
                  this.isVisible = true;
                  this.Message = 'selezionare la fila';
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
                this.selectedFila = selectedValue;
                this.loadworkFila(this.selectedFila);
                this.alertSuccess = true;
                this.isVisible = true;
                this.Message = 'inserire il numero iniziale e finale della fila';
               }
         }


    goback() {
      this.router.navigate(['logistica']);
    }


    // test    da buttare
    conferma_test() {

      this.logfila.idSettore = this.selectedSettore;
      this.logsettore.idSettore = this.selectedSettore;

      console.log('---- conferma:  ----- logfila pronta per insert  --------------      ' + JSON.stringify(this.logfila));
      console.log('---- conferma:  ----- logSettore pronta per insert  .........      ' + JSON.stringify(this.logsettore));
     // this.inseriscilogFila(this.logfila);

    }

    conferma() {


      let n: typeof this.logfila.nstart;
      console.log('nstart - typeof ' + n);

      this.fieldCorrect = true;

      if(this.selectedSettore == 0) {
        this.type = 'error';
        this.Message = 'Selezionare il Settore - registrazione non possibile';
        this.alertSuccess = false;
        this.fieldCorrect = false;
          return;
      }
      if(this.selectedFila == 0) {
        this.type = 'error';
        this.Message = 'Selezionare la Fila - registrazione non possibile';
        this.alertSuccess = false;
        this.fieldCorrect = false;
        return;
      }

      this.postoStart = this.workFila.nstart;
      this.postoEnd = +this.workFila.nend

      if(this.postoEnd < this.postoStart) {
        this.type = 'error';
        this.Message = 'il posto finale deve essere maggiore del posto iniziale !!';
        this.alertSuccess = false;
        this.fieldCorrect = false;
             return;
      }

      if(this.fieldCorrect === true) {
         // aggiorno il settore selezionato
      this.loadworkSettore(this.selectedSettore);
      this.workSettore.stato = 1;
      this.workSettore.nfile = this.workSettore.nfile + 1;
      this.workSettore.nposti = this.workSettore.nposti + this.workFila.nposti;
      this.UpdateworkSettore(this.workSettore);

       // aggiorno il la fila selezionata
       this.loadworkFila(this.selectedFila);
       this.workFila.stato = 1;
       this.UpdateworkFila(this.workFila);

       // aggiorno logistica
       this.logistica.nposti = this.logistica.nposti + this.workFila.nposti;
       this.UpdateLogistica(this.logistica);

      }

    }

    deleteSettore(id: number) {
      alert(' cancello settore ' + id + ' ' + this.workSettore.dsettore);
    }

     // da fare (metter a 0 stato)
    delSettore(id: number) {
      alert(' cancello settore ' + id );
    }


    async delfila(workfila: WorkFila) {

      let nposti = workfila.nposti;

      workfila.stato = 0;
      workfila.nend = 0;
      workfila.nposti = 0;
      workfila.nstart = 0;

      let rc = await this.workfilaService.update(workfila).subscribe(
          res => {
                if(res['rc'] !== 'ok') {
                  this.type = 'error';
                  this.Message = 'errore in delfila workfila';
                  this.alertSuccess = false;
                }
                if(res['rc'] === 'ok') {
                  this.delfilaSettore(this.workSettoreSelected, nposti);

                }
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
            });
      }


      async delfilaSettore(worksettore: WorkSettore, nposti: number) {

        worksettore.nfile = worksettore.nfile - 1;
        if(worksettore.nfile === 0) {
          worksettore.stato = 0;
        }
        worksettore.nposti = worksettore.nposti - nposti;

        let rc = await this.worksettoreService.update(worksettore).subscribe(
            res => {
                  if(res['rc'] !== 'ok') {
                    this.type = 'error';
                    this.Message = 'errore in delfila workfila';
                    this.alertSuccess = false;
                  }
                  if(res['rc'] === 'ok') {
                    this.delpostiLogistica(nposti);

                  }
               },
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
        }

        async delpostiLogistica(nposti: number) {

          this.logistica.nposti = this.logistica.nposti - nposti;

          let rc = await this.logisticaService.update(this.logistica).subscribe(
              res => {
                    if(res['rc'] !== 'ok') {
                      this.type = 'error';
                      this.Message = 'errore in aggiornamento Logistica';
                      this.alertSuccess = false;
                    } if(res['rc'] === 'ok') {
                          this.type = 'success';
                          this.Message = 'cancellata fila da settore';
                          this.alertSuccess = true;
                     //     localStorage.setItem('Messagework', this.Message);
                          window.location.reload();

                    }
                },
                error => {
                   console.log(error);
                   this.type = 'error';
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }

    async UpdateLogistica(logistica: Logistica) {

      let rc = await this.logisticaService.update(logistica).subscribe(
          res => {
                if(res['rc'] !== 'ok') {
                  this.type = 'error';
                  this.Message = 'errore in aggiornamento Logistica';
                  this.alertSuccess = false;
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



           async UpdateworkSettore(workSettore: WorkSettore) {

            let rc = await this.worksettoreService.update(workSettore).subscribe(
                res => {
                      if(res['rc'] !== 'ok') {
                        this.type = 'error';
                        this.Message = 'errore in aggiornamento Settore Selezionato';
                        this.alertSuccess = false;
                      }

                   },
                  error => {
                     console.log(error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                  });
            }

            async UpdateworkFila(workFila: WorkFila) {

              let rc = await this.workfilaService.update(workFila).subscribe(
                  res => {
                        if(res['rc'] !== 'ok') {
                          this.type = 'error';
                          this.Message = 'errore in aggiornamento Fila Selezionata';
                          this.alertSuccess = false;
                        }
                        if(res['rc'] === 'ok') {
                          this.type = 'error';
                          this.Message = 'Settore e Fila registrati correttamente';
                          this.alertSuccess = true;
                      //    localStorage.setItem('Messagework', this.Message);
                          window.location.reload();
                        }
                     },
                    error => {
                       console.log(error);
                       this.type = 'error';
                       this.Message = error.message;
                       this.alertSuccess = false;
                    });
              }



 async rilascia() {
  this.logistica.stato = 1; // rilasciati posti
  let rc = await this.logisticaService.update(this.logistica).subscribe(
      res => {
          this.creatabLogistica(this.logistica.id);
         },
        error => {
           console.log(error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
        });
  }


  creatabLogistica(id: number) {
      this.stato = 1;
      this.crealogSettore(id, this.stato);

  }


async crealogSettore(id: number, stato: number) {

    let rc = await this.worksettoreService.getbySettoreAct(id, stato).subscribe(
      resp => {
            console.log('-------------------- crealogSettore: ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.workSettori = resp['data'];
              for(let wsett of this.workSettori) {
                      this.logsettore = new LogSettore();
                      this.logsettore.idLogistica = id;
                      this.logsettore.idSettore = wsett.id;
                      this.logsettore.dsettore = wsett.dsettore;
                      this.logsettore.nfile = wsett.nfile;
                      this.logsettore.dsettore = wsett.dsettore;
                      this.pathPosto = wsett.dsettore;
                          console.log(`crealogSettore: ------- pronto per inserire ---------------->  ${JSON.stringify(this.logsettore)} `);
                      this.registralogSettore(this.logsettore, this.pathPosto);
             }

         }
      },
      error => {
           alert('sono in crealogSettore');
           console.log('crealogSettore - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       });

  }

  async  registralogSettore(logsettore: LogSettore, pathposto: string)  {
    let rc = await this.logsettoreService.create(logsettore).subscribe(
      resp => {
            console.log('------------------------------------ registralogSettore: ' + JSON.stringify(resp['data']));
            if(resp['rc'] !== 'ok') {
              alert('errore in registralogSettore -- rc: ' + resp['rc']);
              console.log('errore in registralogSettore -- rc: ' + resp['rc']);
              this.type = 'error';
              this.Message = 'errore in registralogSettore -- rc: ' + resp['rc'];
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
            }
            if(resp['rc'] === 'ok') {
              this.crealogFile(this.logistica.id, this.stato, pathposto);
            }
      },
      error => {
           alert('sono in registralogSettore');
           console.log('registralogSettore - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       });

   }

   async crealogFile(id:number, stato: number, pathposto: string) {
    let numprg = 0;
    let rc = await this.workfilaService.getAllfilebyAllSector(id, stato).subscribe(
      resp => {
            console.log('-------------------- crealogFile: ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.workFile = resp['data'];
              for(let wfila of this.workFile) {
                      this.logfila = new LogFila();
                      this.logfila.idLogistica = id;
                      this.logfila.idSettore = wfila.idSettore;
                      this.pathpostowork = pathposto;
                      this.pathpostowork = this.pathpostowork + ' ' + wfila.dfila;
                      this.logfila.dfila = wfila.dfila;
                      this.logfila.nposti = wfila.nposti;
                      this.logfila.nstart = wfila.nstart;
                      this.logfila.nend = wfila.nend;
                      numprg =+ 1;
                          console.log(`crealogFile: ------- pronto per inserire ---------------->  ${JSON.stringify(this.logfila)} `);
                      this.registralogFila(this.logfila, this.pathpostowork, numprg);
                 }
         }
      },
      error => {
           alert('sono in crealogFile');
           console.log('crealogFile - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       });

  }

  async  registralogFila(logfila: LogFila, pathposto: string, numprg: number)  {
    let rc = await this.logfilaService.create(logfila).subscribe(
      resp => {
            console.log('--------- numprg ------- registralogFila: ' + JSON.stringify(resp['data']) + ' numprg: ' + numprg);
            if(resp['rc'] !== 'ok') {
              alert('errore in registralogFila -- rc: ' + resp['rc']);
              console.log('errore in registralogFila -- rc: ' + resp['rc']);
              this.type = 'error';
              this.Message = 'errore in registralogFila -- rc: ' + resp['rc'];
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
            }
            if(resp['rc'] === 'ok') {
              this.crealogposti(logfila, pathposto, numprg);
            }
      },
      error => {
           alert('sono in registralogFila');
           console.log('registralogFila - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       });
   }

   async  crealogposti(logfila: LogFila, pathposto: string, numprg: number)  {

    let rc = await this.logfilaService.getlast().subscribe(
      resp => {
            console.log('----------->  numprg  <---------- crealogPosto: ' + JSON.stringify(resp['data']) + ' numprg: ' + numprg + ' pathposto: ' + pathposto);
            if(resp['rc'] === 'ok') {
              logfila = resp['data'];
              let nstart = logfila.nstart;
              let nend = logfila.nend;
              for (let i = nstart; i < nend + 1; i++) {
                this.logposto = new LogPosto();
                this.logposto.idFila = logfila.id;
                this.logposto.idLogistica = logfila.idLogistica;
                this.logposto.idPosto = i;
                this.logposto.idSettore = logfila.idSettore;
                this.pathpostowork1 = pathposto;
                this.pathpostowork1 = this.pathpostowork1 + ' Posto: ' + i;
                this.logposto.desposto = this.pathpostowork1;
                this.crealogPosto(this.logposto);
            }
          }
          this.type = 'success';
          this.Message = 'Creati correttamenti i posti sulla logistica';
          this.alertSuccess = true;
          this.showNotification(this.type, this.Message);
          this.logistica.nposti = 0;  // per inibire il pulsante di rilascio
      },
      error => {
           alert('sono in crealogPosto');
           console.log('crealogPosto - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       });
   }



   async  crealogPosto(logposto: LogPosto)  {
    let rc = await this.logpostoService.create(logposto).subscribe(
      resp => {
            console.log('------------------------------------ crealogPosto: ' + JSON.stringify(resp['data']));
            if(resp['rc'] !== 'ok') {
              alert('errore in crealogPosto -- rc: ' + resp['rc']);
              console.log('errore in crealogPosto -- rc: ' + resp['rc']);
              this.type = 'error';
              this.Message = 'errore in crealogPosto -- rc: ' + resp['rc'];
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
            }
        },
      error => {
           alert('sono in crealogPosto');
           console.log('crealogPosto - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
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

/*
  originaria funzione di conferma -- fino al 20/04/2023  da buttare

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
      this.loadGetlogSettore(this.logfila.idLogistica, this.logfila.idSettore);
      this.inseriscilogFila(this.logfila);

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
     //               this.AggiornaWfila(this.selectedFila)
                  }
              },
             error => {
                console.log(error);
                this.type = 'error';
                this.Message = error.message;
                this.alertSuccess = false;
             });
       }

*/

}



