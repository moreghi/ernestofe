// https://www.itsolutionstuff.com/post/angular-radio-button-with-reactive-form-tutorialexample.html   esempio di creazione form formgroup
// https://www.youtube.com/watch?v=zlgxceL2I7w      esempio per combo

import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { SociosearchService } from './../../../services/sociosearch.service';
import { TlocalitaService } from './../../../services/tlocalita.service';
import { TstatoutenteService } from './../../../services/tstatoutente.service';
// Model
import { SocioSearch } from '../../../classes/SocioSearch';
import { Tlocalita } from '../../../classes/T_localita';
import { TstatoUtente } from '../../../classes/T_stato_utente';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply, faMinus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
// varie
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { of } from 'rxjs';




@Component({
  selector: 'app-socio-searchpop',
  templateUrl: './socio-searchpop.component.html',
  styleUrls: ['./socio-searchpop.component.css']
})
export class SocioSearchpopComponent implements OnInit {

  public sociosearch: SocioSearch;
  public localitas: Tlocalita[] = [];
  public localita: Tlocalita;

  public stati: TstatoUtente[] = [];

  public title = "Filtri Selezione Socio";

  // icone
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faUserEdit = faUserEdit;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faInfoCircle = faInfoCircle;
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
   public type = '';
   public isSelected = false;

   public saveValueStd: boolean;

   public nRecRuoloSearch = 0;
   public selectedCorrect = false;
   public selectedUser: SocioSearch;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public selectedLocalita = 0;
   public selectedStato = 0;
   public MessageSearch = '';
   public resultSearch = 'Ricerca per: ';
   public searchTessereTutte = 'Tutte le tessere';
   public searchTesseredaRinnovare = 'tessere da Rinnovare';
   public searchTessereRinnovate = 'tessere Rinnovate';
   public searchLocalita = 'Località: ';


   public selOperativo = false;
   public selSesso = false;
   public selCell = false;
   public selEmail = false;
   public selLocalita = false;
   public selTessere = false;
   public activeSelection = false;


   constructor(public modal: NgbActiveModal,
               private sociosearchService: SociosearchService,
               private tocalitaService: TlocalitaService,
               private tstatoutenteService: TstatoutenteService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                }


  ngOnInit(): void {

   // alert('sono in oninit - title: ' + this.title);
    console.log('dati passati da chiamante: ' + this.selectedUser.id );
  //  alert('sono in oninit - title ...................................................... : ' + this.title);
    this.sociosearch = this.selectedUser;   // salvo la località ricevuta.

    this.saveValueStd = false;
    this.isLoading = false;
    this.activeSelection = false;

     //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
    this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
  // carico le combo
   this.loadLocalita();
   this.loadStati();
   this.isVisible = true;
   this.alertSuccess = true;
   this.Message = 'effettuare la selezione per una nuova ricerca';
   this.MessageSearch = '';

   this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
        stato: [this.selectedUser.stato, Validators.required],
        tessere: [this.selectedUser.tessere, Validators.required],
        localita: [this.selectedUser.localita, Validators.required],
        operativo: [this.selectedUser.operativo, Validators.required],
        sesso: [this.selectedUser.sesso, Validators.required],
        email: [this.selectedUser.email, Validators.required],
        cell: [this.selectedUser.cell, Validators.required],
        orderby: [this.selectedUser.orderby, Validators.required]
       });

    }

  async  aggiornaSociosearch() {
      console.log('aggiornaSociosearch ----  appena entrato');
      this.sociosearch = this.editForm.value;
      this.sociosearch.key_utenti_operation = parseInt(localStorage.getItem('id'));
      this.sociosearch.d_search = 'selezione utente id: ' + parseInt(localStorage.getItem('id'));
      this.sociosearch.id = 1;

      console.log('pronto per modifica ' +JSON.stringify(this.sociosearch));


    // recuperare l'ultimo id inserito
      let rc = await this.sociosearchService.update(this.sociosearch).subscribe(
        resp => {
          if (resp['rc'] === 'ok') {
                //  this.loadLocalita();
                  this.type = 'success';
                  this.Message = 'effettuato inserimento filtri ricerca soci ';
                  this.showNotification(this.type, this.Message);
                //   this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                  this.modal.dismiss('Cross click');
               }
           },
           error => {
             alert(' sono in aggiornaSociosearch');
             this.isLoading = false;
             console.log(error);
             this.type = 'error';
             this.Message = 'Errore inserisci SocioSearch' + '\n' + error.message;
             this.showNotification(this.type, this.Message);
             this.alertSuccess = false;
           });
     }


     onSelectedLocalita(selectedValue: number) {
      //  alert('selezionato: ' + selectedValue);
       if(selectedValue ==  9999) {
         this.type = 'error';
         this.Message = 'selezione non corrette';
         this.showNotification(this.type, this.Message);
         this.alertSuccess = false;
         this.isVisible = true;
         this.selectedLocalita = 0;
         return;
      } else {
       this.selectedLocalita = selectedValue;
       this.sociosearch.localita = selectedValue;
       this.loadLocalitaSelezionata(selectedValue);
       this.activeSelection = true;
       /*   la gestione del massaggio riepilogativo la riprendo poi
       if(this.selOperativo === true ||
          this.selSesso === true ||
          this.selCell === true ||
          this.selEmail === true ||
          this.selTessere === true) {
            this.MessageSearch = this.resultSearch + ' e ';
          }
       this.MessageSearch = this.resultSearch + this.searchLocalita + this.localita.d_localita;
      }
       this.Message = this.MessageSearch;  */
    }

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
     this.sociosearch.stato = selectedValue;
   //  this.loadLocalitaSelezionata(selectedValue);
     this.activeSelection = true;
     /*   la gestione del massaggio riepilogativo la riprendo poi
     if(this.selOperativo === true ||
        this.selSesso === true ||
        this.selCell === true ||
        this.selEmail === true ||
        this.selTessere === true) {
          this.MessageSearch = this.resultSearch + ' e ';
        }
     this.MessageSearch = this.resultSearch + this.searchLocalita + this.localita.d_localita;
    }
     this.Message = this.MessageSearch;  */
  }

}








    selectOperativo(selectedValue: string) {
       this.sociosearch.operativo = selectedValue;
       this.activeSelection = true;
    }

    selectSesso(selectedValue: string) {
      this.sociosearch.sesso = selectedValue;
      this.activeSelection = true;
   }
     selectEmail(selectedValue: string) {
      this.sociosearch.email = selectedValue;
      this.activeSelection = true;
   }
     selectCell(selectedValue: string) {
      this.sociosearch.cell = selectedValue;
      this.activeSelection = true;
   }
    selectOrder(selectedValue: string) {
    this.sociosearch.orderby = selectedValue;
    this.activeSelection = true;
  }

    selectTessere(selectedValue: string) {
    this.sociosearch.tessere = selectedValue;
    this.selTessere = true;
    this.activeSelection = true;
/*
    switch (selectedValue) {
      case 'T':
        this.MessageSearch = this.resultSearch + this.searchTessereTutte;
        this.selOperativo = false;
        this.selSesso = false;
        this.selCell = false;
        this.selEmail = false;
        this.selLocalita = false;
        break;
      case 'N':
          if(this.selOperativo === true ||
            this.selSesso === true ||
            this.selCell === true ||
            this.selEmail === true ||
            this.selLocalita === true) {
              this.MessageSearch = this.resultSearch + ' e ';
            }
          this.MessageSearch = this.resultSearch + this.searchTesseredaRinnovare;
          break;
      case 'R':
      if(this.selOperativo === true ||
        this.selSesso === true ||
        this.selCell === true ||
        this.selEmail === true ||
        this.selLocalita === true) {
          this.MessageSearch = this.resultSearch + ' e ';
        }
      this.MessageSearch = this.resultSearch + this.searchTessereRinnovate;
      break;
    }
    this.Message = this.MessageSearch;
    */

  }




/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}

  closeModal(modalId?: number){

    alert('idModal: ' + modalId);
    if(modalId === 2) {
      alert('premuto Annulla su modalDelete')
    }
    if(modalId === 1) {
      alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
      this.modalService.hide();
    }
    alert('chiuso la seconda modal');
    this.modalService.hide(modalId);
    }

    loadLocalita() {
       this.tocalitaService.getAll().subscribe(
        res => {
         //     console.log('loadLocalita: ' + res['data']);
              this.localitas = res['data'];
           },
          error => {
             alert('loadLocalita - errore: ' + error.message);
             console.log(error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
          });
    }

    loadStati() {
      this.tstatoutenteService.getAll().subscribe(
       res => {
       //      console.log('loadStati: ' + res['data']);
             this.stati = res['data'];
          },
         error => {
            alert('loadStati - errore: ' + error.message);
            console.log(error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
         });
   }





    async loadLocalitaSelezionata(id: number) {
     let rc = await this.tocalitaService.getbyId(id).subscribe(
        res => {
              this.localita = res['data'];
           },
          error => {
             alert('loadLocalita - errore: ' + error.message);
             console.log(error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
          });
    }







  async  onSubmit() {

      /*
      this.editForm = this.formBuilder.group({
        tipologia: [this.selectedTipologiaValue],
        competenza: [this.selectedCompetenzaValue],
        categoria: [this.selectedCategoriaValue]
       });
  */

/*
        if (this.editForm.invalid ) {
          alert('form invalido');
        }
*/
        if(this.activeSelection === false) {
          alert('effettuare selezioni');
          return;
        }

        this.aggiornaSociosearch();
        this.modal.close('Yes');

    }


}
