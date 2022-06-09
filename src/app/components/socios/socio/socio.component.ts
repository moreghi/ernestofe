/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css']
})
export class SocioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/

import { Component, Input, OnInit } from '@angular/core';
// Services
import { SocioService} from '../../../services/socio.service';
import { TlocalitaService} from '../../../services/tlocalita.service';
import { TesseramentoService} from '../../../services/tesseramento.service';
// Model
import { Socio} from '../../../classes/Socio';
import { Tlocalita } from '../../../classes/T_localita';
import { Tesseramento } from '../../../classes/Tesseramento';
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
  selector: 'tr[app-socio]',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css']
})
export class SocioComponent implements OnInit {

  @Input('socio-data') socio: Socio;
  @Input('socio-prog') i: number;

  public localita: Tlocalita;
  public tesseramento: Tesseramento;

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
  public navigateGraficoDays = 'GraphDays';

  public messagenull = 'Nessun record presente !!!';

  public dataOdierna;
  public anno  = 0;

  closeResult = '';

// variabili per notifica esito operazione con Notifier
 public type = '';



  constructor(private socioService: SocioService,
              private tlocalitaService: TlocalitaService,
              private tesseramentoService: TesseramentoService,
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

     this.loadResidenza(this.socio.residenza);
     this.loadTesseramento(this.socio);
  }

  async loadTesseramento(socio: Socio) {

    const date = Date();
    this.dataOdierna = new Date(date);

    this.anno  = this.dataOdierna.getFullYear();
    this.statoTesseramento = '?';
    console.log('frontend-----socio - loadTesseramento: ' + socio.id);
    let rc = await  this.tesseramentoService.getbySocioeAnno(socio.id,this.anno).subscribe(
       response => {
        if(response['rc'] === 'ok') {
          this.tesseramento = response['data'];
          this.statoTesseramento = 'tesserato';
        }
        if(response['rc'] === 'nf') {
           this.statoTesseramento = 'Non tesserato';
        }
      },
      error => {
         alert('loadResidenza: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
         this.showNotification( this.type, this.Message);
      });

  }



  getColor(stato) {
    switch (stato) {
      case 'tesserato':
        return 'green';
      case 'Non tesserato':
        return 'red';
    }
  }








  async loadResidenza(id: number) {
    console.log('frontend-----socio - loadResidenza: ' + id);
    let rc = await  this.tlocalitaService.getbyId(id).subscribe(
       response => {
        if(response['rc'] === 'ok') {
          this.localita = response['data'];
        }
      },
      error => {
         alert('loadResidenza: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
         this.showNotification( this.type, this.Message);
      });

}


 navigateTessere(socio: Socio) {

  if(socio.tessera === null || socio.tessera === '') {
     this.type = 'error';
     this.Message = 'Tessera non Valorizzata - rinnovo non possibile';
     this.showNotification(this.type, this.Message);
     return;
  }
  this.route.navigate(['socio/tessera/' + socio.id]);
 }


 navigateSocio(socio: Socio) {

  this.route.navigate(['socio/edit/' + socio.id]);
 }







// -------------------------------------------

open(content: any, socio: Socio) {
 console.log(`open_content - user ${socio.cognome}`);
 this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
 this.closeResult = `Closed with: ${result}`;
 // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
 if(result === 'Cancel click') {
 this.cancellazioneAbort();
 }
 if(result === 'Delete click') {
   console.log('fare routine di cancellazione: ' + socio.id + ' - ' + socio.cognome );
  //this.cancellaProdotto(this.prodotto);
   this.delete(socio);
   this.cancellazioneCompleted(socio);
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

 cancellazioneCompleted(socio: Socio) {
   this.type = 'success';
   this.Message = 'cancellazione del Socio ' + socio.cognome + ' ' + socio.cognome + 'eseguita con successo';
   this.showNotification(this.type, this.Message);
 }

 delete(socio: Socio) {
   console.log(socio.id,'cancelllllllllllllllllllllllo --->');
   this.socioService.deleteSocio(socio).subscribe((res: any)=> {
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


