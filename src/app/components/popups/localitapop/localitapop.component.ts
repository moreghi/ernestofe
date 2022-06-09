import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { TlocalitaService } from './../../../services/tlocalita.service';
// Model
import { Tlocalita } from '../../../classes/T_localita';
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
  selector: 'app-localitapop',
  templateUrl: './localitapop.component.html',
  styleUrls: ['./localitapop.component.css']
})
export class LocalitapopComponent implements OnInit {

  public localita: Tlocalita;
  public localitas: Tlocalita[] = [];
  public localitaw: Tlocalita;



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
   public selectedUser: Tlocalita;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';



   constructor(public modal: NgbActiveModal,
               private tocalitaService: TlocalitaService,
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
    this.localita = this.selectedUser;   // salvo la località ricevuta.

    // alert('popup - OnInit');
    if (this.selectedUser.id === 0) {
       this.title = 'Inserimento Località';
   //    alert('trovato record nuovo per inserimento');
       this.fase = 'I';
      } else {
       this.title = 'Aggiornamento Località';
       this.fase = 'M';
     }

    this.saveValueStd = false;
    this.isLoading = false;
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

   this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
        d_localita: [this.selectedUser.d_localita, Validators.required],
        cap: [this.selectedUser.cap, Validators.required],
        pr: [this.selectedUser.pr, Validators.required]
       });



    }

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

  async  onSubmit() {

      /*
      this.editForm = this.formBuilder.group({
        tipologia: [this.selectedTipologiaValue],
        competenza: [this.selectedCompetenzaValue],
        categoria: [this.selectedCategoriaValue]
       });
  */


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

        let rc = await this.tocalitaService.getbylocalita(this.editForm.controls['d_localita'].value).subscribe(
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

                    this.inserisciLocalita();
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
                    this.aggiornaLocalita();
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


/*







  ngOnInit(): void {


  }



    onSubmit() {

      /*   diagnostico - funziona console.warn solo sui campi e non sul editForm.value
      this.prodottow = this.editForm.value;
      console.warn('onSubmit - 1 ----> ' + this.editForm.value );
      var campo1 =  this.editForm.controls['descrizione_prodotto'].value;
      var campo2 =  this.editForm.get('photo').value;
      var campo3 =  this.editForm.get('tipologia').value;
      var campo4 =  this.editForm.get('competenza').value;
      var campo5 =  this.editForm.get('categoria').value;

      var campo6 =  this.editForm.get('disponibile').value;
      var campo7 =  this.editForm.get('prezzo').value;



      console.warn('onSubmit - 1  descrizione ' + campo1 );
      console.warn('onSubmit - 2  photo ' + campo2 );
      console.warn('onSubmit - 3  tipologia ' + campo3 );
      console.warn('onSubmit - 4  competenza ' + campo4 );
      console.warn('onSubmit - 5  categoria ' + campo5 );
      console.warn('onSubmit - 6  disponibile ' + campo6 );
      console.warn('onSubmit - 7  prezzo ' + campo7 );








    console.warn(' prima di intervento di agg.to selezioni: ' + this.editForm.value);
    // aggiorno con le selezioni
    this.editForm = this.formBuilder.group({
      tipologia: [this.selectedTipologiaValue],
      competenza: [this.selectedCompetenzaValue],
      categoria: [this.selectedCategoriaValue]
     });
     console.warn(' ------- dopo agg.to selezioni: ' + this.editForm.value);

     var campo3 =  this.editForm.get('tipologia').value;
     var campo4 =  this.editForm.get('competenza').value;
     var campo5 =  this.editForm.get('categoria').value;
     console.warn('onSubmit - 3  dopo -- tipologia ' + campo3 );
     console.warn('onSubmit - 4  dopo -- competenza ' + campo4 );
     console.warn('onSubmit - 5  dopo -- categoria ' + campo5 );

    return;
    */




   //   alert('-----------------   fine onSubmit');



