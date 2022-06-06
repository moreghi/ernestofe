import { Component, Input, OnInit } from '@angular/core';
import { TesseramentoService} from '../../../services/tesseramento.service';
import { Tesseramento} from '../../../classes/Tesseramento';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie, faSimCard } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'tr[app-tesseramento]',
  templateUrl: './tesseramento.component.html',
  styleUrls: ['./tesseramento.component.css']
})
export class TesseramentoComponent implements OnInit {

  @Input('tesseramento-data') tesseramento: Tesseramento;
  @Input('tesseramento-prog') i: number;


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

  public utenteFedele = false;

   // variabili per gestione inqu/edit/new

  public href = '';

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
  public navigateEdit = 'Edit';
  public navigateEdits = 'Edits';
  public navigateNew = 'New';
  public navigateDays = 'Days';
*/

  public messagenull = 'Nessun record presente !!!';

  closeResult = '';

// variabili per notifica esito operazione con Notifier
 public type = '';
 public dataOdierna: Date;
 public yyyy;






  constructor(private tesseramentoService: TesseramentoService,
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

             // this.loadsocioestazioni();

              this.dataOdierna = new Date();

              this.yyyy = this.dataOdierna.getFullYear();


           }


           editUserDetail(tesseramento: Tesseramento) {
           alert('da fare');
             //    this.route.navigate(['users/' + socio.id + '/edit']);
           }






         // -------------------------------------------

         open(content: any, tesseramento: Tesseramento) {
         console.log(`open_content - user ${tesseramento.idTessera}`);
         this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
         // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
         if(result === 'Cancel click') {
         this.cancellazioneAbort();
         }
         if(result === 'Delete click') {
           console.log('fare routine di cancellazione: ' + tesseramento.id + ' - ' + tesseramento.anno );
          //this.cancellaProdotto(this.prodotto);
           this.delete(tesseramento);
           this.cancellazioneCompleted(tesseramento);
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

         cancellazioneCompleted(tesseramento: Tesseramento) {
           this.type = 'success';
           this.Message = 'cancellazione del tesseramento per anno ' + tesseramento.anno + ' ' + tesseramento.idTessera + 'eseguita con successo';
           this.showNotification(this.type, this.Message);
         }

         delete(tesseramento: Tesseramento) {
           console.log(tesseramento.id,'cancelllllllllllllllllllllllo --->');
           this.tesseramentoService.deletetesseramento(tesseramento).subscribe((res: any)=> {
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

}

