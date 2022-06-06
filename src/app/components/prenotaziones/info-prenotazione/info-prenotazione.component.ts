
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe Model
import { Prenotazione } from '../../../classes/Prenotazione';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-info-prenotazione',
  templateUrl: './info-prenotazione.component.html',
  styleUrls: ['./info-prenotazione.component.css']
})
export class InfoPrenotazioneComponent implements OnInit {

  public title = "Registrazione Prenotazione";

  public prenotazione: Prenotazione;
  closeResult = '';
// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTimes = faTimes;
  faTrash = faTrash;

  public type = '';
  public Message = '';

  public selectedUser: Prenotazione;
  public editForm: FormGroup;

  constructor(private route: ActivatedRoute,
              public modal: NgbActiveModal,
              public ngbModal: NgbModal,
           //   private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private router: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {
    console.log('info-prenotazione ----- onInit');
    console.log('dati passati da chiamante: ' + this.selectedUser.id );
    this.prenotazione = this.selectedUser;   // salvo la manifestazione ricevuta.

    this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
   this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id],
       });
    }

    onSubmit() {

      this.editForm = this.formBuilder.group({
        id: [this.selectedUser.id]
       });

      alert('sono a inizio onSubmit');
      if (this.editForm.invalid ) {
          alert('form invalido');
        }
// non faccio niente se non chiudere
      this.modal.dismiss('Cross click');

    }

    aprimailpopup() {
      alert('da fare')
    }



// menu per cancellazione
open(content) {
  this.ngbModal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
    if(result ===  'Cancel click') {
       this.operazioneAbort();
    }
    if(result ===  'Delete click') {
      // gestire uscita da popup
      // non faccio nulla
    }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
 //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
    this.operazioneAbort();
  });

}


private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}


operazioneAbort() {
  this.type = 'warning';
  this.Message = 'operazione abbandonata dall utente';
  this.showNotification(this.type, this.Message);
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

  this.modal.close(modalId);

/*
  if(modalId === 2) {
    alert('premuto Annulla su modalDelete')
  }
  if(modalId === 1) {
    alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
    this.modal.close(1);
  }
  alert('chiuso la seconda modal');
  this.modal.close(modalId);
  }
*/
}

}
