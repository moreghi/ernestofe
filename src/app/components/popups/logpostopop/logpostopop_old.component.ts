import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { EventoService } from './../../../services/evento.service';
import { W_PrenotazeventoService } from './../../../services/w_prenotazevento.service';
import { LogpostoService } from './../../../services/logposto.service';
// Model
import { Evento } from '../../../classes/Evento';
import { W_Prenotazevento } from '../../../classes/W_Prenotazevento';
import { LogPosto } from '../../../classes/Logposto';
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
  selector: 'app-logpostopop',
  templateUrl: './logpostopop.component.html',
  styleUrls: ['./logpostopop.component.css']
})
export class LogpostopopComponent implements OnInit {

   public evento: Evento;
   public wprenotazevento: W_Prenotazevento;
   public logposto: LogPosto;

  public title = "Gestione Località";

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
   public selectedUser: W_Prenotazevento;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';

   public idPosto = 0;
 //  public isValidFormSubmitted = null;
   public submitted = false;

   constructor(public modal: NgbActiveModal,
               private eventoService: EventoService,
               private wprenotazeventoService: W_PrenotazeventoService,
               private logpostoService: LogpostoService,
               private router: Router,
               datePipe: DatePipe,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                  const dateFormat = 'yyyy-MM-dd';
                }


  ngOnInit(): void {

   // alert('sono in oninit - title: ' + this.title);
    console.log('dati passati da chiamante-id: ' + this.selectedUser.id );
    console.log('dati passati da chiamante: ' +  JSON.stringify(this.selectedUser));
  //  alert('sono in oninit - title ...................................................... : ' + this.title);
    this.wprenotazevento = this.selectedUser;   // salvo la località ricevuta.

    this.idPosto = parseInt(localStorage.getItem('prenEvZidPosto'));
    this.loadlogPosto(this.idPosto);





    // alert('popup - OnInit');

    this.title = 'Registrazione Prenotazione Posto';
   //    alert('trovato record nuovo per inserimento');


    this.saveValueStd = false;
    this.isLoading = false;
     //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
    //this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log('setForm  ---------- ' + JSON.stringify(this.selectedUser));

/*    originale
 this.editForm = this.formBuilder.group({
  id: [this.selectedUser.id],
  token: [this.selectedUser.token],
  descrizione: [this.evento.descrizione],
  data: [this.evento.data],
  cognome: [this.selectedUser.cognome],
  nome: [this.selectedUser.nome],
  email: [this.selectedUser.email],
  telefono: [this.selectedUser.telefono],
  utenteCognome: [this.logposto.cognome, Validators.required, Validators.minLength(5), Validators.maxLength(40)],  // cognome e nome logposto
  utenteNome: [this.logposto.nome, Validators.required, Validators.minLength(5), Validators.maxLength(30)],
  utenteEmail: [this.logposto.email, Validators.email],  // cognome e nome logposto
  utenteCellulare: [this.logposto.cellulare]

 });
*/





this.editForm = this.formBuilder.group({
  id: [this.selectedUser.id],
  token: [this.selectedUser.token],
  descrizione: [this.evento.descrizione],
  data: [this.evento.data],
  cognome: [this.selectedUser.cognome],
  nome: [this.selectedUser.nome],
  email: [this.selectedUser.email],
  telefono: [this.selectedUser.telefono],
  utenteCognome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],  // cognome e nome logposto
  utenteNome: [this.logposto.nome, Validators.required, Validators.minLength(5), Validators.maxLength(30)],
  utenteEmail: [this.logposto.email, Validators.email],  // cognome e nome logposto
  utenteCellulare: [this.logposto.cellulare]


 });






    }

    /*
    inserisciLocalita() {
  //    alert('Inserisci Localita');
      this.localita = this.editForm.value;
      this.localita.key_utenti_operation = parseInt(localStorage.getItem('id'));
    // recuperare l'ultimo id inserito
      this.tocalitaService.create(this.localita).subscribe(
        resp => {
          if (resp['rc'] === 'Ok') {
                //  this.loadLocalita();
                  alert('inserimento correttamente seguito');
                  this.type = 'success';
                  this.Message = 'effettuato inserimento località ';
                  this.showNotification(this.type, this.Message);
                //   this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                  this.modal.dismiss('Cross click');
               }
           },
           error => {
             alert(' sono in inserisciLocalita');
             this.isLoading = false;
             console.log(error);
             this.type = 'error';
             this.Message = 'Errore inserisci Localita' + '\n' + error.message;
             this.showNotification(this.type, this.Message);
             this.alertSuccess = false;
           })
     }
*/
/*
async    aggiornaLocalita()  {

    alert('------    aggiornaLocalita')
    console.log('------> aggiornaLocalità ' );
    console.warn('aggiornaLocalità - 1 ----> ' + this.editForm.value  );

    this.localita = this.editForm.value;
  //  this.prodotto.disponibile_Day = this.editFormData.disponibile_day.value;
  //  this.prodotto.prezzo_day = this.editFormData.prezzo_day.value;



    this.localita.key_utenti_operation = parseInt(localStorage.getItem('id'));
    this.tocalitaService.update(this.localita).subscribe(
    resp => {
      if (resp['rc'] === 'OK') {
          alert('aggiornamento correttamente seguito');
   // this.isLoading = true;
          this.type = 'success';
          this.Message = 'effettuato aggiornamento localita ';
          this.showNotification(this.type, this.Message);
       //   this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
          this.modal.dismiss('Cross click');
            }
        },
        error => {
          alert(' sono in aggiornaLocalita');
          this.isLoading = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore aggiornaLocalita' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
        });

  }
*/


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

    async   loadEvento(id: number) {
      console.log('loadEvento --   appena entrato ' + id);
      let rc = await this.eventoService.getbyId(id).subscribe(
          res => {
            console.log('letto evento: ' + JSON.stringify(res['data']));
              this.evento = res['data'];
              this.setForm();
           },
          error => {
             alert('loadEvento - errore: ' + error.message);
             console.log(error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
          });
    }


    async   loadlogPosto(id: number) {
      console.log('loadlogPosto --   appena entrato ' + id);
      let rc = await this.logpostoService.getbyId(id).subscribe(
          res => {
            console.log('letto logPosto: ' + JSON.stringify(res['data']));
              this.logposto = res['data'];

              // leggo evento e carico il formcontrol
               this.loadEvento(this.wprenotazevento.idevento);
           },
          error => {
             alert('oadlogPosto - errore: ' + error.message);
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
       this.submitted = true;
     //   this.isValidFormSubmitted = false;
       if (this.editForm.invalid) {
        alert('sono in submit ---- ci sono campi errati')
          return;
       }
     //  this.isValidFormSubmitted = true;

       alert('campi corretti.  ---- posso fare aggiornamento');
        return;


        if (this.editForm.invalid ) {
          alert('form invalido');
        }
        /*
        if (this.isLoading ) {
          alert('is this.isLoading');
        }
        if (this.editForm.invalid || this.isLoading) {
           return;
         } */

         /*
        console.log('controllare se già registrata località con stesso nome');

        this.localita = this.editForm.value;
        console.warn('onSubmit - 1 ----> ' + this.editForm.value );
        const campo1 =  this.editForm.controls['d_localita'].value;
        const campo2 =  this.editForm.get('cap').value;
        const campo3 =  this.editForm.get('pr').value;


        console.log(' submit - localita ' + JSON.stringify(this.localita));
        console.log(' submit - d_localita ' + campo1);
        console.log(' submit - cap ' + campo2);
        console.log(' submit - pr ' + campo3);
         alert('fin9iti controlli ---  ' + this.fase);

*/


// controllo se già inserita la localita

        let rc = await this.eventoService.getbyId(this.editForm.controls['d_localita'].value).subscribe(
          resp => {
                if(this.fase === 'I') {
                  if (resp['rc'] === 'ok') {
                    alert('località gia presente -- inserimento non possibile');
             // this.isLoading = true;
                    this.type = 'error';
                    this.Message = 'località gia presente -- inserimento non possibile ';
                    this.showNotification(this.type, this.Message);
                    return;
                      }
                  if (resp['rc'] === 'nf') {
                   // alert('pronto per inserimento');

                //    this.inserisciLocalita();
                    this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                    }

                }
                if(this.fase === 'M') {
                  if (resp['rc'] === 'nf') {
                    alert('località inesistente -- aggiornamento non possibile');
             // this.isLoading = true;
                    this.type = 'error';
                    this.Message = 'località inesistente -- aggiornamento non possibile ';
                    this.showNotification(this.type, this.Message);
                    return;
                      }
                  if (resp['rc'] === 'ok') {
                   // alert('pronto per modifica');
                //    this.aggiornaLocalita();
                    this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                     }
                   }
              },
              error => {
                alert(' sono in submit');
                this.isLoading = false;
                console.log(error);
                this.type = 'error';
                this.Message = 'Errore registrazione nuova ocalita' + '\n' + error.message;
                this.showNotification(this.type, this.Message);
                this.alertSuccess = false;
              });

    }


}







