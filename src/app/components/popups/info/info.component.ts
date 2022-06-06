import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Msgpopup } from '../../../classes/Msgpopup';
import { MsgpopupService } from './../../../services/msgpopup.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  msgpopup: Msgpopup;

  public title = "Gestione Manifestazione";

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTrash = faTrash;

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

  public selectedUser: Msgpopup;
  public editForm: FormGroup;
  public isLoading = false;
  public fieldVisible = false;
  public title_OK = 'Registrazione Manifestazione';
  public title_KO = 'Registrazione in Errore';
  public messageTest1  = 'Operazione conclusa correttamente ';

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';

  modalRef2: BsModalRef;   // per aprire la seconda popup di conferma cancellazione


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

  public header  = '';
  public txt01xx = '';
  public txt02xx = '';
  public txt03xx = '';
	/**
	 * Notifier service
	 */
  // private notifier: NotifierService;


  constructor(public modal: NgbActiveModal,
              private msgpopupService: MsgpopupService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

  ngOnInit(): void {

    console.log('dati passati da chiamante: ' + this.selectedUser.id );
   // alert('popup - OnInit');

    switch (this.selectedUser.header) {
        case 'lavorazione':
          this.header = 'Annullamento Lavorazione Prodotto';
          break;
        case 'consegna':
          this.header = 'Annullamento Consegna Prodotto';
          break;
        default:
          this.header = '??????';
          break;
      }


    this.title = this.header;

    this.msgpopup = this.selectedUser;   // salvo la manifestazione ricevuta.
    this.setForm();
  }

  get editFormData() {
    return this.editForm.controls;
  }

  //  versione in cui gestisc solo la tabella
  private setForm() {
         // this.selectedUser = this.manifestazione;

          console.log(this.selectedUser);

          this.editForm = this.formBuilder.group({
            id: [this.selectedUser.id],
            txt01: [this.selectedUser.txt01, Validators.required],
            txt02: [this.selectedUser.txt02, Validators.required],
            txt03: [this.selectedUser.txt03, Validators.required]
           });

          this.txt01xx = this.selectedUser.txt01;
          this.txt02xx = this.selectedUser.txt02;
          this.txt03xx = this.selectedUser.txt03;


  }

  onSubmit() {
      //   alert(' sono in onSubmit');
         if (this.editForm.invalid ) {
          alert('form invalido');
        }
         if (this.isLoading ) {
          alert('is this.isLoading');
        }
         if (this.editForm.invalid || this.isLoading) {
           return;
         }
    //     alert(' sono in onSubmit - step_01');
         this.isLoading = true;

            this.confirmOperation();

   }


 async  confirmOperation() {

  this.modal.close('Yes');


   }



   confirmDelete() {

    alert(' chiedo conferma per cancellare');
   }





   openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });
  }



  closeModal(modalId?: number){
// il pulsante di conferma cancellazione è abbinato a modalId --> 1



 //   alert('idModal: ' + modalId);
    if(modalId === 2) {
//    alert('premuto Annulla')
  }

    if(modalId === 1) {
 //   alert('premuto Conferma - opero la cncellazione e chiudo le form')
    this.cancellaManif(this.msgpopup);

    this.modalService.hide();           // chiudo la prima popup          (conferma cancellazione)
    this.modal.dismiss('Cross click');  // chiudo anche la seconda popup  (richiesta cancellazione)
  }




  // alert('chiuso la seconda modal');
    this.modalService.hide(modalId);
  }



  cancellaManif(msgpopup: Msgpopup) {

    this.modal.close('Yes');
    /*
    this.manifestazioneService.deleteManifestazione(manif).subscribe(
      res => {
          if(res['rc'] === 'OK') {
            this.routeApp = 'manifestazioni';
            this.keys = '*';
            this.tipo = '*';
            this.Message = 'Cancellazione Manifestazione conclusa con successo';
            this.router.navigate(['ghost/' + this.routeApp + '/tipo/' + this.tipo + '/key/'  + this.keys + '/M/' + this.Message]);
          } else {
            this.type = 'error';
            this.Message  = 'Errore in cancellazione ' + res['message'];
            this.showNotification(this.type, this.message);
          }
       },
      error => {
         alert('Manifestazionepop  -- cancellaManif - errore: ' + error.message);
         console.log(error);
      });

      */
  }


/**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}


}
