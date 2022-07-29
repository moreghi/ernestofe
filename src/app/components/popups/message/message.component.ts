import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe Model
import { Message } from '../../../classes/Message';
// services
import { MessageService } from '../../../services/message.service';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public title = '';

  public message: Message;
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

  public selectedUser: Message;
  public editForm: FormGroup;

  public message01 = '';
  public message02 = '';

  public msgError = false;
  public msgInfo = false;
  public msgcorrect = false;

  public pathimage = '';

  constructor(private route: ActivatedRoute,
              public modal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private router: Router,
              private messageService: MessageService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {

    this.msgError = false;
    this.msgInfo = false;
    this.msgcorrect = false;

    console.log('info-prenotazione ----- onInit');
    console.log('dati passati da chiamante: ' + this.selectedUser.id );
    this.message = this.selectedUser;   // salvo la manifestazione ricevuta.
    this.getMessage(this.message.id);
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
        title: [this.selectedUser.title],
        message01: [this.selectedUser.message01],
        message02: [this.selectedUser.message02],
       });
    }


    async  getMessage(id: number) {
      let rc =  await  this.messageService.getbyId(id).subscribe(
        res => {
          if(res['rc'] === 'ok') {
            this.message = res['data'];
            this.title = this.message.title;
            this.message01 = this.message.message01;
            this.message02 = this.message.message02;
        //    this.pathimage = environment.APIURL + '/upload/files/images/' + this.message.image;
            if(this.message.tipo === 'I') {
              this.msgInfo = true;
            }
            if(this.message.tipo === 'E') {
              this.msgError = true;
            }
            if(this.message.tipo === 'C') {
              this.msgcorrect = true;
            }
          }
          if(res['rc'] === 'ns') {
            this.message = null;
            this.title = '??????????????';
          }
       },
       error => {
          alert('getMessage - errore: ' + error.message);
          console.log(error);
          this.type = 'error';
          this.Message = error.message;
          this.showNotification(this.type,this.Message);
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
