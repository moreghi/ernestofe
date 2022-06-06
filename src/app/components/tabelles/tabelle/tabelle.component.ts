import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { TabellaService } from '../../../services/tabella.service';
import { TabellaTwDettService } from '../../../services/tabella-tw-dett.service';
//  service tabelle da normalizzare in twdett

import { TruoloService } from '../../../services/truolo.service';  // tabella_3

import { TstatoutenteService } from '../../../services/tstatoutente.service';  // tabella_16
import { TtitoloService } from '../../../services/ttitolo.service';  // tabella_19
import { TstatoprenotazioneService } from '../../../services/tstatoprenotazione.service';  // tabella_25

// classi
import { Tabellat} from '../../../classes/Tabella_t';
import { TabellatwDett } from '../../../classes/Tabella_tw_dett';
// model classi tabelle da Normalizzare in twdwtt

import { Truolo } from '../../../classes/T_ruolo';  // tabella_3

import { TstatoUtente } from '../../../classes/T_stato_utente';  // tabella_16

import { Ttitolo } from '../../../classes/T_titolo';  // tabella_19


import { TstatoPrenotazione } from '../../../classes/T_stato_prenotazione';  // tabella_25

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tabelle',
  templateUrl: './tabelle.component.html',
  styleUrls: ['./tabelle.component.css']
})
export class TabelleComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public tabelle: Tabellat[] = [];
  public tabella: Tabellat;
  public tabelletwdett: TabellatwDett[] = [];
  public tabellatwdett: TabellatwDett;
  public tabelletwdettnull: TabellatwDett[] = [];

// tabelle da normalizzare in twdett

public truolo: Truolo;

public tstatoutente: TstatoUtente;

public ttitolo: Ttitolo;

public tstatoprenotazione: TstatoPrenotazione;


 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';
 public functionUser = '';
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


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Tabelle";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;


  // per paginazone
  p = 1;
  p_e = 1;

  pagination = 1;
  pagination1 = 2;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public nameTselected = '';
  public enabledSelectTabella = false;
  public SelectTabella = false;

constructor(private tabellaService: TabellaService,
            private tabellaTwDettService: TabellaTwDettService,

            private tstatoutenteService: TstatoutenteService,

            private ttitoloService: TtitoloService,
            private truoloService: TruoloService,
            private tstatoprenotazioneService: TstatoprenotazioneService,

            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
              this.enabledSelectTabella = false;
              this.SelectTabella = false;
             // this.checkFunctionbylevel();

              this.goApplication();

          }



          goApplication() {
            this.loadTabelle();

          }


          async loadTabelle() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.tabellaService.getAll().subscribe(
                 res => {
                    this.tabelle = res['data'];
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Tabelle  -- loadTabelle - errore: ' + error.message);
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

  onSelectTabella(tabel: Tabellat)  {

    console.log('onSelectTabella - selezionato: ' + tabel.id + ' ' + tabel.d_tabella);

    this.tabella = tabel;
    this.nameTselected = tabel.d_tabella;
    this.enabledSelectTabella = true;

    this.editaTabellatwdett();
   // this.elaboraTabellaSelect(tabel.id);   spostato su tabella

   }

   // ricevo i dati dal figlio (tabella-tw-dett) con i dati per aggiornamento della tabella effettiva
   onUpdateTabella(tabel: TabellatwDett) {

    console.log('tabelle (padre)  onUpdateTabella - selezionato: ' + tabel.id + ' ' + tabel.descrizione + ' ' + tabel.idtabella);

    this.aggiornaeltabella(tabel.idtabella, tabel.id, tabel.descrizione);

   }

  esitoTabella(risposta: string) {

    console.log('esitoTabella - risposta: ' + risposta);

    if(risposta === 'tabella non disponibile') {
      this.nameTselected =  localStorage.getItem('tabella');
      localStorage.removeItem('tabella');
      this.enabledSelectTabella = false;
      this.Message = risposta;
      this.alertSuccess = false;
      this.type = 'error';
      this.isVisible = true;
      this.showNotification(this.type, this.Message);
    }

  }


  aggiornaeltabella(idTabella: number, id: number, descrizione: string) {

  switch (idTabella) {

      case 3:
        this.aggiornaTabella_03(id, descrizione);
        break;


      case 16:
        this.aggiornaTabella_16(id, descrizione);
        break;
      case 19:
        this.aggiornaTabella_19(id, descrizione);
        break;
      case 25:
        this.aggiornaTabella_25(id, descrizione);
        break;
      default:
      alert('Scelta errata \n editazione tabella non possibile');
      break;
    }
  }

/*
*  --------------------------------------------------------------  aggiornaTabella
*/


async aggiornaTabella_03(id: number, descrizione: string) {
  const rc =  await this.truoloService.getRuolo(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.truolo = response['data'];
          this.truolo.d_ruolo = descrizione;
          this.truolo.key_utenti_operation = parseInt(localStorage.getItem('user_ruolo'));
          this.updatetabella_03(this.truolo);
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

async aggiornaTabella_16(id: number, descrizione: string) {
  const rc =  await this.tstatoutenteService.getbyid(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.tstatoutente = response['data'];
          this.tstatoutente.d_stato_utente = descrizione;
          this.tstatoutente.key_utenti_operation = parseInt(localStorage.getItem('user_ruolo'));
          this.updatetabella_16(this.tstatoutente);
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


async aggiornaTabella_19(id: number, descrizione: string) {
  const rc =  await this.ttitoloService.getbyid(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.ttitolo = response['data'];
          this.ttitolo.d_titolo = descrizione;
          this.ttitolo.key_utenti_operation = parseInt(localStorage.getItem('user_ruolo'));
          this.updatetabella_19(this.ttitolo);
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



async aggiornaTabella_25(id: number, descrizione: string) {
  const rc =  await this.tstatoprenotazioneService.getbyid(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {            //  response['success']
          this.tstatoprenotazione = response['data'];
          this.tstatoprenotazione.d_stato_prenotazione = descrizione;
          this.tstatoprenotazione.key_utenti_operation = parseInt(localStorage.getItem('user_ruolo'));
          this.updatetabella_25(this.tstatoprenotazione);
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



/*
*  ---------------------------------------------------  Update Tabella
*/


async updatetabella_03(truolo: Truolo) {

  const rc1 = await this.truoloService.updateRuolo(truolo).subscribe(
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




async updatetabella_16(tstatoutente: TstatoUtente) {
  const rc1 = await this.tstatoutenteService.update(tstatoutente).subscribe(
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

async updatetabella_19(ttitolo: Ttitolo) {
  const rc1 = await this.ttitoloService.updatePersona(ttitolo).subscribe(
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



async updatetabella_25(tstatoprenotazione: TstatoPrenotazione) {
  const rc1 = await this.tstatoprenotazioneService.update(tstatoprenotazione).subscribe(
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

async editaTabellatwdett() {

  let rc =  await  this.tabellaTwDettService.getAll().subscribe(
       res => {
         if(res['rc'] === 'ok') {
           this.tabelletwdett = res['data'];
           this.alertSuccess = true;
           this.SelectTabella = true;
           this.Message = 'Situazione Attuale';
         }
         if(res['rc'] === 'nf') {
          this.tabelletwdett = this.tabelletwdettnull;
          this.Message = 'Nessuna tabella presente';
         }
      },
      error => {
         alert('Tabelle  -- editaTabellatwdett - errore: ' + error.message);
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification(this.type, this.Message);
      });
   }

/*

          async   checkFunctionbylevel() {
            this.rotta = this.route.snapshot.url[0].path;
            this.level = parseInt(localStorage.getItem('user_ruolo'));

            console.log('checkFunctiobylevel - inizio: -- rotta ' + this.rotta + ' level:' + this.level);

            let rc =  await this.ctrfuncService.getfuncbyProfilo(this.level, this.rotta).subscribe(
              res =>{
               console.log(res,'res-->');
               if(res['rc'] === 'ko')  {
                this.type = 'error';
                this.Message = res['message'];
                this.showNotification(this.type, this.Message);
                return;
               }
               if(res['rc'] === 'ok') {
                  if(res['number'] !== 1) {
                    this.type = 'error';
                    this.Message = 'Modulo non ancona habilitation';
                    this.showNotification(this.type, this.Message);
                  }  else {
                    this.functionUser = res['data'];
                    //   parte pubblica   --  fine
                    console.log('checkFunctionbylevel - funzione determinata: ' + this.functionUser);
                    // parte personalizzata
                    this.loadTabelle();
                   }
                  }
                },
                   error => {
                      alert('Tabelle  -- checkFunctionbylevel - errore: ' + error.message);
                      console.log(error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;
                      this.showNotification(this.type, this.Message);
                   });

          }



*/

}


