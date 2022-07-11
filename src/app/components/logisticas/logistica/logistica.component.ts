import { Component, Input, OnInit } from '@angular/core';
// Service
import { LogisticaService} from '../../../services/logistica.service';
// Model
import { Logistica } from '../../../classes/Logistica';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'tr[app-logistica]',
  templateUrl: './logistica.component.html',
  styleUrls: ['./logistica.component.css']
})
export class LogisticaComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('logist-data') logistica: Logistica;
   @Input('logist-prog') i: number;


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



   constructor(private logisticaService: LogisticaService,
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
      console.log('logistica            dettaglio ' + JSON.stringify(this.logistica));
   }



  navigate(pathNavigate: string, logistica: Logistica) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${logistica.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['logistica/edit/' + logistica.id]);
        break;
      case 'Posti':
        this.route.navigate(['logposti/' + logistica.id + '/edit']);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }




// -------------------------------------------

open(content:any, logistica: Logistica) {
  console.log(`open_content - user ${logistica.localita}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
          console.log('fare routine di cancellazione: ' + logistica.id + ' - ' + logistica.localita );
         //this.cancellaProdotto(this.prodotto);
          this.delete(logistica);
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



  delete(logistica: Logistica) {
    this.logisticaService.delete(logistica).subscribe(
      res => {
            this.type = 'success';
            this.Message = `cancellazione Logistica ${logistica.localita}  eseguita con successo `;
            this.showNotification(this.type, this.Message);
          },
          error => {
              alert('delete logistica: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
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

