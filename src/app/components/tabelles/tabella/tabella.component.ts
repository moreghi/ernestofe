
/*
     tabelle da inserire in gestione tabelle



t_tipo_commandas


*/


import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Services
import { TabellaService} from '../../../services/tabella.service';
import { TabellaTwDettService} from '../../../services/tabella-tw-dett.service';
import { TabellaTwService} from '../../../services/tabella-tw.service';
//  service tabelle da normalizzare in twdett

import { TruoloService } from '../../../services/truolo.service';  // tabella_3

import { TstatoutenteService } from '../../../services/tstatoutente.service';  // tabella_16

import { TtitoloService } from '../../../services/ttitolo.service';  // tabella_19


import { TstatoprenotazioneService } from '../../../services/tstatoprenotazione.service';  // tabella_25

// Model Class
import { Tabellat} from '../../../classes/Tabella_t';
import { TabellatwDett} from '../../../classes/Tabella_tw_dett';
import { Tabellatw} from '../../../classes/Tabella_tw';
// model class tabelle da portare in tabellatwdett
// model classi tabelle da Normalizzare in twdwtt

import { Truolo } from '../../../classes/T_ruolo';  // tabella_3

import { TstatoUtente } from '../../../classes/T_stato_utente';  // tabella_16

import { Ttitolo } from '../../../classes/T_titolo';  // tabella_19


import { TstatoPrenotazione } from '../../../classes/T_stato_prenotazione';  // tabella_25


import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr [app-tabella]',
  templateUrl: './tabella.component.html',
  styleUrls: ['./tabella.component.css']
})
export class TabellaComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('tabella-prog') i: number;
   @Input('tabella-data') tabella: Tabellat;

   // passo dati a tabelle
  @Output('onSelectTabella') onSelectTabella = new EventEmitter();
  @Output('esitoTabella') esitoTabella = new EventEmitter();





   public tabelletwDett: TabellatwDett[] = [];
   public tabellatwdett: TabellatwDett;
   public tabellatw: Tabellatw;
   public tabellat: Tabellat;


   public truoli: Truolo[] = [];
   public tstatiutente: TstatoUtente[] = [];
   public ttitoli: Ttitolo[] = [];

   public tstatiprenotazione: TstatoPrenotazione[] = [];

   faUserEdit = faUserEdit;
   faTrash = faTrash;
   faInfo = faInfo;
   faInfoCircle = faInfoCircle;
   faList = faList;
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faChartPie = faChartPie;

 // -----
   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public perDebug = 'utente passato: ';
   public Message = '';
   public presenti = false;
   public isVisible = false;
   public alertSuccess = false;
   public function = 0;
   public nRec = 0;

   public utenteFedele = false;

    // variabili per gestione inqu/edit/new

   public href = '';
   public functionInqu = false;
   public functionEdit = false;
   public functionNew = false;
   public functionElenco = false;

   public searchInqu = 'show';
   public searchEdit = 'edit';
   public searchNew = 'new';
   public searchElenco = 'read';

   // funzioni di navigazione
   public navigateInqu = 'Inqu';
   public navigateEdit = 'Edit';
   public navigateEdits = 'Edits';
   public navigateNew = 'New';
   public navigateDays = 'Days';
   public navigateGraficoDays = 'GraphDays';

   public messagenull = 'Nessun record presente !!!';
   public esitoNegativo = 'tabella non disponibile';

   closeResult = '';

// variabili per notifica esito operazione con Notifier
  public type = '';



   constructor(private tabellaService: TabellaService,
               private tabellaTwDettService: TabellaTwDettService,
               private tabellaTwService: TabellaTwService,
               private tstatoutenteService: TstatoutenteService,

               private ttitoloService: TtitoloService,
               private truoloService: TruoloService,

               private tstatoprenotazioneService: TstatoprenotazioneService,

               private modalService: NgbModal,
               private route: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                this.notifier = notifier;
              }




   ngOnInit(): void {

      //   per gestire eventuale popup
      this.headerPopup = 'Registrazione Manifestazione';
      this.textMessage1 = '?????????? ';
   //   this.textUser = this.messa.demessa;
      this.textMessage2 = 'Registrazione non possibile';


    //  console.log('onInit - tabella passata: ' + JSON.stringify(this.tabella));

      // this.cancellaTabellatwdett();


   }


   showElemTabella(tabella: Tabellat) {

    this.tabellat = tabella;
    this.cancellaTabellatw(tabella);
  }

/*
  navigate(pathNavigate: string, manif: Manifestazione) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${manif.id} `);


    switch (pathNavigate) {

         case 'Inqu':
         this.route.navigate(['manif/inqu/' + manif.id]);
         break;
      case 'Edit':
        this.route.navigate(['manif/edit/' + manif.id]);
        break;
      case 'Edits':
        this.route.navigate(['manif/edits/' + manif.id]);
        break;
      case 'Days':
        this.route.navigate(['manif/' + manif.id]);
        break;
      case 'GraphDays':
        this.route.navigate(['manif/grafico/day/' + manif.id]);
        break;
      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


  naviga(manif: Manifestazione) {
let aa = 'manif/grafico/day/' + manif.id;
console.log('path per grafico: ' + aa);
return;
    this.route.navigate(['manif/grafico/day/' + manif.id]);
  }
*/


// cancellazione tabella dettaglio
/*
async cancellaTabellatwdett() {

  let rc =  await  this.tabellaTwDettService.deleteAll().subscribe(
       res => {
        // non faccio nulla
      },
      error => {
         alert('Tabella  -- cancellaTabellatwdett - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      });
}

*/
async cancellaTabellatw(tabella: Tabellat) {
  console.log('cancellaTabellatw - appena entrato');
  let rc =  await  this.tabellaTwService.deleteAll().subscribe(
       res => {
           if(res['rc'] === 'ok') {
             console.log('cancellato tabellatw');
             this.inserisciTabellatw(tabella);
           }
        // non faccio nulla
      },
      error => {
         alert('Tabella  -- cancellaTabellatw - errore: ' + error.message);
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification(this.type, this.Message)
      });
}


async inserisciTabellatw(tabella: Tabellat) {


  this.tabellatw = new Tabellatw();
  this.tabellatw.idTab  = tabella.id;
  this.tabellatw.nametab = tabella.d_tabella;
  this.tabellatw.key_utenti_operation = parseInt(localStorage.getItem('id'));
  console.log('fe - inserisciTabellatw  --- appena entrato ----  ' + JSON.stringify(this.tabellatw));
  const rc1 = await this.tabellaTwService.create(this.tabellatw).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          this.elaboraTabellaSelect(tabella);
          }
      },
    error =>
       {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification(this.type, this.Message);
       });

}





/*
     Show a notification

     @param {string} type Notification type
     @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  }

  elaboraTabellaSelect(tabella: Tabellat) {


    switch (tabella.id) {

      case 3:
        this.editaTabella_03(tabella.id, tabella);
        break;

      case 16:
        this.editaTabella_16(tabella.id, tabella);
        break;

      case 19:
        this.editaTabella_19(tabella.id, tabella);
        break;

      case 25:
        this.editaTabella_25(tabella.id, tabella);
        break;
      case 99:
        this.editaTabella_99(tabella.id, tabella);
        break;



      default:
      alert('Scelta errata \n editazione tabella non possibile');
      break;
}



  }

// editazione tabelle


async editaTabella_03(idtab: number, tabella: Tabellat) {
  console.log('editaTabella_03 - appena entrato');
  const rc =  await this.truoloService.getRuoli().subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.truoli = response['data'];
          console.log('editaTabella_03 --------------------------------- letto tabella da migrare ' + JSON.stringify(this.truoli));
          for(const tabel of this.truoli) {
            this.tabellatwdett = new TabellatwDett();
            this.tabellatwdett.id  = tabel.id;
            this.tabellatwdett.idtab  = 0;
            this.tabellatwdett.idtabella  = idtab;
            this.tabellatwdett.descrizione = tabel.d_ruolo;
            this.tabellatwdett.key_utenti_operation = parseInt(localStorage.getItem('id'));
            console.log('editaTabella_03 ------------------------------------------------- pronto per insert: ' + JSON.stringify(this.tabellatwdett));


            this.registraTabellatwdett(this.tabellatwdett);
            }
         // setTimeout(this.returntoPadre, 5000);
          this.onSelectTabella.emit(tabella);

          }
     },
    error =>
        {
         this.Message = error.message;
         this.alertSuccess = false;
         this.type = 'error';
         console.log(error);
         this.showNotification(this.type, this.Message);
        });
}



async editaTabella_16(idtab: number, tabella: Tabellat) {

  const rc =  await this.tstatoutenteService.getAll().subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.tstatiutente = response['data'];
       //   console.log('editaTabella_1304 -------------- letto tabella da migrare ' + JSON.stringify(this.tstatipersona));
          for(const tabel of this.tstatiutente) {
            this.tabellatwdett = new TabellatwDett();
            this.tabellatwdett.id  = tabel.id;
            this.tabellatwdett.idtab  = 0;
            this.tabellatwdett.idtabella  = idtab;
            this.tabellatwdett.descrizione = tabel.d_stato_utente;
            this.tabellatwdett.key_utenti_operation = parseInt(localStorage.getItem('id'));
         //   console.log('editaTabella_04 ------------------------------------------------- pronto per insert: ' + JSON.stringify(this.tabellatwdett));


            this.registraTabellatwdett(this.tabellatwdett);
            }
         // setTimeout(this.returntoPadre, 5000);
          this.onSelectTabella.emit(tabella);

          }
     },
    error =>
        {
         this.Message = error.message;
         this.alertSuccess = false;
         this.type = 'error';
         console.log(error);
         this.showNotification(this.type, this.Message);
        });

}


async editaTabella_19(idtab: number, tabella: Tabellat) {

  const rc =  await this.ttitoloService.getAll().subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.ttitoli = response['data'];
       //   console.log('editaTabella_1304 -------------- letto tabella da migrare ' + JSON.stringify(this.tstatipersona));
          for(const tabel of this.ttitoli) {
            this.tabellatwdett = new TabellatwDett();
            this.tabellatwdett.id  = tabel.id;
            this.tabellatwdett.idtab  = 0;
            this.tabellatwdett.idtabella  = idtab;
            this.tabellatwdett.descrizione = tabel.d_titolo;
            this.tabellatwdett.key_utenti_operation = parseInt(localStorage.getItem('id'));
         //   console.log('editaTabella_04 ------------------------------------------------- pronto per insert: ' + JSON.stringify(this.tabellatwdett));


            this.registraTabellatwdett(this.tabellatwdett);
            }
         // setTimeout(this.returntoPadre, 5000);
          this.onSelectTabella.emit(tabella);

          }
     },
    error =>
        {
         this.Message = error.message;
         this.alertSuccess = false;
         this.type = 'error';
         console.log(error);
         this.showNotification(this.type, this.Message);
        });
}


async editaTabella_25(idtab: number, tabella: Tabellat) {

  const rc =  await this.tstatoprenotazioneService.getAll().subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.tstatiprenotazione = response['data'];
       //   console.log('editaTabella_1304 -------------- letto tabella da migrare ' + JSON.stringify(this.tstatipersona));
          for(const tabel of this.tstatiprenotazione) {
            this.tabellatwdett = new TabellatwDett();
            this.tabellatwdett.id  = tabel.id;
            this.tabellatwdett.idtab  = 0;
            this.tabellatwdett.idtabella  = idtab;
            this.tabellatwdett.descrizione = tabel.d_stato_prenotazione;
            this.tabellatwdett.key_utenti_operation = parseInt(localStorage.getItem('id'));
         //   console.log('editaTabella_04 ------------------------------------------------- pronto per insert: ' + JSON.stringify(this.tabellatwdett));


            this.registraTabellatwdett(this.tabellatwdett);
            }
         // setTimeout(this.returntoPadre, 5000);
          this.onSelectTabella.emit(tabella);

          }
     },
    error =>
        {
         this.Message = error.message;
         this.alertSuccess = false;
         this.type = 'error';
         console.log(error);
         this.showNotification(this.type, this.Message);
        });



}




// tabella non gestita
editaTabella_99(idtab: number, tabella: Tabellat) {
  localStorage.removeItem('tabella');
  localStorage.setItem('tabella', tabella.d_tabella);
  this.esitoTabella.emit(this.esitoNegativo);
}

returntoPadre() {
  this.onSelectTabella.emit(this.tabellat);
}


async registraTabellatwdett(tabellatwdett: TabellatwDett) {

  const rc1 = await this.tabellaTwDettService.create(tabellatwdett).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
//                  alert('----------------------    inserito commandariga' + prg);
          }
      },
    error =>
       {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification(this.type, this.Message);
       });
}














}


