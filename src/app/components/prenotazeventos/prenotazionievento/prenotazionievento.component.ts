import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from '../../../services/manifestazione.service';
import { PrenotazeventoService } from '../../../services/prenotazevento.service';
import { EventoService } from '../../../services/evento.service';
import { LogisticaService } from '../../../services/logistica.service';
import { CassaService } from '../../../services/cassa.service';

// classi
import { Manifestazione} from '../../../classes/Manifestazione';
import { Prenotazevento} from '../../../classes/Prenotazevento';
import { Evento} from '../../../classes/Evento';
import { Logistica } from '../../../classes/Logistica';
import { Cassa } from '../../../classes/Cassa';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prenotazionievento',
  templateUrl: './prenotazionievento.component.html',
  styleUrls: ['./prenotazionievento.component.css']
})
export class PrenotazionieventoComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public manifestazioni: Manifestazione[] = [];
  public manifestazione: Manifestazione;
  public prenotazionievento: Prenotazevento[] = [];
  public eventi: Evento[] = [];
  public evento: Evento;
  public logistica: Logistica;
  public cassa: Cassa;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Prenotazioni Evento - prenotazionievento works!";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Aperte',
    'Non Aperte',
    'Chiuse'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente
  public statoAttivo = 1;

  public selectedmanif = 0;
  public selectedEvento = 0;
  public manifselected = false;
  public eventoselected = false;
  public eventobylogistica = false;
  public statocassa = 'Merda';
  public keystatocassa = '';
  public dataodierna;
  public datadioggi = '';
  public tipocassa = '';

constructor(private manifService: ManifestazioneService,
            private prenotazeventoService: PrenotazeventoService,
            private eventoService: EventoService,
            private logisticaService: LogisticaService,
            private cassaService: CassaService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }


            ngOnInit(): void {
              this.goApplication();
             }


             goApplication() {
              this.loadcassaodierna();
              this.loadManifestazioniActive();
          }

      async   loadcassaodierna() {

            const date = Date();
            this.dataodierna = new Date(date);
            this.datadioggi =  this.datePipe.transform(this.dataodierna, 'dd-MM-yyyy');
            let rc =  await  this.cassaService.getbydata(this.datadioggi).subscribe(
              res => {
                  console.log('loadcassaodirna - rc: ' + res['rc']);
                  this.keystatocassa = res['rc'];
                  if(res['rc'] === 'ok') {
                    this.statocassa = 'Cassa Giornaliera Aperta';
                  }
                  if(res['rc'] === 'nf') {
                    this.statocassa = 'Cassa Giornaliera Non Aperta';
                    this.Message = 'Esegui apertura della cassa giornaliera';
                    this.alertSuccess = false;
                  }
             },
             error => {
                alert('loadcassaodierna - errore: ' + error.message);
                console.log(error);
                this.Message = error.message;
                this.alertSuccess = false;
             });

          }

          async loadManifestazioniActive() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.manifService.getManifbyStato(this.statoAttivo).subscribe(
                 res => {
                    this.manifestazioni = res['data'];
                    this.Message = 'Effettua la selezione della manifestazione';
                    this.alertSuccess = true;
                },
                error => {
                   alert('loadManifestazioniActive - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
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



  onSelectedManifestazione(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
      if(selectedValue ==  99) {
        this.type = 'error';
        this.Message = 'selezione non corrette';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;
        this.selectedmanif = 0;
        this.manifselected = false;
        return;
     } else {
          this.selectedmanif = selectedValue;
          this.loadEventiAttivi(this.selectedmanif);
          this.manifselected = true;
          this.alertSuccess = true;
          this.Message = 'Effettua la selezione dell evento';
          this.alertSuccess = true;
     }

 }

 onSelectedEvento(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  99) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.selectedEvento = 0;
      this.eventoselected = false;
      return;
   } else {
        this.selectedEvento = selectedValue;
        this.eventoselected = true;
        this.alertSuccess = true;
        this.Message = 'Situazione attuale prenotazioni';
        this.alertSuccess = true;
        this.loadPrenotevento(this.selectedEvento);
        this.loadEvento(this.selectedEvento);

   }

 }

async loadEventiAttivi(id: number) {

  let rc =  await  this.eventoService.getActivebyIdManif(id).subscribe(
    res => {
       console.log('loadEventiAttivi: ------------- ' + JSON.stringify(res['data']));
       this.eventi = res['data'];
       this.Message = 'Effettua la selezione degli eventi';
       this.alertSuccess = true;
   },
   error => {
      alert('loadEventiAttivi - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });

}

async loadPrenotevento(id: number) {

  let rc =  await  this.prenotazeventoService.getbyEvento(id).subscribe(
    res => {
       this.prenotazionievento = res['data'];
       this.Message = 'situazione prenotazioni per  evento selezionato';
       this.alertSuccess = true;

   },
   error => {
      alert('loadPrenotevento - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });

}


async loadEvento(id: number) {
  let rc =  await  this.eventoService.getbyId(id).subscribe(
    res => {
       this.evento = res['data'];
       this.eventobylogistica = false;
       if(this.evento.idlogistica !== 0) {
          this.loadLogistica(this.evento.idlogistica)
       }

   },
   error => {
      alert('loadEvento - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });

}

async loadLogistica(id:number) {
  let rc =  await  this.logisticaService.getbyId(id).subscribe(
    res => {
       this.logistica = res['data'];
       this.eventobylogistica = true;

   },
   error => {
      alert('loadEvento - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });

}




 onSelectionChange(tipo: string)   {
    alert('da fare');
  /*
  this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta === '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
      return;
    }

  switch (this.tipoRichiesta) {
              case 'Tutte':
              this.loadManifestazioni();
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Aperte':
                this.stato = 1;
                this.loadbyStato(this.stato);
                break;
              case 'Non Aperte':
                this.stato = 0;
            //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.loadbyStato(this.stato);
                break;
              case 'Chiuse':
                //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.stato = 2;
                this.loadbyStato(this.stato);
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
     }
     */
  }

  opencassa() {

    const date = Date();
    this.dataodierna = new Date(date);
    this.datadioggi =  this.datePipe.transform(this.dataodierna, 'dd-MM-yyyy');
    this.tipocassa = 'A';
    this.router.navigate(['cassa/' + this.datadioggi + '/tipo/' + this.tipocassa]);

  }

  closecassa() {
    this.tipocassa = 'C';
    this.router.navigate(['cassa/' + this.datadioggi + '/tipo/' + this.tipocassa]);
  }




}

