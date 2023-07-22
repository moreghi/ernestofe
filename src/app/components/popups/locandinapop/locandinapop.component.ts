import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { LocandinaService } from './../../../services/locandina.service';
import { ManifestazioneService} from '../../../services/manifestazione.service';
import { EventoService} from '../../../services/evento.service';
import { UploadFilesService } from './../../../services/upload-files.service';
// Model
import { Locandina } from '../../../classes/locandina';
import { Evento } from '../../../classes/Evento';
import { Manifestazione} from '../../../classes/Manifestazione';
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
  selector: 'app-locandinapop',
  templateUrl: './locandinapop.component.html',
  styleUrls: ['./locandinapop.component.css']
})
export class LocandinapopComponent implements OnInit {

 // per upload image
 selectedFiles?: FileList;
 currentFile?: File;
 progress = 0;
 messageimage = '';
 fileInfos?: Observable<any>;
 messageupload = '';
 public folderImage = '';   // salvo la cartella in cui salvare immagine
// per upload image -- fine



  public locandina: Locandina;
  public manif: Manifestazione;
  public evento: Evento;

  public file: File = null;

  public title = "Gestione Locandine";

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
   public selectedUser: Locandina;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public pathimage = '';


   constructor(public modal: NgbActiveModal,
               private locandinaService: LocandinaService,
               private manifetsazioneService: ManifestazioneService,
               private eventoService: EventoService,
               private uploadService: UploadFilesService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                }


                ngOnInit(): void {

                  // alert('sono in oninit - title: ' + this.title);
                   console.log('Locandinapop -----------------------------     dati passati da chiamante: ' + this.selectedUser.id );
                 //  alert('sono in oninit - title ...................................................... : ' + this.title);
                   this.locandina = this.selectedUser;   // salvo la località ricevuta.
                 //  this.pathimage = environment.APIURL + '/upload/files/eventos/locandina/' + this.locandina.photo;   originaria
                   this.pathimage = environment.APIURL + '/upload/files/eventos_locandina/' + this.locandina.photo;



                   console.log('Locandinapop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );


                   // alert('popup - OnInit');
                   if (this.selectedUser.id === 0) {
                      this.title = 'Inserimento Locandina';
                  //    alert('trovato record nuovo per inserimento');
                      this.fase = 'I';
                     } else {
                      this.title = 'Aggiornamento Locandina';
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
                 // le tabelle collegate
                  if(this.selectedUser.idManif > 0) {
                    this.loadManifestazione(this.selectedUser.idManif);
                  } else {
                    this.manif = new Manifestazione();
                    this.loadevento(this.selectedUser.idEvento);
                  }


                 /*
                  this.editForm = this.formBuilder.group({
                       id: [this.selectedUser.id],
                       localita: [this.selectedUser.localita, Validators.required],
                       luogo: [this.selectedUser.luogo, Validators.required]
                      });
*/

/*    di solito è qui come modello  -- spostato sotto loadevento

                  this.editForm = this.formBuilder.group({
                        id: [this.selectedUser.id],
                        idManif: [this.selectedUser.idManif, Validators.required],
                        idEvento: [this.selectedUser.idEvento, Validators.required],
                        photo: [this.selectedUser.photo, Validators.required]
                       });

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

      loadManifestazione(id: number) {
         this.manifetsazioneService.getbyId(id).subscribe(
          res => {
                this.manif = res['data'];
                this.loadevento(this.selectedUser.idEvento);
             },
            error => {
               alert('loadLocandina - errore: ' + error.message);
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
            });
      }

      loadevento(id: number) {
        this.eventoService.getbyId(id).subscribe(
         res => {
               this.evento = res['data'];
               this.editForm = this.formBuilder.group({
                id: [this.selectedUser.id],
                idManif: [this.selectedUser.idManif, Validators.required],
                dManifestazione: [this.manif.descManif],
                idEvento: [this.selectedUser.idEvento, Validators.required],
                dEvento: [this.evento.descrizione],
                photo: [this.selectedUser.photo, Validators.required]
               });
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

        if (this.file) {

          // prima salvo locandina e aggiorno evento e poi faccio download
          switch (this.fase)  {
            case 'I':
              console.log('sono dentro switch -I')
              this.creaLocandina();
              break;
            case 'M':
              console.log('sono dentro switch ---------M')
              this.selectedUser.photo = this.file.name;   // salvo su record il nome del file selezionato
              this.aggiornaLocandina(this.selectedUser);
              break;
            default:
              alert('locandinapop - funzione non ancora attivata');
              break;
            }

            this.type = 'error';
            this.alertSuccess = true;
            this.isVisible = true;
            this.Message = 'locandina inserita regolarmente';

          console.log('.. frontend - upload .........  metodo 2 ................................... upload - file pronto per upload in backend: ' + JSON.stringify(this.file));
          console.log('.. frontend - upload .........  fase: ' + this.fase);

          this.folderImage = 'eventos_locandina';    // imposto la cartella in cui passare   // eventos_locandina
          this.currentFile = this.file;

          this.uploadService.uploadfile(this.currentFile, this.folderImage).subscribe(
            resp => {
              this.modal.close('Click YES')
              },
            error => {
              console.log(error);
              this.progress = 0;

              this.type = 'error';
              this.alertSuccess = false;
              this.isVisible = true;
              if (error.error && error.error.message) {
                  this.Message = error.error.message;
              } else {
                this.Message = 'Could not upload the file!';
              }
              this.showNotification(this.type, this.Message);
              this.currentFile = undefined;
            });
        } else {
          this.type = 'error';
          this.alertSuccess = false;
          this.isVisible = true;
          this.Message = 'Seleziona il file !!';
        }








        /*    modalità originaria. ------- ripeteva 5 ovlte ---- da cancellare

        if (this.file) {
          console.log('.. frontend - upload .........  metodo 2 ................................... upload - file pronto per upload in backend: ' + JSON.stringify(this.file));
          console.log('.. frontend - upload .........  fase: ' + this.fase);

          this.folderImage = 'eventos';    // imposto la cartella in cui passare   // eventos_locandina
          this.currentFile = this.file;

          this.uploadService.uploadfile(this.currentFile, this.folderImage).subscribe(
            resp => {
                  switch (this.fase)  {
                    case 'I':
                      console.log('sono dentro switch -I')
                      this.creaLocandina();
                      break;
                    case 'M':
                      console.log('sono dentro switch ---------M')
                      this.selectedUser.photo = this.file.name;   // salvo su record il nome del file selezionato
                      this.aggiornaLocandina(this.selectedUser);
                      break;
                    default:
                      alert('locandinapop - funzione non ancora attivata');
                      break;
                    }
              },
            error => {
              console.log(error);
              this.progress = 0;

              this.type = 'error';
              this.alertSuccess = false;
              this.isVisible = true;
              if (error.error && error.error.message) {
                  this.Message = error.error.message;
              } else {
                this.Message = 'Could not upload the file!';
              }
              this.showNotification(this.type, this.Message);
              this.currentFile = undefined;
            });
        } else {
          this.type = 'error';
          this.alertSuccess = false;
          this.isVisible = true;
          this.Message = 'Seleziona il file !!';
        }

*/






      }




// --------------   metodi per upload   ----- versione presa da test-upload

onFilechange(event: any) {
  console.log(event.target.files[0])
  this.file = event.target.files[0];

  this.type = 'success';
  this.Message = 'premi conferma per effettuare upload locandina';
  this.alertSuccess = true;
  this.isVisible = true;
  this.showNotification(this.type, this.Message);

}

aggiornaLocandina(locandina: Locandina) {
  localStorage.setItem('locandina', locandina.photo);
  this.locandinaService.update(locandina).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.type = 'success';
              this.Message = 'file Uploaded regolarmente - Aggiornata locandina';
              this.alertSuccess = true;
          }
     },
      error => {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
      });
}



creaLocandina() {
  console.log('creaLocandina -- appena entrato');
  this.locandina = new Locandina();
  this.locandina.idEvento = this.selectedUser.idEvento;
  this.locandina.idManif = this.selectedUser.idManif;
  this.locandina.photo = this.file.name;   // salvo su record il nome del file selezionato
  this.locandina.key_utenti_operation = this.selectedUser.key_utenti_operation;

  localStorage.setItem('locandina', this.file.name);

  this.locandinaService.create(this.locandina).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                this.loadlastLocandina();
               }
          },
          error =>
          {
            console.log(error);
            this.Message = error.message;
            this.alertSuccess = false;
          }
      );
}

loadlastLocandina() {
  console.log('loadlastLocandina -- appena entrato');
  this.locandinaService.getlast().subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.locandina = response['data'];
          this.evento.locandina = this.locandina.id;
          this.aggiornaEvento(this.evento);
         }
    },
    error =>
    {
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
    });
}


aggiornaEvento(evento: Evento) {
  console.log('aggiornaEvento -- appena entrato');
  this.eventoService.update(evento).subscribe(
    res => {
      if(res['rc'] === 'ok') {
        this.type = 'success';
        this.Message = 'file Uploaded regolarmente - creata locandina';
        this.alertSuccess = true;
        this.isVisible = true;
        this.showNotification(this.type, this.Message);
        console.log('aggiornaEvento ------ finito');
        }
      },
      error => {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
      });
 }









/*     metodo spostato in onsubmit

upload() {
  if (this.file) {
    console.log('.. frontend - upload .........  metodo 2 ................................... upload - file pronto per upload in backend: ' + JSON.stringify(this.file));
    this.locandina.photo = this.file.name;   // salvo su record il nome del file selezionato
    this.folderImage = 'eventos_locandina';    // imposto la cartella in cui passare
    this.currentFile = this.file;

    this.uploadService.uploadfile(this.currentFile, this.folderImage).subscribe(
      resp => {
            alert("file Uploaded regolarmente");
          },
      error => {
      console.log(error);
      this.progress = 0;

      if (error.error && error.error.message) {
        this.messageimage = error.error.message;
      } else {
        this.messageimage = 'Could not upload the file!';
      }

      this.currentFile = undefined;
    });
  } else {
    alert("Please select a file first")
  }
}
*/





// --------------   metodi per upload  --  versione originaria  ---   ha dei problemi
/*
selectFile(event) {
  console.log('file selected: ' + JSON.stringify(event.target.files[0]));
  this.file = event.target.files[0]
  console.log('file ......: ' + JSON.stringify(this.file));


  //this.selectedFiles = event.target.files;
  //console.log('selectfile ....  event - nome file: ' + JSON.stringify(event.target.files));
}

upload(): void {
  this.progress = 0;

  if (this.selectedFiles) {
    const file: File | null = this.selectedFiles.item(0);
    console.log('.. frontend - upload ............................................ upload - file pronto per upload in backend: ' + file.name);
    console.log('.. frontend - upload ........                this.selectedFiles.item(0) .... upload - file selected : ' +  JSON.stringify(this.selectedFiles.item(0)));

    if (file) {
      this.locandina.photo = file.name;   // salvo su record il nome del file selezionato
      this.folderImage = 'eventos_locandina';    // imposto la cartella in cui passare
      this.currentFile = file;

      this.uploadService.upload(this.currentFile, this.folderImage).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            console.log('frontend - upload -----   uscita 1');
          } else if (event instanceof HttpResponse) {
            this.messageimage = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
            console.log('frontend - upload -----   uscita 2');
          }
          console.log(' rc ......................... ' + event.body.rc);
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.messageimage = err.error.message;
          } else {
            this.messageimage = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        });

        console.log(' finito uploaddddddddddddddddddddddddddd');
    }

    this.selectedFiles = undefined;
  }
}


*/








}
