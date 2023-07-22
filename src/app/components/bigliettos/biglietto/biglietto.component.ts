
import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { TtipopagamentoService } from './../../../services/ttipopagamento.service';
import { Biglietto} from '../../../classes/Biglietto';
import { Ttipopagamento } from '../../../classes/T_tipo_pagamento';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow, faChair, faAddressBook, faUsers} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-biglietto]',
  templateUrl: './biglietto.component.html',
  styleUrls: ['./biglietto.component.css']
})
export class BigliettoComponent implements OnInit {

    // variabili passate dal componente padre
    @Input('biglietto-data') biglietto: Biglietto;
    @Input('biglietto-prog') i: number;

    public pagamento: Ttipopagamento;


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
    faChair = faChair;
    faAddressBook = faAddressBook;
    faUsers = faUsers;

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
    // da cancellare
    /*
    public functionInqu = false;
    public functionEdit = false;
    public functionNew = false;
    public functionElenco = false;

    public searchInqu = 'show';
    public searchEdit = 'edit';
    public searchNew = 'new';
    public searchElenco = 'read';

    // funzioni di navigazione
    public navigateInqu = 'Inqu';

    public navigateEdits = 'Edits';
    public navigateNew = 'New';
    public navigateDays = 'Days';
    public navigateGraficoDays = 'GraphDays';
 */

    public navigateEdit = 'Edit';
    public navigateTicket = 'Ticket';
    public navigatePosti = 'Posti';
    public navigatePrenotazioni = 'Prenotazioni';

    public messagenull = 'Nessun record presente !!!';

    closeResult = '';


 // variabili per notifica esito operazione con Notifier
   public type = '';



    constructor(private tipopagamentoService: TtipopagamentoService,
                private modalService: NgbModal,
                private route: Router,
                private datePipe: DatePipe,
                private notifier: NotifierService) {
                 this.notifier = notifier;
               }


  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Manifestazione';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';

     this.tipoPagamento(this.biglietto.modpag);


  }

  async tipoPagamento(modpag: number) {
      let rc1 = await this.tipopagamentoService.getbyid(modpag).subscribe(
          res => {
            if(res['rc'] === 'ok') {
              this.pagamento = res['data'];
            }
            if(res['rc'] === 'nf') {
              this.pagamento = new Ttipopagamento();
              this.pagamento.d_tipo_pagamento = 'Inesistente';
            }




            },
          error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification( this.type, this.Message);
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

  getColor(modpag: number) {
    switch (modpag) {
      case 0:
        return 'red';
      case 1:
        return 'green';
      case 2:
        return 'blue';
      case 6:
        return 'orange';
      case 7:
        return 'violet';
    }
  }

  getBackground(modpag: number) {
    switch (modpag) {
      case 0:
        return 'black';
      case 1:
        return 'yellow';
      case 2:
        return 'yellow';
      case 6:
        return 'violet';
      case 7:
        return 'orange';
    }
  }





}
