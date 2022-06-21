import { Component, Input, OnInit } from '@angular/core';
// Services
import { QuotatesseraService } from '../../../services/quotatassera.service';

// Model
import { Quotatessera} from '../../../classes/Quotatessera';

// Varie
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie, faSimCard } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-quotatessera]',
  templateUrl: './quotatessera.component.html',
  styleUrls: ['./quotatessera.component.css']
})
export class QuotatesseraComponent implements OnInit {

  @Input('quotatessera-data') quota: Quotatessera;
  @Input('quotatessera-prog') i: number;

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
  faChartPie = faChartPie;
  faSimCard = faSimCard;

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

  public statoTesseramento = '';
  public utenteFedele = false;

   // variabili per gestione inqu/edit/new

  public href = '';

  public messagenull = 'Nessun record presente !!!';

  public dataOdierna;
  public anno  = 0;
  public tipo = '';
  closeResult = '';

// variabili per notifica esito operazione con Notifier
 public type = '';



  constructor(private quotatesseraService: QuotatesseraService,
              private modalService: NgbModal,
              private route: Router,
              private datePipe: DatePipe,
              private notifier: NotifierService) {
               this.notifier = notifier;
             }

  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Socio';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';

     const date = Date();
     this.dataOdierna = new Date(date);

     this.anno  = this.dataOdierna.getFullYear();
     if(this.quota.anno !== this.anno) {
        this.tipo = "P";
     }  else {
      this.tipo = "A";
     }

  }

  navigateQuota(quota: Quotatessera) {

    if(quota.anno !== this.anno ) {
       this.type = 'error';
       this.Message = 'periodo storicizzato - modifica non possibile';
       this.showNotification(this.type, this.Message);
       return;
    }

    this.route.navigate(['quotat/' + quota.id]);
   }


  open(content: any, quota: Quotatessera) {
   console.log(`open_content - user ${quota.anno}`);
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
   this.closeResult = `Closed with: ${result}`;
   // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
   if(result === 'Cancel click') {
   this.cancellazioneAbort();
   }
   if(result === 'Delete click') {
    if(quota.anno === this.anno ) {
      this.type = 'error';
      this.Message = 'Quota anno in corso non cancellabile';
      this.showNotification(this.type, this.Message);
      return;
   }
     console.log('fare routine di cancellazione: ' + quota.id + ' - ' + quota.anno );
    //this.cancellaProdotto(this.prodotto);
     this.delete(quota);
     this.cancellazioneCompleted(quota);
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

   cancellazioneCompleted(quota: Quotatessera) {
     this.type = 'success';
     this.Message = 'cancellazione della quota per anno: ' +  quota.anno + 'eseguita con successo';
     this.showNotification(this.type, this.Message);
   }

   delete(quota: Quotatessera) {
     console.log(quota.id,'cancelllllllllllllllllllllllo --->');
     this.quotatesseraService.delete(quota).subscribe((res: any)=> {
       console.log(res,'res- delete -->');

       this.type = 'error';
       this.Message = res['message'];
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



    getColor(tipo: string) {
      switch (tipo) {
        case 'A':
          return 'green';
        case 'P':
          return 'red';
      }
    }


}

