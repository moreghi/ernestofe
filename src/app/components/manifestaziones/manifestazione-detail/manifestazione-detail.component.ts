import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { TstatoManifestazione } from './../../../classes/T_stato_manifestazione';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { TstatomanifestazioneService } from './../../../services/tstatomanifestazione.service';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-manifestazione-detail',
  templateUrl: './manifestazione-detail.component.html',
  styleUrls: ['./manifestazione-detail.component.css']
})
export class ManifestazioneDetailComponent implements OnInit {

  public manif: Manifestazione;
  public statimanif: TstatoManifestazione[] = [];


  public title = "Gestione Manifestazione";

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
public namepage = ' - manifestazione-detail';
public selectedStato = 0;


constructor(public modalService: NgbModal,
            private manifestazioneService: ManifestazioneService,
            private statomanifestazioneService: TstatomanifestazioneService,
            private route: ActivatedRoute,
            private router: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

            ngOnInit(): void {

               console.log('manif-detail - sono in oninit - preparato messaggio ' + this.Message);

               this.goApplication();

             }


             goApplication() {
              console.log('goApplication - appena entrato');
              const date = Date();
              this.dataOdierna = new Date(date);
              this.anno  = this.dataOdierna.getFullYear();
              console.log('goApplication - anno: ' + this.anno);
              this.isVisible = true;
              this.alertSuccess = true;
              this.loadStati();

              this.rotta = this.route.snapshot.url[0].path;
              this.rottafase = this.route.snapshot.url[1].path;

              console.log('rotta - ' + this.rotta + ' rottafase: ' + this.rottafase);


              if(this.rottafase === 'new') {
                this.fase = 'N';
                this.title = 'Inserimento nuova Manifestazione' + this.namepage;
                this.Message = 'inserire i dati della nuova Manifestazione';
                this.manif = new Manifestazione();
                this.manif.key_utenti_operation = +localStorage.getItem('id');
                this.manif.d_stato_manifestazione = 'in fase inserimento';
              } else {
                  this.fase = 'M';
                  this.title = 'Aggiornamento Manifestazione '  + this.namepage;
                  this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('id');
                  console.log('id recuperato: ' + this.idpassed);
                  this.loadManifestazione(this.idpassed);
                  this.Message = 'pronto per aggiornamento Manifestazione';
                 });
                }
          }


          async loadManifestazione(id: number) {
            console.log('frontend - loadSocio: ' + id);
            let rc = await  this.manifestazioneService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('manifestazione da editare  ' + JSON.stringify(response['data']));
                this.manif = response['data'];
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
              let rc = await this.statomanifestazioneService.getAll().subscribe(
                  resp => {
                        console.log('loadStati: ' + JSON.stringify(resp['data']));
                        if(resp['rc'] === 'ok') {
                          this.statimanif = resp['data'];
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
                  this.manif.stato = selectedValue;
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


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
      if(result ===  'Cancel click') {
         this.cancellazioneAbort();
      }
      if(result ===  'Delete click') {
        // gestire uscita da popup
        this.cancellaUser(this.manif);
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


  cancellaUser(manif: Manifestazione) {

    this.manifestazioneService.delete(manif).subscribe(
        response => {
          if(response['ok']) {
            this.isVisible = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Manifestazione cancellata correttamente';
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
    this.router.navigate(['manif']);
  }

  conferma() {
    console.log('conferma - fase: ' + this.fase);

    switch (this.fase)  {
        case 'N':
          this.manif.anno = new Date().getFullYear();
          this.manifestazioneService.create(this.manif).subscribe(
          res => {
                this.manif = res['data'];
                this.type = 'success';
                this.Message =  res['message'];
                this.alertSuccess = true;
                this.router.navigate(['/manif']);
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
            });
          break;
        case 'M':

          console.log(`Manifestazione-detail -- conferma (upd) : ${JSON.stringify(this.manif)}`);


          this.manifestazioneService.update(this.manif).subscribe(
          res => {
                this.manif = res['data'];
                this.type = 'success';
                this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                this.alertSuccess = true;
                this.router.navigate(['/manif']);
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

  reset() {
    switch (this.fase)  {
        case 'N':
        this.manif = new Manifestazione();
        this.type = 'success';
        this.Message = 'Inserire i dati della Manifestazione';
        this.alertSuccess = true;
        break;
      case 'M':
        this.manifestazioneService.getbyId(this.manif.id).subscribe(
        res => {
              this.manif = res['data'];
              this.type = 'success';
              this.Message = 'situazione attuale Manifestazione';
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


}


/*







@Component({
  selector: 'app-manifestazione-detail',
  templateUrl: './manifestazione-detail.component.html',
  styleUrls: ['./manifestazione-detail.component.css']
})
export class ManifestazioneDetailComponent implements OnInit {

  manif: Manifestazione;

  public title = "Gestione Manifestazione";

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



constructor(public modalService: NgbModal,
            private manifestazioneService: ManifestazioneService,
            private ctrfuncService: CtrfuncService,
            private route: ActivatedRoute,
            private router: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

            ngOnInit(): void {

               console.log('manif-detail - sono in oninit - preparato messaggio ' + this.Message);

               this.checkFunctionbylevel();

             }


             checkFunctionbylevel() {
              //  ----- parte comune a tutti i moduli
             this.rotta = this.route.snapshot.url[0].path;
             this.level = parseInt(localStorage.getItem('user_ruolo'));
             this.functionUrl = this.route.snapshot.url[1].path;

             if(this.route.snapshot.url[1].path !== 'new') {
               this.rottaId =  parseInt(this.route.snapshot.url[2].path);
              } else {
               this.rottaId =  0;
              }

            // console.log('frontend - checkFunctionbylevel -- step_01');

             this.ctrfuncService.checkFunctionbylevelDetail(this.rotta, this.level, this.functionUrl).subscribe(
               response =>{

                 console.log('frontend - checkFunctionbylevel -- step_02 ' + response['rc']);

                 if(response['rc'] === 'ko') {
                   this.isVisible = true;
                   this.alertSuccess = false;
                   this.type = 'error';
                   this.Message = response['message'];
                   this.showNotification(this.type, this.Message);
                   return;
                 }
                 if(response['rc'] === 'ok') {
                   this.functionUser = response['data'];
           //  ----- fine parte comune a tutti i moduli

              // caricamento di eventuali tabelle per select

             //  parte personalizzabile
                   console.log('frontend - checkFunctionbylevelDetail - funzione determinata: ' + this.functionUser);
                //   console.log('messaggio: ' + response['message']);

                   this.functionInqu =  false;
                   this.functionEdit = false;
                   this.functionEdits = false;
                   this.functionNew = false;

                   if(this.level === -1) {
                    if(this.functionUser === this.searchEdit) {
                      this.functionEdit = true;
                    }
                    if(this.functionUser === this.searchEdits) {
                      this.functionEdits = true;
                    }
                    if(this.functionUser === this.searchNew) {
                      this.functionNew = true;
                    }
                   } else {
                    if(this.functionUser === this.searchInqu) {
                      this.functionInqu = true;
                    }
                   }

                   console.log('dopo test su funzione determinata - functionUser ' + this.functionUser);
                   console.log('functionInqu ' + this.functionInqu);
                   console.log('functionNew ' + this.functionNew);
                   console.log('functionEdit ' + this.functionEdit);
                   console.log('functionEdits' + this.functionEdits);


                   this.isVisible = true;
                   this.alertSuccess = true;

                   if(this.functionNew) {
                     this.manif = new Manifestazione();
                     this.manif.key_utenti_operation = +localStorage.getItem('id');
                     this.title = 'Inserimento Manifestazione';
                     this.fase = 'N';
                     this.Message = `Inserire i dati della manifestazione`;
                   } else {
                       this.route.paramMap.subscribe(p => {
                         this.idManif = +p.get('id');
                         console.log('id recuperato: ' + this.idManif);
                         // -------  leggo i dati della giornata
                         this.loadManif(this.idManif);
                         if(this.functionEdit || this.functionEdits) {
                           this.title = 'Aggiornamento Manifestazione';
                           this.fase = 'M';
                          } else {
                           this.title = 'Visualizzazione Manifestazione';
                           this.fase = 'I';
                          }
                         this.Message = 'Situazione Attuale Manifestazione';
                      });

                       //  fine parte personalizzabile
                 }
                   this.type = 'success';
                   this.showNotification(this.type, this.Message);
                }
               },
               error =>
                   {
                     this.isVisible = true;
                     this.alertSuccess = false;
                     this.type = 'error';
                     this.Message = 'Errore cancellazione Manifestazione' + '\n' + error.message;
                     this.showNotification(this.type, this.Message);
                     console.log(error);
                   });

            }


            loadManif(id: number) {
              console.log(`loadManif - appena entrato`);
              this.manifestazioneService.getManifestazione(id).subscribe(
               resp => {
                     console.log(`loadManif: ${resp['data']}`);
                     this.manif = resp['data'];
                     this.manif.key_utenti_operation = +localStorage.getItem('id');
                     if(this.manif.stampeBackOffice === 'S') {
                       this.statoStampa = "Impostazione ATTIVA";
                     }
                     if(this.manif.stampeBackOffice === 'N') {
                      this.statoStampa = "Impostazione Disattiva";
                    }
                     console.log('fatto lettura manif: ' + this.manif.id);
                     this.type = 'success';
                     this.Message = 'situazione attuale Manifestazione';
                     this.alertSuccess = true;
                  },
               error => {
                    alert('sono in loadManif');
                    this.isVisible = true;
                    this.alertSuccess = false;
                    console.log('loadManif - errore: ' + error);
                    this.type = 'error';
                    this.Message = error.message;
                    this.alertSuccess = false;

                  });
             }







changeStampa(e) {

 this.manif.stampeBackOffice = e.target.value;
 if(this.manif.stampeBackOffice === 'S') {
   this.statoStampa = "Impostazione ATTIVA";
 }
 if(this.manif.stampeBackOffice === 'N') {
  this.statoStampa = "Impostazione Disattiva";
 }
}


}




*/
