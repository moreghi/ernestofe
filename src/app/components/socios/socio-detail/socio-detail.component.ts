import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { SocioService} from './../../../services/socio.service';
import { TlocalitaService } from './../../../services/tlocalita.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';



// classi
import { Socio } from '../../../classes/Socio';
import { Tlocalita } from '../../../classes/T_localita';
import { Bandieragialla } from '../../../classes/BandieraGialla';

import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-socio-detail',
  templateUrl: './socio-detail.component.html',
  styleUrls: ['./socio-detail.component.css']
})
export class SocioDetailComponent implements OnInit {

  public title = "gestione Socio - Tesseramento-detail";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faSave = faSave;
  faPlus = faPlus;
  faTrash = faTrash;
  faReply = faReply;

  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public Message = '';
  // campi da selezioni combo
  public selectedLocalitaNascita = 0;
  public selectedLocalitaResidenza = 0;
  public selectedOperativita = '?';
  public dataOdierna;
  public anno  = 0;

  options = [
    'Si',
    'No'
  ];



  public socio: Socio;
  public localitas: Tlocalita[] = [];
  public localitasr: Tlocalita[] = [];
  public localita: Tlocalita;
  public bandieragialla: Bandieragialla;

// variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';

  public href = '';
  public idpassed = 0;
  public rotta = '';
  public rottaId = 0;
  public idBg = 1;
  public newTessera = 0;
  public newTasseraStr = '';
  public rottafase = '';
  public fase = '';

constructor(private socioService: SocioService,
            private tlocalitaService: TlocalitaService,
            private bandieragiallaService: BandieragiallaService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

ngOnInit(): void {
console.log('TesseramentoDetail - sono in oninit  ');

// this.checkFunctionbylevel();

this.goApplication();

}

goApplication() {
    const date = Date();
    this.dataOdierna = new Date(date);

    this.anno  = this.dataOdierna.getFullYear();

    console.log('goApplication - anno: ' + this.anno);

    this.isVisible = true;
    this.loadlocalita();

    this.rotta = this.route.snapshot.url[0].path;
    this.rottafase = this.route.snapshot.url[1].path;

    if(this.rottafase === 'new') {
      this.fase = 'N';
      this. socio = new Socio();
      this.socio.key_utenti_operation = +localStorage.getItem('id');
    } else {
        this.fase = 'M';
        this.route.paramMap.subscribe(p => {
        this.idpassed = +p.get('id');
        console.log('id recuperato: ' + this.idpassed);
        this.loadSocio(this.idpassed);
       });
      }


    // this.level = parseInt(localStorage.getItem('user_ruolo'));
   // this.rottaId = parseInt(this.route.snapshot.url[1].path);

  //  console.log('rotta -------- 0 ------ ' + this.route.snapshot.url[0].path);
  //  console.log('rotta -------- 1 ------ ' + this.route.snapshot.url[1].path);
 //   console.log('rotta -------- 2 ------ ' + this.route.snapshot.url[2].path);





}




// recupero i dati della messa
async loadSocio(id: number) {
      console.log('frontend - loadSocio: ' + id);
      let rc = await  this.socioService.getSocio(id).subscribe(
      response => {
        if(response['rc'] === 'ok') {
          console.log('socio da editare in Tesseramento: ' + JSON.stringify(response['data']));
          this.socio = response['data'];
        }
        if(response['rc'] === 'nf') {
          this.Message = response['message'];
          this.type = 'error';
          this.showNotification( this.type, this.Message);
        }
      },
        error => {
        alert('Tesseramento-Detail  --loadSocio: ' + error.message);
        console.log(error);
        this.alertSuccess = false;
        this.Message = error.message;
        this.type = 'error';
        this.showNotification( this.type, this.Message);
        });
      }


      async  loadlocalita() {

        let rc = await this.tlocalitaService.getAll().subscribe(
            resp => {
                  console.log('oadlocalitaNascita: ' + JSON.stringify(resp['data']));
                  if(resp['rc'] === 'ok') {
                    this.localitas = resp['data'];
                    this.localitasr = resp['data'];
                    console.log('---------------------  oadlocalitaNascita: ' + JSON.stringify(this.localitas));
                  }
               },
            error => {
                 alert('sono in loadlocalitaNascita');
                 this.isVisible = true;
                 this.alertSuccess = false;
                 console.log('loadlocalitaNascita - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
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



  onSelectedLocalitaNascita(selectedValue: number) {
     alert('selezionato: ' + selectedValue);
     if(selectedValue ===  9999) {
       this.type = 'error';
       this.Message = 'selezione non corrette';
       this.showNotification(this.type, this.Message);
       this.alertSuccess = false;
       this.isVisible = true;
       return;
    } else {
     this.selectedLocalitaNascita = selectedValue;
     this.socio.locNascita = selectedValue;
    }

  }


  onSelectedLocalitaResidenza(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
     if(selectedValue ===  0) {
       this.type = 'error';
       this.Message = 'selezione non corrette';
       this.showNotification(this.type, this.Message);
       this.alertSuccess = false;
       this.isVisible = true;
       return;
    } else {
     this.selectedLocalitaResidenza = selectedValue;
     this.socio.residenza = selectedValue;
    //  this.loadlocalitaResidenza(this.selectedLocalitaResidenza);     buttare
    }

  }


  nuovaLocalita() {
    alert('da fare');
  }



    selectOperativo(selectedValue: string) {
       alert('operativo selezionato: ' + selectedValue);
       this.selectedOperativita = selectedValue;
       this.socio.operativo = selectedValue;

    }

    goback() {
      this.router.navigate(['/socio']);
    }

    reset() {
      this.socio = new Socio();
      this.selectedOperativita = '?';
    }



    async conferma() {
      console.log('conferma - fase: ' + this.fase);

  // controllo sulle date

      if(this.selectedOperativita === '?') {
            this.type = 'error';
            this.alertSuccess = false;
            this.Message = 'Selezionare se socio è operativo !!';
            this.showNotification(this.type, this.Message);
            return;
          }
      // recupero il numero della tessera da bandieraGialla
      let rc = await  this.bandieragiallaService.getbyId(this.idBg).subscribe(
        res => {
              if(res['rc'] === 'ok') {
                  this.bandieragialla = res['data'];
                  this.newTessera = this.bandieragialla.ultimaTessera;
                  this.newTessera = this.newTessera = + 1;
                  this.newTasseraStr = this.newTessera.toString();
                  if(this.newTasseraStr.length < 5) {
                    this.newTasseraStr = '';
                    for (let i = 0; i < this.newTasseraStr.length; i++) {
                      this.newTasseraStr += 0 + this.newTessera;
                    }
                  }
                  alert('numero tessera normalizzato a lunghezza 5: ' + this.newTasseraStr);

                  switch (this.fase)  {
                    case 'N':
                      console.log('pronto per fare inserimento ' + JSON.stringify(this.socio));
                      let rc =  this.socioService.createSocio(this.socio).subscribe(
                          res => {
                                this.aggiornanumTessera(this.newTessera);
                                this.type = 'success';
                                this.Message =  res['message'];                               //'utente  creato con successo';
                                this.alertSuccess = true;
                                this.router.navigate(['/socio']);
                             },
                            error => {
                               console.log(error);
                               this.type = 'error';
                               this.Message = error.message;
                               this.alertSuccess = false;
                            });
                      break;
                  case 'M':

                  console.log(`pronto per fare modifica : ${JSON.stringify(this.socio)}`);

                  let rc1 = this.socioService.updateSocio(this.socio).subscribe(
                      res => {
                            this.type = 'success';
                            this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                            this.alertSuccess = true;
                            this.router.navigate(['/socio']);
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
              }
           },
          error => {
             console.log(error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }


    async aggiornanumTessera(numTessera: number) {
      this.bandieragialla.ultimaTessera = numTessera;
      let rc1 = await this.bandieragiallaService.update(this.bandieragialla).subscribe(
        res => {

           },
          error => {
             console.log(error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }



/*    buttare
  async loadlocalitaResidenza(id: number) {
    console.log('frontend - loadlocalitaResidenza: ' + id);
    let rc = await  this.tlocalitaService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('localita di residenza: ' + JSON.stringify(response['data']));
        this.localita = response['data'];
      }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
      alert('Socio-Detail  --loadlocalitaResidenza: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
    }
*/



/*
    onSelectionChange(operativo: string)   {
      alert('operativo selezionato: ' + operativo);
      this.socio.operativo = operativo;
    }
*/

}



/*




@Component({
  selector: 'app-tesseramento-detail',
  templateUrl: './tesseramento-detail.component.html',
  styleUrls: ['./tesseramento-detail.component.css']
})
export class TesseramentoDetailComponent implements OnInit {


  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

   // per paginazone
p: number = 1;

// -----------------------------    da detail1



// variabili per editazione messaggio

public saveValueStd: boolean;
public lastNumber = 0;
public fase = '';


public isLoading = false;
public fieldVisible = false;
public messageTest1  = 'Operazione conclusa correttamente ';





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

public statoModulo  = '?';
public ricercaIniziale = '';

closeResult = '';

public level = 0;
public nRecord = 0;
public enabledFunc = false;

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

public anno = 0;
public dataOdierna;

constructor(private socioService: SocioService,
            private tesseramentoService: TesseramentoService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

  ngOnInit(): void {
    console.log('TesseramentoDetail - sono in oninit  ');

    // this.checkFunctionbylevel();

    this.goApplication();

  }

  goApplication() {
    const date = Date();
    this.dataOdierna = new Date(date);

    this.anno  = this.dataOdierna.getFullYear();

    console.log('goApplication - anno: ' + this.anno);





    this.rotta = this.route.snapshot.url[0].path;
    this.level = parseInt(localStorage.getItem('user_ruolo'));
    this.rottaId = parseInt(this.route.snapshot.url[1].path);


    this.route.paramMap.subscribe(p => {
      this.idpassed = +p.get('id');
      console.log('id recuperato: ' + this.idpassed);
      this.loadSocio(this.idpassed);
      this.loadTesseramento(this.idpassed);
     });
  }




// recupero i dati della messa
async loadSocio(id: number) {
    console.log('frontend - loadSocio: ' + id);
    let rc = await  this.socioService.getSocio(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('socio da editare in Tesseramento: ' + JSON.stringify(response['data']));
            this.socio = response['data'];
          }
          if(response['rc'] === 'nf') {
            this.Message = response['message'];
            this.type = 'error';
            this.showNotification( this.type, this.Message);
          }
        },
        error => {
          alert('Tesseramento-Detail  --loadSocio: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
        });
}

async loadTesseramento(id: number) {
      console.log('frontend - loadTesseramento: ' + id);
      this.trovatoRec = false;
      this.isVisible = true;
      let rc = await  this.tesseramentoService.getbySocio(id).subscribe(
      // sentire hidran per lettura particolare
      // this.fedeleService.getFedeliforMessa(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            this.tesseramenti = response['data'];
            this.nRec = response['number'];
            this.textMessage = response['message'];
            this.trovatoRec = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Situazione Attuale';
            if(this.nRec === 0){
              this.Message = 'socio Non tesserato';
            }
          }
          if(response['rc'] === 'nf') {
            this.tesseramenti = this.tesseramentinull;
            this.alertSuccess = true;
            this.trovatoRec = false;
            this.nRec = 0;
            this.Message = 'primo rinnovo';
            this.type = 'success';
          }
          this.showNotification( this.type, this.Message);





         //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
         //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
        },
        error => {
           alert('TesseramentoDetail  -- loadTesseramento: ' + error.message);
           console.log(error);
           this.alertSuccess = false;
           this.Message = error.message;
           this.showNotification( this.type, this.Message);
        });

}



async registra() {
// verifica preliminare che non sia già stata effettuata il rinnovo

console.log('frontend - registra');
this.trovatoRec = false;
this.isVisible = true;
let rc = await  this.tesseramentoService.getbySocioeAnno(this.socio.id, this.anno).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Rinnovo Tessera già effettuato';
      this.showNotification( this.type, this.Message);
      }
    if(response['rc'] === 'nf') {
      this.router.navigate(['socio/rinn/' + this.socio.id]);
    }
  },
  error => {
     alert('TesseramentoDetail  -- Registra: ' + error.message);
     console.log(error);
     this.alertSuccess = false;
     this.Message = error.message;
     this.showNotification( this.type, this.Message);
  });
}



/*    da  buttare


  checkFunctionbylevel() {
    //  ----- parte comune a tutti i moduli


//    filtro di recupero dati per questa gestione
this.rotta = this.route.snapshot.url[0].path;
this.level = parseInt(localStorage.getItem('user_ruolo'));
this.rottaId = parseInt(this.route.snapshot.url[1].path);
this.functionUrl = 'Edits';  // <------   forzatura. permesso solo a -1

console.log('checkFunctionbylevel --------------------   step_01  ');
// console.log('frontend - checkFunctionbylevel -- step_01');

this.ctrfuncService.checkFunctionbylevelDetail(this.rotta, this.level, this.functionUrl).subscribe(
 response =>{
        if(response['rc'] === 'ko') {
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = response['message'];
          this.showNotification(this.type, this.Message);
          return;
        }
        console.log('checkFunctionbylevel --------------------   step_02  ');
        if (response['rc'] === 'ok') {
          this.functionUser = response['data'];
          //  ----- fine parte comune a tutti i moduli

            //  parte personalizzabile
               //   console.log('frontend - checkFunctionbylevelDetail - funzione determinata: ' + this.functionUser);
               //   console.log('messaggio: ' + response['message']);
          this.functionInqu =  false;
          this.functionEdit = false;
          this.functionEdits = false;
          this.functionNew = false;

          if (this.level === -1) {
            if (this.functionUser === this.searchEdit) {
              this.functionEdit = true;
            }
            if (this.functionUser === this.searchEdits) {
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
          this.isVisible = true;
          this.alertSuccess = true;
          console.log('checkFunctionbylevel --------------------   step_03  ');
          this.route.paramMap.subscribe(p => {
            this.idpassed = +p.get('id');
            console.log('id recuperato: ' + this.idpassed);
            // -------  leggo i dati della giornata
            this.loadManifestazione(this.idpassed);
            console.log('checkFunctionbylevel --------------------   step_04  ');
            this.tipoRichiesta = "T";
            this.loadGiornatefromManif(this.idpassed, this.tipoRichiesta);
            console.log('checkFunctionbylevel --------------------   step_05  ');
            if(this.functionEdit || this.functionEdits) {
              this.title = 'Situazione Manifestazione';
              this.fase = 'M';
             } else {
              this.title = 'Visualizzazione User';
              this.fase = 'I';
             }
            this.Message = 'Situazione Attuale utente';
          //  fine parte personalizzabile
        });
        console.log('checkFunctionbylevel --------------------   step_99  ');
          this.type = 'success';
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




onSelectionChange(tipo: string)   {

// alert('onSelectionChange - Tipo Richiesta: ' + tipo);

this.tipoRichiesta = tipo.substring(0, 1);


this.trovatoRec = false;
this.isVisible = true;
this.TesseramentoService.getGiornateforManif(this.idpassed, this.tipoRichiesta).subscribe(
// sentire hidran per lettura particolare
// this.fedeleService.getFedeliforMessa(id).subscribe(
  response => {
      console.log('dopo ricerca per tipo ' + this.tipoRichiesta + ' esito: ' + response['rc'] + ' dati: ' + JSON.stringify(response['data']) + ' record: ' + response['number']) ;
      if(response['rc'] === 'ok') {
        this.giornate = response['data'];
        this.nRec = response['number'];
        this.textMessage = response['message'];
        this.trovatoRec = true;
        this.alertSuccess = true;
        this.Message = 'Situazione Attuale';
      }
      if(response['rc'] === 'nf') {
        this.giornate = this.giornatenull;
        this.nRec = response['number'];
        this.textMessage = response['message'];
        this.trovatoRec = false;
        this.alertSuccess = false;
        this.Message = 'Situazione Attuale - Nessuna giornata presente per il tipo di richiesta';
      }


   //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
   //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
  },
  error => {
     alert('Manifestazione-day  -- onSelectionChange: ' + error.message);
     console.log(error);
     this.alertSuccess = false;
     this.Message = error.message;
  });




}





*/





