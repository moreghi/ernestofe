import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { EventoService} from '../../../services/evento.service';
import { Evento} from '../../../classes/Evento';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow, faChair, faAddressBook, faUsers, faEuroSign} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-evento]',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {

    // variabili passate dal componente padre
    @Input('evento-data') evento: Evento;
    @Input('evento-prog') i: number;


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
    faEuroSign = faEuroSign;
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
    public navigateCassa = 'Cassa';

    public messagenull = 'Nessun record presente !!!';

    closeResult = '';


 // variabili per notifica esito operazione con Notifier
   public type = '';



    constructor(private eventoService: EventoService,
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

  navigate(pathNavigate: string, evento: Evento) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${evento.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['evento/edit/' + evento.id + '/' + evento.idmanif]);
        break;
      case 'Ticket':
        this.route.navigate(['evento/' + evento.id + '/tipobiglietti']);
        break;
      case 'Posti':
        this.route.navigate(['evento/' + evento.id + '/Posti']);
        break;
      case 'Prenotazioni':
        this.route.navigate(['Evento/prenotdetail/' + evento.id]);
        break;
      case 'Cassa':
        this.route.navigate(['cassa/' + evento.id]);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


open(content: any, evento: Evento) {
  console.log(`open_content - user ${evento.descrizione}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + evento.id + ' - ' + evento.descrizione );
   //this.cancellaProdotto(this.prodotto);
    this.delete(evento);
    // this.cancellazioneCompleted(evento);
   // per riaggiornare elenco
    window.location.reload();

  }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
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

  /*
  cancellazioneCompleted(evento: Evento) {
    this.type = 'success';
    this.Message = `cancellazione Evento ${evento.descrizione}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  } */

  delete(evento: Evento) {
   // console.log(id,'cancelllllllllllllllllllllllo --->');
    this.eventoService.delete(evento).subscribe(
      res => {
            this.type = 'success';
            this.Message = `cancellazione Evento ${evento.descrizione}  eseguita con successo `;
            this.showNotification(this.type, this.Message);
          },
          error => {
              alert('delete evento: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });
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
