


import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from './../../../classes/Manifestazione';
import { Evento} from './../../../classes/Evento';
import { Cassa } from './../../../classes/Cassa';
import { Cassamov } from './../../../classes/Cassamov';

// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faEnvelope, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';

import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
import { mergeNsAndName } from '@angular/compiler';



@Component({
  selector: 'app-cassa-detail-day',
  templateUrl: './cassa-detail-day.component.html',
  styleUrls: ['./cassa-detail-day.component.css']
})
export class CassaDetailDayComponent implements OnInit {

  public title = 'Situazione Incassi ';
  public error = [];

  public cognome = '';
  public email = '';

  public manif: Manifestazione;
  public evento: Evento;
  public cassa: Cassa;
  public casse: Cassa[] = [];
  public cassamovs: Cassamov[] = [];

  public datapre = '';
  public datagiaRichiesta = false;
  public currencyPipeString = '';
  public data1 = '';


  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  faUserEdit = faUserEdit;
  faSearch = faSearch;
  faEnvelope = faEnvelope;
  faTicketAlt = faTicketAlt;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';

  closeResult = '';

  public initialDate: any;
  public visibleConferma = true;

  public emailsend = false;
  public importoTotb = 0;

  public trovatoRec = false;
  // per paginazone
  p1: number = 1;
  p2: number = 1;

  public searchText = '';

 options = [
    'Tutti',
    'Selettivo'
  ];

  options1 = [
    'Tutti',
    'Contanti',
    'Bonifico',
    'Elettronico'
  ];

  public editdetailPosti = false;
  public presentiPosti = false;
  public idpassed = 0;
  public delCognome = '';
  public delNome = '';
  public charRic = '?';
  public validSearch = false;
  public stato = 0;
  public nRec = 0;
  public nRec1 = 0;

  public date1;
  public date2;
  public datetest;
  public datetest1;
  public selectedday = 0
  public cassaselected  = false;
  public causaleIC = 'Inc. Contanti';
  public causaleIB = 'Inc. Bonifico';
  public causaleIE = 'Inc. Elettronico';


  constructor(private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private manifestazioneService: ManifestazioneService,
    private eventoService: EventoService,
    private cassaService: CassaService,
    private cassamovService: CassamovService,
    private notifier: NotifierService) {
      this.notifier = notifier;
      route.queryParams.subscribe(
        params => {
         });
    }


    ngOnInit(): void {
      this.goApplication();

    }


    goApplication() {
     console.log('evento-detail -------------------  goApplication');


      this.datetest = new Date();

      this.datetest1 = this.datetest.getDate();
      console.log('goApplication ------ datetest1 ' + this.datetest1)

     this.date2 = '29/05/2023';
     this.date1 = new Date().toLocaleDateString('it-IT');
     this.isVisible = true;
     this.alertSuccess = true;
     this.selectedday = 0;

     this.route.paramMap.subscribe(p => {
     this.idpassed = +p.get('idEvento');
     console.log('id recuperato: ' + this.idpassed);

     this.loadEvento(this.idpassed);
     this.charRic = 'T';
     this.loadAllMovCassa(this.evento.id);
     })

   }


   onSelectionChange(tipo: string)   {
    this.charRic = tipo.substring(0,1)
     this.validSearch = true;
    this.selectedday = 0;
    if(this.charRic === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
      }
      this.trovatoRec = false;
    switch (this.charRic) {
                case 'T':
                  this.loadAllMovCassa(this.evento.id);
                break;
                case 'S':
                  this.loadAllDayCassa(this.evento.id);
              //    vosializzo un messaggio di nessun record presente in attesa di selezionare
              // data dalla combo
                  break;
               default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }


      onSelectionChangeDay(selectedValue: number) {
        //  alert('selezionato: ' + selectedValue);
          if(selectedValue ==  99) {
            this.type = 'error';
            this.Message = 'selezione non corrette';
            this.showNotification(this.type, this.Message);
            this.alertSuccess = false;
            this.isVisible = true;
            this.selectedday = 0;
            this.cassaselected = false;
            return;
         } else {
              this.selectedday = selectedValue;
              this.loadCassa(this.selectedday);
              this.cassaselected = true;
              this.alertSuccess = true;
              this.Message = 'Movimenti della giornata selezionata';
              this.alertSuccess = true;
         }

     }


     async  loadCassa(id: number) {
      console.log('frontend - loadCassa: ' + id);
          let rc = await  this.cassaService.getbyId(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.cassa = response['data'];
                  this.loadMovimentiCassa(id);
               }
              if(response['rc'] === 'nf') {
                this.Message = 'Nessuna cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadMovimentiCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadMovimentiCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }




     async  loadMovimentiCassa(id: number) {
      console.log('frontend - loadMovimentiCassa: ' + id);
          let rc = await  this.cassamovService.getAllbyCassa(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.cassamovs = response['data'];
                  this.nRec1 = response['number'];
               }
              if(response['rc'] === 'nf') {
                this.nRec1 = 0;
                this.Message = 'Nessun movimento di cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadMovimentiCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadMovimentiCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }



    async loadAllDayCassa(id: number) {
      console.log('frontend - loadAllMovCassa: ' + id);
          let rc = await  this.cassaService.getAllDaybyEvento(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.casse = response['data'];
                  this.nRec = response['number'];
                  this.trovatoRec = true;
               }
              if(response['rc'] === 'nf') {
                this.nRec = 0;
                this.Message = 'Nessuna giornata di cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadAllMovCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadAllMovCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }

async loadAllMovCassa(id: number) {
  console.log('frontend - loadAllMovCassa: ' + id);
      let rc = await  this.cassamovService.getAllbyEvento(id).subscribe(
      response => {
          if(response['rc'] === 'ok') {
              this.cassamovs = response['data'];
              this.nRec = response['number'];
              this.trovatoRec = true;

           }
          if(response['rc'] === 'nf') {
            this.nRec = 0;
            this.Message = 'Nessun movimento di cassa presente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.trovatoRec = false;
         }
    },
      error => {
              alert('loadAllMovCassa: ' + error.error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore loadAllMovCassa' + '\n' + error.error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });
  }


async loadEvento(id: number) {
console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
            this.evento = response['data'];
            this.loadManifestazione(this.evento.idmanif);
            this.onSelectionChange(this.charRic);

        }
        if(response['rc'] === 'nf') {
          this.Message = 'Nessuna Prenotazione presente';
          this.isVisible = true;
          this.alertSuccess = false;
       }
  },
    error => {
            alert('Manif-Data  --loadEventi: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventi' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
}

async loadManifestazione(id: number) {
      console.log('frontend - loadManifestazione: ' + id);
      let rc = await  this.manifestazioneService.getbyId(id).subscribe(
      response => {
          this.manif = response['data'];
      },
      error => {
                  alert('Manif-Data  --loadManifestazione: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadManifestazione' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
                  });
   }

/*
async   loadEventoPosti(token: string) {
      console.log('frontend - loadEventoPosti: ' + token);
      let rc = await  this.eventopostoService.getbytoken(token).subscribe(
      response => {
            console.log('loadEventoPosti: --------- posti ------------- ' + JSON.stringify(response['data']));
            this.eventoposti = response['data'];
            this.importoTotb = response['imptotale'];
            },
      error => {
            alert('loadEventoPosti: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventoPosti' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
}

*/








conferma() {
   alert('da fare 1111');
//  this.deletePreneventmasterConfirmed(this.token);

}

handleError(error) {
this.error = error.error.errors;
}


showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}


}



