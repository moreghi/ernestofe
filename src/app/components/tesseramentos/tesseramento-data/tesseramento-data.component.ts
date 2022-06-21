import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { SocioService} from './../../../services/socio.service';
import { TesseramentoService } from './../../../services/tesseramento.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';
import { QuotatesseraService } from './../../../services/quotatassera.service';

// classi
import { Socio} from '../../../classes/Socio';
import { Tesseramento} from '../../../classes/Tesseramento';
import { Bandieragialla} from '../../../classes/BandieraGialla';
import { Quotatessera} from '../../../classes/Quotatessera';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-tesseramento-data',
  templateUrl: './tesseramento-data.component.html',
  styleUrls: ['./tesseramento-data.component.css']
})
export class TesseramentoDataComponent implements OnInit {

  public title = "elenco tesseramenti - Tesseramento-detail";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faSave = faSave;

  public socio: Socio;
  public tesseramento: Tesseramento;
  public bandieragialla: Bandieragialla;
  public quotatessera: Quotatessera;
  public quotatesseranull: Quotatessera;

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';


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
public idManif = 0;
public functionSelected = '';
public idBg = 1;

public anno = 0;
public dataOdierna;

constructor(private socioService: SocioService,
            private tesseramentoService: TesseramentoService,
            private bandieragiallaService: BandieragiallaService,
            private quotatesseraService: QuotatesseraService,
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

  const date = Date();
  this.dataOdierna = new Date(date);

  this.anno  = this.dataOdierna.getFullYear();

  this.rotta = this.route.snapshot.url[1].path;
  this.level = parseInt(localStorage.getItem('user_ruolo'));
  this.rottaId = parseInt(this.route.snapshot.url[2].path);
  this.idpassed = parseInt(this.route.snapshot.url[2].path);

  console.log('tesseramentoData ----   goApplication  --  Inizio');
  console.log('rotta: ' + this.rotta);

  console.log('level: ' + this.level);
  console.log('rottaId: ' + this.rottaId);





  this.route.paramMap.subscribe(p => {
    this.idpassed = +p.get('id');
    console.log('id recuperato: ' + this.idpassed);
    this.loadSocio(this.idpassed);
    this.loadBandieraGialla(this.idBg);
    this.loadQuotatessera(this.idBg, this.anno);
   });
}

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
          this.showNotification( this.type, this.message);
        }
      },
      error => {
        alert('Tesseramento-Detail  --loadSocio: ' + error.message);
        console.log(error);
        this.alertSuccess = false;
        this.Message = error.message;
        this.type = 'error';
        this.showNotification( this.type, this.message);
      });
}



async loadBandieraGialla(id: number) {
  console.log('frontend - loadBandieragialla: ' + id);
  this.trovatoRec = false;
  this.isVisible = true;
  let rc = await  this.bandieragiallaService.getbyId(id).subscribe(
     response => {

      console.log('letto bandieragialla: ' + JSON.stringify(response['data']));
      if(response['rc'] === 'ok') {
        this.bandieragialla = response['data'];
        }
      if(response['rc'] === 'nf') {
        this.alertSuccess = false;
        this.trovatoRec = false;
        this.Message = 'Inesistente file Bandiera Gialla - avvisare Amministratore';
        this.type = 'error';
      }
      this.showNotification( this.type, this.message);
    },
    error => {
       alert('TesseramentoData  -- loadBandieraGialla: ' + error.message);
       console.log(error);
       this.alertSuccess = false;
       this.Message = error.message;
       this.showNotification( this.type, this.message);
    });

  }

async loadQuotatessera(idbg: number, anno: number) {
  console.log('frontend - loadQuotatessera: ' + idbg + ' per anno: ' + anno);
  this.trovatoRec = false;
  this.isVisible = true;
  let rc = await  this.quotatesseraService.getbyanno(idbg, anno).subscribe(
     response => {

      console.log('letto quota: ' + JSON.stringify(response['data']));
      if(response['rc'] === 'ok') {
        this.quotatessera = response['data'];
        this.trovatoRec = true;
        this.alertSuccess = true;
        this.type = 'success';
        this.Message = 'Conferma il rinnovo della tessera';
      }
      if(response['rc'] === 'nf') {
        this.quotatesseranull = new Quotatessera();
        this.quotatessera = this.quotatesseranull;
        this.alertSuccess = false;
        this.trovatoRec = false;
        this.Message = 'Inesistente Quota annuale - avvisare Amministratore';
        this.type = 'error';
        return;
      }
      this.showNotification( this.type, this.message);
    },
    error => {
       alert('TesseramentoData  -- loadQuotatessera: ' + error.message);
       console.log(error);
       this.alertSuccess = false;
       this.Message = error.message;
       this.showNotification( this.type, this.message);
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

  async registra() {

    console.log('frontend - registra ');
    // normalizzazione della data in string
    let returnDate = '';
    const dd = this.dataOdierna.getDate();
    const mm = this.dataOdierna.getMonth() + 1; //because January is 0!
    const yyyy = this.dataOdierna.getFullYear();
    //Interpolation date
    if (dd < 10) {
        returnDate += `0${dd}/`;
    } else {
        returnDate += `${dd}/`;
    }

    if (mm < 10) {
        returnDate += `0${mm}/`;
    } else {
        returnDate += `${mm}/`;
    }
    returnDate += yyyy;

    console.log('frontend - returnDate: ' + JSON.stringify(returnDate));


    this.tesseramento = new Tesseramento();
    this.tesseramento.anno = this.anno;
    this.tesseramento.dataiscr = returnDate;   //this.dataOdierna;
    this.tesseramento.importo = this.bandieragialla.costoTessera;
    this.tesseramento.idSocio = this.socio.id;
    this.tesseramento.idTessera = this.socio.tessera;
    this.tesseramento.key_utenti_operation = parseInt(localStorage.getItem('id'));

    console.log('frontend - tesseramento prima di inserimento: ' + JSON.stringify(this.tesseramento));




    this.trovatoRec = false;
    this.isVisible = true;
    let rc = await  this.tesseramentoService.createtesseramento(this.tesseramento).subscribe(
       response => {
        if(response['rc'] === 'ok') {
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Rinnovo Tessera eseguito con successo';
          this.showNotification( this.type, this.Message);
          // invio a elenco
          this.router.navigate(['socio/tessera/' + this.socio.id]);
        }
      },
      error => {
         alert('TesseramentoData  -- Registra: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
         this.showNotification( this.type, this.Message);
      });

  }


}
/*

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-tesseramento-detail',
  templateUrl: './tesseramento-detail.component.html',
  styleUrls: ['./tesseramento-detail.component.css']
})
export class TesseramentoDetailComponent implements OnInit {






  goApplication() {
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






/*




@Component({
  selector: 'app-manifestazione-days',
  templateUrl: './manifestazione-days.component.html',
  styleUrls: ['./manifestazione-days.component.css']
})
export class ManifestazioneDaysComponent implements OnInit {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco giornate Manifestazione - Manif-data";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public manif: Manifestazione;
  public giornatenull: Giornata[] = [];

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutte',
    'Aperta',
    'Non Aperta',
    'Chiusa',
    'Estinta'
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



constructor(private SocioService: SocioService,
            private TesseramentoService: TesseramentoService,
            private ctrfuncService: CtrfuncService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }




  ngOnInit(): void {
    console.log('manifestazione-day - sono in oninit  ');

    this.checkFunctionbylevel();

    console.log('manifestazione-day - ----------------------->    finito  ');


  }

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

// recupero i dati della messa
async loadManifestazione(id: number) {
console.log('frontend - loadManifestazione: ' + id);
let rc = await  this.SocioService.getManifestazione(id).subscribe(


response => {
   this.manif = response['data'];
},
error => {
  alert('Manif-Data  --loadManifestazione: ' + error.message);
  console.log(error);
});

}

// metodo fatto da Moreno per selezionare le giornate della manifestazione

async loadGiornatefromManif(id: number, tipoRic: string) {
console.log('frontend - loadGiornatefromManif: ' + id);
this.trovatoRec = false;
this.isVisible = true;
let rc = await  this.TesseramentoService.getGiornateforManif(id,tipoRic).subscribe(
// sentire hidran per lettura particolare
// this.fedeleService.getFedeliforMessa(id).subscribe(
  response => {
      this.giornate = response['data'];
      this.nRec = response['number'];
      this.textMessage = response['message'];
      this.trovatoRec = true;
      this.alertSuccess = true;
      this.Message = 'Situazione Attuale - Nessuna giornata presente per il tipo di richiesta';
      if(this.nRec > 0){
        this.Message = 'Situazione Attuale';
      }

   //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
   //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
  },
  error => {
     alert('Manifestazione-Data  -- loadGiornatefromManif: ' + error.message);
     console.log(error);
     this.alertSuccess = false;
     this.Message = error.message;
  });

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

registra() {

this.router.navigate(['giornata/new/' + this.manif.id]);

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


}





*/



