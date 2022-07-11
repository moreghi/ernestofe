
import { Component, Input, OnInit } from '@angular/core';
// Service
import { LogsettoreService} from '../../../services/logsettore.service';
import { LogfilaService} from '../../../services/logfila.service';
import { LogsettfilapostoService } from '../../../services/logsettfilaposto.service';
// Model
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogSettFilaPosti } from '../../../classes/Logsettfilaposti';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie, faUser } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// popup
import { LogpostipopComponent } from '../../../components/popups/logpostipop/logpostipop.component';  // popup per modificare posti

@Component({
  selector: 'tr[app-logsettfilaposti]',
  templateUrl: './logsettfilaposti.component.html',
  styleUrls: ['./logsettfilaposti.component.css']
})
export class LogsettfilapostiComponent implements OnInit {

    // variabili passate dal componente padre
    @Input('logsettfilaposti-data') logSettFilaPosti: LogSettFilaPosti;
    @Input('logsettfilaposti-prog') i: number;
    @Input('logsettfilaposti-lastoperation') lastoperation: string;

    public logFila: LogFila;
    public logSettore: LogSettore;


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
    faUser = faUser;

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
    public navigatePosti = 'Posti';
    public navigateGraficoDays = 'GraphDays';

    public messagenull = 'Nessun record presente !!!';

    closeResult = '';

 // variabili per notifica esito operazione con Notifier
   public type = '';
   public namepopup = 'logpostipop';


    constructor(private logsettoreService: LogsettoreService,
                private logfilaService: LogfilaService,
                private logsettfilapostoService: LogsettfilapostoService,
                private modalService: NgbModal,
                private route: Router,
                private notifier: NotifierService) {
                 this.notifier = notifier;
               }



    ngOnInit(): void {

       //   per gestire eventuale popup
       this.headerPopup = 'Registrazione Manifestazione';
       this.textMessage1 = '?????????? ';
    //   this.textUser = this.messa.demessa;
       this.textMessage2 = 'Registrazione non possibile';

      // this.loadManifestazioni();
       console.log('logistica            dettaglio ' + JSON.stringify(this.logSettFilaPosti));

       this.loadSettore(this.logSettFilaPosti.idSettore);
       this.loadFila(this.logSettFilaPosti.idFila);



    }



   navigate(pathNavigate: string, logSettFilaPosti: LogSettFilaPosti) {

     console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${logSettFilaPosti.id} `);


     switch (pathNavigate) {

       case 'Edit':
         this.route.navigate(['logposti/' + logSettFilaPosti.idLogistica + '/edit/' + logSettFilaPosti.id + '/posti']);
         break;

       default:
         alert('scelta errata \n navigazione non possibile');
         break;
     }

   }


   async loadSettore(id: number) {
    console.log('frontend-----socio - loadSettore: ' + id);
    let rc = await  this.logsettoreService.getbyId(id).subscribe(
       response => {
        if(response['rc'] === 'ok') {
          this.logSettore = response['data'];
        }
      },
      error => {
         alert('loadSettore: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
         this.showNotification( this.type, this.Message);
      });

}

async loadFila(id: number) {
  console.log('frontend-----socio - loadFila: ' + id);
  let rc = await  this.logfilaService.getbyId(id).subscribe(
     response => {
      if(response['rc'] === 'ok') {
        this.logFila = response['data'];
      }
    },
    error => {
       alert('loadFila: ' + error.message);
       console.log(error);
       this.alertSuccess = false;
       this.Message = error.message;
       this.showNotification( this.type, this.Message);
    });

}






 // -------------------------------------------

 open(content:any, logsettfilaposti: LogSettFilaPosti) {
   console.log(`open_content - settfila ${logsettfilaposti.idLogistica} -- ${logsettfilaposti.idSettore} -- ${logsettfilaposti.idFila}`);
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
   this.closeResult = `Closed with: ${result}`;
   // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
   if(result === 'Cancel click') {
   this.cancellazioneAbort();
   }
   if(result === 'Delete click') {
           console.log('fare routine di cancellazione: ' + logsettfilaposti.id + ' - ' + logsettfilaposti.idLogistica  + ' - ' + logsettfilaposti.idSettore);
          //this.cancellaProdotto(this.prodotto);
           this.delete(logsettfilaposti);
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



   delete(logsettfilaposti: LogSettFilaPosti) {
     this.logsettfilapostoService.delete(logsettfilaposti).subscribe(
       res => {
             this.type = 'success';
             this.Message = `cancellazione Logistica ${logsettfilaposti.idLogistica} -- ${logsettfilaposti.idSettore} -- ${logsettfilaposti.idFila}  eseguita con successo `;
             this.showNotification(this.type, this.Message);
           },
           error => {
               alert('delete logsettfilaposti: ' + error.message);
               this.isVisible = true;
               this.alertSuccess = false;
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
               console.log(error);
           });

   }

    modificaPosti(logsettfilaposti: LogSettFilaPosti) {

      console.log('modificaPosti: record da aggiornare ' + JSON.stringify(logsettfilaposti));

      const ref = this.modalService.open(LogpostipopComponent, {size:'lg'});
      ref.componentInstance.selectedUser = logsettfilaposti;

      ref.result.then(
         (yes) => {
           console.log('Click YES');
          // riaggiorno elenco richiamando padre
           console.log(' sono in logsettfilaposti - effettuo il route navigate a posti')
           localStorage.setItem('lastoperationpop', this.namepopup);
           localStorage.setItem('logsettfilaposti', JSON.stringify(logsettfilaposti));
           this.route.navigate(['logposti/' + logsettfilaposti.idLogistica + '/edit']);
          // effettuo reload per riaggiornare   2022/07/02
           window.location.reload();

         },
         (cancel) => {
           console.log('click Cancel');
         }
       );
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

