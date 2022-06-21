import { Component, OnInit } from '@angular/core';
// service
import { QuotatesseraService } from '../../../services/quotatassera.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';
// classi
import { Quotatessera} from '../../../classes/Quotatessera';
import { Bandieragialla } from '../../../classes/BandieraGialla';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
// Varie
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-quotatessera-detail',
  templateUrl: './quotatessera-detail.component.html',
  styleUrls: ['./quotatessera-detail.component.css']
})
export class QuotatesseraDetailComponent implements OnInit {

    // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faInfoCircle = faInfoCircle;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;

  // variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';


 public bandieragialla: Bandieragialla;
 public quotatessera: Quotatessera;
 public quotatesseranull: Quotatessera;

 public title = '';
 public fase = '';
 public idBg = 1;
 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottafase = '';
 public idpassed = 0;
 public lenmaxtessera = 5;
 public idQuota = 0;
 public functionUrl = '';
 public functionUser = '';
 closeResult = '';

 public dataOdierna;
 public anno  = 0;

 constructor(private bandieragiallaService: BandieragiallaService,
             private quotatesseraService: QuotatesseraService,
             private route: ActivatedRoute,
             private router: Router,
             private modalService: NgbModal,
             private datePipe: DatePipe,
             private notifier: NotifierService) {
                   this.notifier = notifier;
                }



                ngOnInit(): void {
                  this.goApplication();
                }


                goApplication() {

                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.loadBandieragialla(this.idBg);
                  this.Message = 'pronto per aggiornamento ';

                  this.rotta = this.route.snapshot.url[0].path;

                  this.functionUrl = this.route.snapshot.url[1].path;

                  if(this.route.snapshot.url[1].path !== 'new') {
                    this.idQuota =  parseInt(this.route.snapshot.url[2].path);
                    this.title = 'Modifica Quota Annuale - quota tessera -detail';
                    this.loadQuota(this.idQuota);
                    this.functionUser = 'edit';
                   } else {
                    this.functionUser = 'new';
                    this.idQuota =  0;
                    this.quotatessera = new Quotatessera();
                    this.quotatessera.key_utenti_operation = +localStorage.getItem('id');
                    this.title = 'Inserimento Quota Annuale - quota tessera-detail';
                    this.fase = 'N';
                    this.Message = `Inserire i dati della Quota annuale`;
                  }
             }

                   async loadBandieragialla(id: number) {
                    console.log('frontend - loadBandieragialla: ' + id);
                    let rc = await  this.bandieragiallaService.getbyId(id).subscribe(
                    response => {
                      if(response['rc'] === 'ok') {
                        console.log('bg da editare  ' + JSON.stringify(response['data']));
                        this.bandieragialla = response['data'];
                      }
                      if(response['rc'] === 'nf') {
                        this.Message = response['message'];
                        this.type = 'error';
                        this.showNotification( this.type, this.Message);
                        return;
                      }
                    },
                      error => {
                          alert('loadBandieragialla: ' + error.message);
                          console.log(error);
                          this.alertSuccess = false;
                          this.Message = error.message;
                          this.type = 'error';
                          this.showNotification( this.type, this.Message);
                          });
                    }


          async  loadQuota(id: number) {
            console.log(`loadQuota - appena entrato`);
            let rc = await this.quotatesseraService.getbyId(id).subscribe(
                       resp => {

                       if(resp['rc'] === 'ok') {
                          console.log(`loadQuota: ${resp['data']}`);
                          this.quotatessera = resp['data'];
                          this.quotatessera.key_utenti_operation = +localStorage.getItem('id');
                          this.type = 'success';
                          this.Message = 'situazione attuale';
                          this.alertSuccess = true;
                        }
                       if(resp['rc'] === 'nf') {
                          this.quotatessera = this.quotatesseranull;
                          this.type = 'error';
                          this.Message = 'Quota inesistente';
                          this.alertSuccess = false;
                        }
                       this.showNotification(this.type, this.Message);
                      },
                       error => {
                            alert('sono in loadPersona');
                            this.isVisible = true;
                            this.alertSuccess = false;
                            console.log('loadPersona - errore: ' + error);
                            this.type = 'error';
                            this.Message = error.message;
                            this.alertSuccess = false;
                            this.showNotification(this.type, this.Message);
                          });
                     }


//
// Show a notification
//
// @param {string} type    Notification type
// @param {string} message Notification message
//

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  //   alert('sono in notifier' + message);
  }




  goback() {
    this.router.navigate(['/socio']);
    }

    quote() {
      this.router.navigate(['/quotat']);
    }

    async conferma() {
     console.log('conferma - appena entrato ');

     const date = Date();
     this.dataOdierna = new Date(date);

     this.anno  = this.dataOdierna.getFullYear();
     if(this.quotatessera.anno < this.anno) {
      this.type = 'error';
      this.Message = 'non è possibile aggiornare quote storicizzate';
      this.alertSuccess = false;
      this.showNotification( this.type, this.Message);
      return;
     }
     if(this.functionUser === 'edit') {
       console.log(`pronto per fare modifica : ${JSON.stringify(this.quotatessera)}`);
       this.quotatessera.key_utenti_operation = +localStorage.getItem('id');
       let rc1 = await this.quotatesseraService.update(this.quotatessera).subscribe(
             res => {
                  this.type = 'success';
                  this.Message = res['message'];
                  this.alertSuccess = true;
                  this.showNotification( this.type, this.Message);
               },
             error => {
                  console.log(error);
                  this.type = 'error';
                  this.Message = error.message;
                  this.alertSuccess = false;
                  this.showNotification( this.type, this.Message);
               });
           }
     if(this.functionUser === 'new') {
            console.log(`pronto per fare inserimento : ${JSON.stringify(this.quotatessera)}`);
            this.quotatessera.key_utenti_operation = +localStorage.getItem('id');
            let rc1 = await this.quotatesseraService.create(this.quotatessera).subscribe(
                  res => {
                       this.type = 'success';
                       this.Message = res['message'];
                       this.alertSuccess = true;
                       this.showNotification( this.type, this.Message);
                    },
                  error => {
                       console.log(error);
                       this.type = 'error';
                       this.Message = error.message;
                       this.alertSuccess = false;
                       this.showNotification( this.type, this.Message);
                    });
                }
     }




         open(content) {
          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
            if(result ===  'Cancel click') {
               this.cancellazioneAbort();
            }
            if(result ===  'Delete click') {
              // gestire uscita da popup
              this.cancellaUser(this.quotatessera);
            }
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
         //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
            this.cancellazioneAbort();
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


        cancellazioneAbort() {
          this.type = 'warning';
          this.Message = 'cancellazione abbandonata dall utente';
          this.showNotification(this.type, this.Message);
        }

        cancellaUser(quotatessera: Quotatessera) {

          this.quotatesseraService.delete(quotatessera).subscribe(
              response => {
                if(response['ok']) {
                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.type = 'success';
                  this.Message = 'quota cancellata correttamente';
                  this.showNotification(this.type, this.Message);
                }
            },
            error =>
                {
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore cancellazione User' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
                });
        }

}

