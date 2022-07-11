import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { ElementoService } from './../../../services/elemento.service';
import { LogsettoreService } from './../../../services/logsettore.service';
// Model
import { Elemento } from '../../../classes/Elemento';
import { LogSettore } from '../../../classes/Logsettore';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply, faMinus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
// varie
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-elempop',
  templateUrl: './elempop.component.html',
  styleUrls: ['./elempop.component.css']
})
export class ElempopComponent implements OnInit {

  public elemento: Elemento;
  public logsettore: LogSettore;

  public title = "Gestione Elementi Logistica";

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
   public selectedUser: Elemento;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public d = '';
   public dsettore = '';
   public delemento = '';

   constructor(public modal: NgbActiveModal,
               private elementoService: ElementoService,
               private logsettoreService: LogsettoreService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                }


                ngOnInit(): void {

                  // alert('sono in oninit - title: ' + this.title);
                   console.log('Logisticapop -----------------------------     dati passati da chiamante: ' + this.selectedUser.id );
                 //  alert('sono in oninit - title ...................................................... : ' + this.title);
                   this.elemento = this.selectedUser;   // salvo la località ricevuta.

                   if(this.elemento.idsettore !== 0) {
                   //   this.loadElemSettore(this.elemento.idsettore);
                      this.delemento = 'Fila';
                   } else {
                    this.delemento = 'Settore';
                   }


                   console.log('Logisticapop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );


                   // alert('popup - OnInit');
                   if (this.selectedUser.id === 0) {
                      this.fase = 'I';
                      if(this.selectedUser.idsettore === 0) {
                        this.title = 'Inserimento Settore Logistica';
                        } else {
                          this.title = 'Inserimento Fila del Settore';
                        }
                  //    alert('trovato record nuovo per inserimento');

                     } else {
                      this.title = 'Aggiornamento Logistica';
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
                 // this.loadLogistica(this.selectedUser.id);   non serve


                  if(this.elemento.idsettore === 0) {
                    this.editForm = this.formBuilder.group({
                        id: [this.selectedUser.id],
                        idsettore: [this.selectedUser.idsettore, Validators.required],
                        delemento: [this.selectedUser.delemento, Validators.required]
                       });
                 }  else {
                  this.editForm = this.formBuilder.group({
                    id: [this.selectedUser.id],
                    idsettore: [this.selectedUser.idsettore, Validators.required],
                    dsettore: [this.selectedUser.dsettore],
                    delemento: [this.selectedUser.delemento, Validators.required]
                   });
                 }

                }



                async loadElemSettore(id: number) {
                  console.log('frontend - loadSocio: ' + id);
                  let rc = await  this.logsettoreService.getbyId(id).subscribe(
                  response => {
                    if(response['rc'] === 'ok') {
                      this.logsettore = response['data'];
                      this.dsettore = this.logsettore.dsettore;
                      console.log('loadElemSettore - dsettore: ' + this.dsettore);
                    }
                    if(response['rc'] === 'nf') {
                      this.dsettore = '???????????';
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



  onSubmit() {

    if (this.editForm.invalid ) {
      alert('form invalido');
    }
    this.inserisciElemento();
    this.modal.close('Yes');    //
  }


  inserisciElemento() {
    //    alert('Inserisci Localita');
        this.elemento = this.editForm.value;
        this.elemento.key_utenti_operation = parseInt(localStorage.getItem('id'));
      // recuperare l'ultimo id inserito
        this.elementoService.create(this.elemento).subscribe(
          resp => {
            if (resp['rc'] === 'Ok') {
                  //  this.loadLocalita();
                    alert('inserimento correttamente seguito');
                    this.type = 'success';
                    this.Message = 'effettuato inserimento elemento ';
                    this.showNotification(this.type, this.Message);
                  //   this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                    this.modal.dismiss('Cross click');
                 }
             },
             error => {
               alert(' sono in inserisciElemento');
               this.isLoading = false;
               console.log(error);
               this.type = 'error';
               this.Message = 'Errore inserisci Elemento' + '\n' + error.message;
               this.showNotification(this.type, this.Message);
               this.alertSuccess = false;
             });
       }







}

