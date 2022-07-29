import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Service
import { BigliettoService} from '../../../services/biglietto.service';
// Model
import { Biglietto } from '../../../classes/Biglietto';
import { Cassamov } from '../../../classes/Cassamov';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-cassamov]',
  templateUrl: './cassamov.component.html',
  styleUrls: ['./cassamov.component.css']
})
export class CassamovComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('cassamov-data') cassamov: Cassamov;
   @Input('cassamov-prog') i: number;

   public biglietto: Biglietto

   faUserEdit = faUserEdit;
   faTrash = faTrash;
   faInfo = faInfo;
   faInfoCircle = faInfoCircle;
   faList = faList;
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faTicketAlt = faTicketAlt;
   faLocationArrow = faLocationArrow;

 // -----
   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public perDebug = 'utente passato: ';
   public Message = '';
   public presenti = false;
   public isVisible = false;
   public alertSuccess = false;
   public function = 0;
   public nRec = 0;

   public utenteFedele = false;

    // variabili per gestione inqu/edit/new

   public href = '';

   public navigateEdit = 'Edit';
   public navigateTicket = 'Ticket';
   public navigatePosti = 'Posti';

   public messagenull = 'Nessun record presente !!!';

   closeResult = '';


// variabili per notifica esito operazione con Notifier
  public type = '';



   constructor(private bigliettoService: BigliettoService,
               private modalService: NgbModal,
               private route: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                this.notifier = notifier;
              }



  ngOnInit(): void {
    this.loadBiglietto(this.cassamov.idbiglietto);
  }


async loadBiglietto(id: number) {
  let rc =  await this.bigliettoService.getbyId(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.biglietto = response['data'];
        }
    },
    error =>
    {
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
      this.isVisible = true;
      this.showNotification(this.type, this.Message);
    });
}

/*
     Show a notification

     @param {string} type Notification type
     @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  }


  getColor(stato: number) {
    switch (stato) {
      case 0:
        return 'red';
      case 1:
        return 'green';
    }
  }

  getBackground(stato: number) {
    switch (stato) {
      case 0:
        return 'black';
      case 1:
        return 'yellow';
    }
  }

}


