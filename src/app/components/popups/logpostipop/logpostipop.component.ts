// https://www.ngdevelop.tech/angular/tutorial/form-validators/

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { LogsettfilapostoService } from './../../../services/logsettfilaposto.service';
import { LogsettoreService } from './../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';

// Model
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';

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
  selector: 'app-logpostipop',
  templateUrl: './logpostipop.component.html',
  styleUrls: ['./logpostipop.component.css']
})
export class LogpostipopComponent implements OnInit {

  public logsettore: LogSettore;
  public logsettorenull: LogSettore;
  public logFila: LogFila;
  public logFilanull: LogFila;
  public logSettFilaPosto: LogSettFilaPosti;

  public title = "Gestione Posti in Settore/Fila";

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
   public selectedUser: LogSettFilaPosti;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public d = '';

   public postoStart = 0;
   public postoEnd = 0;
   public postiPattern = '[0-9]{1,3}';


   constructor(public modal: NgbActiveModal,
               private logfilaService: LogfilaService,
               private logsettoreService: LogsettoreService,
               private logsettfilapostoService: LogsettfilapostoService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                }



  ngOnInit(): void {

          console.log('Logpostipop -----------------------------     dati passati da chiamante: ' + this.selectedUser.id );

          this.logSettFilaPosto = this.selectedUser;   // salvo la località ricevuta.

          console.log('Logisticapop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );
          this.loadSettore(this.logSettFilaPosto.idSettore);

          this.saveValueStd = false;
          this.isLoading = false;
             //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
         // this.setForm();   spostata in loadFila

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

     console.log(this.selectedUser);
  // carico le combo
  // this.loadLogistica(this.selectedUser.id);   non serve


     this.editForm = this.formBuilder.group({
          id: [this.selectedUser.id],
          stato: [this.selectedUser.stato],
          idSettore: [this.selectedUser.idSettore],
          dsettore: [this.logsettore.dsettore],
          idFila: [this.selectedUser.idFila],
          dfila: [this.logFila.dfila],
          postoStart: [this.selectedUser.postoStart, Validators.required],
          postoEnd: [this.selectedUser.postoEnd, Validators.required]

   });



/*
     this.editForm = this.formBuilder.group({
         id: [this.selectedUser.id],
         idSettore: [this.selectedUser.idSettore],
         dsettore: [this.logsettore.dsettore],
         idFila: [this.selectedUser.idFila],
         dfila: [this.logFila.dfila],
         postoStart: [this.selectedUser.postoStart, Validators.required, Validators.min(1), Validators.max(4), Validators.pattern('[0-9]{1,3}')],
         postoEnd: [this.selectedUser.postoEnd, Validators.required, Validators.min(1), Validators.max(4), Validators.pattern('[0-9]{1,3}')]
        });
*/

 }

         async loadSettore(id: number) {
            console.log('frontend - loadSettore: ' + id);
            let rc = await  this.logsettoreService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('loadSettore da editare  ' + JSON.stringify(response['data']));
                this.logsettore = response['data'];
                this.loadFila(this.logSettFilaPosto.idFila);
              }
              if(response['rc'] === 'nf') {
                console.log('loadSettore: --  nf ' + id);
                this.logsettore = this.logsettorenull;
                this.Message = response['message'];
                this.type = 'error';
                this.showNotification( this.type, this.Message);
              }
            },
              error => {
                  alert('Socio-Detail  --loadSettore: ' + error.message);
                  console.log(error);
                  this.alertSuccess = false;
                  this.Message = error.message;
                  this.type = 'error';
                  this.showNotification( this.type, this.Message);
              });
            }

            async loadFila(id: number) {
              console.log('frontend - loadFila: ' + id);
              let rc = await  this.logfilaService.getbyId(id).subscribe(
              response => {
                if(response['rc'] === 'ok') {
                  console.log('loadFila da editare  ' + JSON.stringify(response['data']));
                  this.logFila = response['data'];
                  this.setForm();    // spostata dalla posizione originaria del modello
                }
                if(response['rc'] === 'nf') {
                  console.log('loadFila: --  nf ' + id);
                  this.logFila = this.logFilanull;
                  this.Message = response['message'];
                  this.type = 'error';
                  this.showNotification( this.type, this.Message);
                }
              },
                error => {
                    alert('Socio-Detail  --loadSettore: ' + error.message);
                    console.log(error);
                    this.alertSuccess = false;
                    this.Message = error.message;
                    this.type = 'error';
                    this.showNotification( this.type, this.Message);
                });
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



  this.postoStart = + this.editForm.value.postoStart;
  this.postoEnd = + this.editForm.value.postoEnd;


  if(this.postoEnd < this.postoStart) {
      alert('il posto finale deve essere maggiore del posto iniziale !!');
      return;
  }

  this.modificaPosti(this.selectedUser.id);
  this.modal.close('Yes');    //
}


modificaPosti(id: number) {


  //    alert('Inserisci Localita');
      this.logSettFilaPosto = this.editForm.value;
      this.logSettFilaPosto.idLogistica = this.selectedUser.idLogistica;
      this.logSettFilaPosto.key_utenti_operation = +localStorage.getItem('id');
    // recuperare l'ultimo id inserito
      this.logsettfilapostoService.update(this.logSettFilaPosto).subscribe(
        resp => {
          if (resp['rc'] === 'Ok') {
                //  this.loadLocalita();
                  alert('aggiornamento correttamente seguito');
                  this.type = 'success';
                  this.Message = 'aggiornamento eseguito con successo ';
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



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
  }



  }




