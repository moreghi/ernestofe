import { Component, Input, OnInit } from '@angular/core';
import { ComunicatoService} from '../../../services/comunicato.service';
import { Comunicato} from '../../../classes/Comunicato';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'tr[app-comunicato]',
  templateUrl: './comunicato.component.html',
  styleUrls: ['./comunicato.component.css']
})
export class ComunicatoComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('comunicato-data') comunicato : Comunicato;
   @Input('comunicato-prog') i: number;


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
   public navigateNotizie = 'Notizie';


   public messagenull = 'Nessun record presente !!!';

   closeResult = '';

// variabili per notifica esito operazione con Notifier
  public type = '';



   constructor(private comunicatoService: ComunicatoService,
               private modalService: NgbModal,
               private route: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                this.notifier = notifier;
              }




   ngOnInit(): void {

      //   per gestire eventuale popup
      this.headerPopup = 'Registrazione Comunicato';
      this.textMessage1 = '?????????? ';
   //   this.textUser = this.messa.demessa;
      this.textMessage2 = 'Registrazione non possibile';

      // this.loadManifestazioni();

   }


   editUserDetail(comunicato ) {
    this.function = parseInt(localStorage.getItem('user_ruolo'));
    if(this.function === -1) {
      this.route.navigate(['users/' + this.comunicato .id + '/edit']);
    } else {
      this.route.navigate(['users/' + this.comunicato .id + '/inqu']);
    }
  }


  navigate(pathNavigate: string, comunicato : Comunicato) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${comunicato .id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['comunicato/edit/' + comunicato .id]);
        break;
      case 'Notizie':
        this.route.navigate(['comunicato/' + comunicato .id + '/Not']);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


  naviga(comunicato : Comunicato) {
let aa = 'comunicato /grafico/day/' + comunicato .id;
console.log('path per grafico: ' + aa);
return;
    this.route.navigate(['comunicato /grafico/day/' + comunicato .id]);
  }



// -------------------------------------------

open(content:any, comunicato :Comunicato) {
  console.log(`open_content - user ${comunicato.titolo}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + comunicato .id + ' - ' + comunicato.titolo );
   //this.cancellaProdotto(this.prodotto);
   this.delete(comunicato );
   this.cancellazioneCompleted(comunicato );
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

  cancellazioneCompleted(comunicato :Comunicato) {
    this.type = 'success';
    this.Message = `cancellazione del Comunicato ${comunicato.titolo}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  async delete(comunicato : Comunicato) {
    console.log('cancelllllllllllllllllllllllo ---> ' + JSON.stringify(comunicato ));

    const ret = await this.comunicatoService.delete(comunicato).subscribe(
       res => {
            if(res['rc'] === 'ok')  {
              this.type = 'success';
              this.Message = 'Comunicato cancellata correttamente';
              this.alertSuccess = true;
              this.showNotification(this.type, this.Message);
            } else {
              this.type = 'error';
              this.Message = res['message'];
              this.showNotification(this.type, this.Message);
            }
        },
        error => {
           alert('delete - errore: ' + error.error.message);
           console.log(error);
           this.Message = error.error.message;
           this.alertSuccess = false;
        })
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



