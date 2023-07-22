import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { LogisticaService } from './../../../services/logistica.service';
// Model
import { Logistica } from '../../../classes/Logistica';
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
  selector: 'app-logisticapop',
  templateUrl: './logisticapop.component.html',
  styleUrls: ['./logisticapop.component.css']
})
export class LogisticapopComponent implements OnInit {

  public logistica: Logistica;

  public title = "Gestione Logistica";

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
   public selectedUser: Logistica;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public pathimage = '';


   constructor(public modal: NgbActiveModal,
               private logisticaService: LogisticaService,
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
                   this.logistica = this.selectedUser;   // salvo la località ricevuta.
                  // fino al 15/04/2023  --  vecchio percorso
                  // this.pathimage = environment.APIURL + '/upload/files/eventos/logistica/' + this.logistica.photo;

                   // dal 16/04/2023  --  nuovo percorso
                   this.pathimage = environment.APIURL + '/upload/files/logistica/' + this.logistica.photo;


                   console.log('Logisticapop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );


                   // alert('popup - OnInit');
                   if (this.selectedUser.id === 0) {
                      this.title = 'Inserimento Logistica';
                  //    alert('trovato record nuovo per inserimento');
                      this.fase = 'I';
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

                 /*
                  this.editForm = this.formBuilder.group({
                       id: [this.selectedUser.id],
                       localita: [this.selectedUser.localita, Validators.required],
                       luogo: [this.selectedUser.luogo, Validators.required]
                      });
*/

                  this.editForm = this.formBuilder.group({
                        id: [this.selectedUser.id],
                        localita: [this.selectedUser.localita, Validators.required],
                        luogo: [this.selectedUser.luogo, Validators.required],
                        photo: [this.selectedUser.photo, Validators.required]
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

      loadLogistica(id: number) {
         this.logisticaService.getbyId(id).subscribe(
          res => {
                this.logistica = res['data'];
             },
            error => {
               alert('loadLogistica - errore: ' + error.message);
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
            });
      }

      onSubmit() {
        this.modal.dismiss('Cross click');
      }


}

