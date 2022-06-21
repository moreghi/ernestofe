import { Component, OnInit } from '@angular/core';
// Service
import { BandieragiallaService } from './../../../services/bandieragialla.service';
// Model
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
  selector: 'app-bandieragialla-detail',
  templateUrl: './bandieragialla-detail.component.html',
  styleUrls: ['./bandieragialla-detail.component.css']
})
export class BandieragiallaDetailComponent implements OnInit {

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

 public title = '';
 public fase = '';
 public idBg = 1;
 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottafase = '';
 public idpassed = 0;
 public lenmaxtessera = 5;

 constructor(private bandieragiallaService: BandieragiallaService,
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


     console.log(`pronto per fare modifica : ${JSON.stringify(this.bandieragialla)}`);
     this.bandieragialla.key_utenti_operation = +localStorage.getItem('id');
     let rc1 = await this.bandieragiallaService.update(this.bandieragialla).subscribe(
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

