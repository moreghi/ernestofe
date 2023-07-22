import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// service
import { TtipobigliettoService} from '../../../services/ttipobiglietto.service';
import { TtagliabigliettoService} from '../../../services/ttagliabiglietto.service';
// model
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Ttagliabiglietto} from '../../../classes/T_taglia_biglietto';

import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-tipobiglietto]',
  templateUrl: './tipobiglietto.component.html',
  styleUrls: ['./tipobiglietto.component.css']
})
export class TipobigliettoComponent implements OnInit {

    // variabili passate dal componente padre
    @Input('tipobiglietto-data') tipobiglietto: Ttipobiglietto;
    @Input('tipobiglietto-prog') i: number;

    @Output('onSelecttipologia') onSelecttipologia = new EventEmitter<number>();

    public tagliabiglietto: Ttagliabiglietto;



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

    public messagenull = 'Nessun record presente !!!';

    closeResult = '';

 // variabili per notifica esito operazione con Notifier
   public type = '';



    constructor(private tipobigliettoService: TtipobigliettoService,
                private tagliabigliettoService: TtagliabigliettoService,
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
   //  this.loadTagliabiglietto(this.tipobiglietto.idtipotaglia);   non serve

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

  navigate(pathNavigate: string, tipobiglietto: Ttipobiglietto) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${tipobiglietto.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['tbiglietto/edit/' + tipobiglietto.id]);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


   async loadTagliabiglietto(id: number) {

        let rc = await  this.tagliabigliettoService.getbyid(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
            this.tagliabiglietto = response['data'];
            }
         },
          error => {
              alert(' loadTagliabiglietto: ' + error.message);
              console.log(error);
              this.alertSuccess = false;
              this.Message = error.message;
              this.type = 'error';
              this.showNotification( this.type, this.Message);
          });
        }




open(content: any, tipobiglietto: Ttipobiglietto) {
  console.log(`open_content - user ${tipobiglietto.d_tipo}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + tipobiglietto.id + ' - ' + tipobiglietto.d_tipo );
   //this.cancellaProdotto(this.prodotto);
    this.delete(tipobiglietto.id);
    this.cancellazioneCompleted(tipobiglietto);
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

  cancellazioneCompleted(tipobiglietto: Ttipobiglietto) {
    this.type = 'success';
    this.Message = `cancellazione Evento ${tipobiglietto.d_tipo}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  delete(id:any) {
    console.log(id,'cancelllllllllllllllllllllllo --->');
    this.tipobigliettoService.delete(id).subscribe((res)=> {
      console.log(res,'res- delete -->');

      this.type = 'error';
      this.Message = res['message'];
      this.showNotification(this.type, this.Message);
    });
  }


  dettaglio(tipobiglietto: Ttipobiglietto) {
    this.onSelecttipologia.emit(tipobiglietto.idtipotaglia);
  }


  getColor(tipo: string) {
    switch (tipo) {
      case "INTERO":
        return 'blue';
      case "RIDOTTO":
        return 'yellow';
      case "GRATIS":
        return 'red';
      case "PREZZO UNICO":
        return 'orange';
      default:
        return 'violet';
    }
  }

  getBackground(tipo: string) {
    switch (tipo) {
      case "INTERO":
        return 'yellow';
      case "RIDOTTO":
        return 'green';
      case "GRATIS":
        return 'black';
      case "PREZZO UNICO":
        return 'blue';
      default:
        return 'green';
    }
  }



}

