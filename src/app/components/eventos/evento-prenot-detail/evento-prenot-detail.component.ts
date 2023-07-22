
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from './../../../classes/Manifestazione';
import { Evento} from './../../../classes/Evento';
import { EventoPosto } from './../../../classes/Eventoposto';
import { PrenotazeventomasterConfirm } from './../../../classes/PrenotazeventomasterConfirm';
import { Biglietto } from './../../../classes/Biglietto';
// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faEnvelope, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { EventopostoService } from './../../../services/eventoposto.service';
import { PrenotazeventomasterConfirmService } from './../../../services/prenotazeventomaster-confirm.service';
import { BigliettoService } from './../../../services/biglietto.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
import { mergeNsAndName } from '@angular/compiler';


@Component({
  selector: 'app-evento-prenot-detail',
  templateUrl: './evento-prenot-detail.component.html',
  styleUrls: ['./evento-prenot-detail.component.css']
})
export class EventoPrenotDetailComponent implements OnInit {

  public title = 'Situazione Prenotazioni ';
  public error = [];

  public cognome = '';
  public email = '';

  public manif: Manifestazione;
  public evento: Evento;
  public eventoposti: EventoPosto[] = [];
  public prenotazeventomasterConfirm: PrenotazeventomasterConfirm;
  public prenotazeventimaster: PrenotazeventomasterConfirm[] = [];
  public biglietti: Biglietto[] = [];

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
    'Da Confermare',
    'Confermate',
    'Emessi'
  ];

  public editdetailPosti = false;
  public presentiPosti = false;
  public idpassed = 0;
  public delCognome = '';
  public delNome = '';
  public charRic = '?';
  public validSearch = false;
  public stato = 0;
  public tipoRichiesta = '';
  public tipobiglietto = 0;
  public nRec = 0;
  public RichiedenteCognome = '';
  public RichiedenteNome = '';
  public date1;
  public date2;
  public datetest;
  public datetest1;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private eventoService: EventoService,
    private eventopostoService: EventopostoService,
    private manifestazioneService: ManifestazioneService,
    private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
    private bigliettoService: BigliettoService,
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


     this.route.paramMap.subscribe(p => {
     this.idpassed = +p.get('id');
     console.log('id recuperato: ' + this.idpassed);
     this.charRic = 'D';
     this.loadEvento(this.idpassed);
     })



   }

/*
   onSelectionChange(tipo: string)   {

    this.charRic = tipo.substring(0,1)
    alert('onSelection-- char: ' + this.charRic);

    this.validSearch = true;

    if(this.charRic === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
      }

    switch (this.charRic) {
                case 'D':
                this.loadprendaConfermare(this.evento.id);
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'C':
                  this.stato = 1;
              //    this.loadbyStato(this.stato);
                  break;
                case 'E':
                  this.stato = 0;

               //   this.loadbyStato(this.stato);
                  break;

                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }

    }
*/

    async loadprendaConfermare(id: number) {
      console.log('frontend - loadprendaConfermare: ' + id);
          let rc = await  this.prenotazeventomasterConfirmService.getAllbyEvento(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.prenotazeventimaster = response['data'];
                  this.Message = 'pronto per gestione Prenotazioni';
                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.nRec = response['number'];
              }
              if(response['rc'] === 'nf') {
                this.Message = 'nessuna Prenotazioni Presente';
                this.isVisible = true;
                this.alertSuccess = false;
                this.nRec = 0;
            }
        },
          error => {
                  alert('loadprendaConfermare: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadprendaConfermare' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }



    async loadprenConfermate(id: number, stato: number, tipobiglietto: number) {
        console.log('frontend - loadprenConfermate: ' + id + ' stato: ' + stato + ' tipobi: ' + tipobiglietto);
            let rc = await  this.eventopostoService.getbyIdEventoeStatotipobiglietto(id, stato, tipobiglietto).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                    this.eventoposti = response['data'];
                    this.presentiPosti = true;
                    this.Message = 'pronto per gestione Prenotazioni Confermate';
                    this.isVisible = true;
                    this.alertSuccess = true;
                    this.nRec = response['number'];
                }
                if(response['rc'] === 'nf') {
                  this.presentiPosti = false;
                  this.Message = 'nessuna Prenotazioni Confermata Presente';
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.nRec = 0;
              }
          },
            error => {
                    alert('loadprenConfermate: ' + error.message);
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.Message = 'Errore loadprenConfermate' + '\n' + error.message;
                    this.showNotification(this.type, this.Message);
                    console.log(error);
                });
        }


        async loadbigliettiEmessi(id: number) {
          console.log('frontend - loadbigliettiEmessi: ' + id );
              let rc = await  this.bigliettoService.getAllbyEvento(id).subscribe(
              response => {
                  if(response['rc'] === 'ok') {
                      this.biglietti = response['data'];
                      this.presentiPosti = true;
                      this.Message = 'situazione Biglietti Emessi';
                      this.isVisible = true;
                      this.alertSuccess = true;
                      this.nRec = response['number'];
                  }
                  if(response['rc'] === 'nf') {
                    this.presentiPosti = false;
                    this.Message = 'nessun Biglietto Emesso';
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.nRec = 0;
                }
            },
              error => {
                      alert('loadbigliettiEmessi: ' + error.message);
                      this.isVisible = true;
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.Message = 'Errore loadbigliettiEmessi' + '\n' + error.message;
                      this.showNotification(this.type, this.Message);
                      console.log(error);
                  });
          }




// 3.....................................
sendSollecito() {
  alert('prono yter fare sollecito')
}

emettiBiglietto(eventoPosto: EventoPosto) {

  this.router.navigate(['biglietto/' + eventoPosto.id + '/edit']);

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

async  loadEventoPostibyannulloPrenot(token: string) {
    console.log('frontend - loadEventoPosti: ' + token);
    let rc = await  this.eventopostoService.getbytoken(token).subscribe(
      response => {
          console.log('loadEventoPosti: --------- posti ------------- ' + JSON.stringify(response['data']));
          this.eventoposti = response['data'];
          for(const posto of this.eventoposti) {
            this.cancellaPrenotazione(posto);
          }
          this.deletePreneventmasterConfirmed(token);
    },
      error => {
            alert('loadEventoPostibyannulloPrenot: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventoPostibyannulloPrenot' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
      });
}






async openDetailPosti(prenevento: PrenotazeventomasterConfirm) {

  this.RichiedenteCognome = prenevento.cognome;
  this.RichiedenteNome = prenevento.nome;
 // alert('sono dentro a openDetailPosti --- editdetailPosti -------- situazione iniziale ' + this.editdetailPosti)

  if(this.editdetailPosti === false) {
    this.editdetailPosti = true;
  } else {
    this.editdetailPosti = false;
  }
 console.log('editdetailPosti: ' + this.editdetailPosti);



  let rc = await  this.eventopostoService.getbytoken(prenevento.token).subscribe(
    response => {
        console.log('loadEventoPosti: --------- posti ------------- ' + JSON.stringify(response['data']));
        if(response['rc'] === 'ok') {
          this.eventoposti = response['data'];
          this.importoTotb = response['imptotale'];
          this.presentiPosti = true;
        }
        if(response['rc'] === 'nf') {
          this.presentiPosti = false;
        }

    },
    error => {
        alert('openDetailPosti: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore openDetailPosti' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });




}

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


deletePreneventmasterConfirmed(token: string) {
let rc =  this.prenotazeventomasterConfirmService.deletebytoken(token).subscribe(
resp => {
 if(resp['rc'] === 'ok') {
  this.isVisible = true;
  this.alertSuccess = true;
  this.type = 'success';
  this.Message = 'Prenotazioni evento confermati con successo';
  this.showNotification(this.type, this.Message);
  this.visibleConferma = false;

 }
},
error => {
    console.log('error in deletePreneventmasterConfirmed: ' + error.message);
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'erore in cancellazione master ' + error.message;
    this.showNotification(this.type, this.Message);
  });
}

previewCancella(evposto: EventoPosto, content: any) {
      localStorage.removeItem('delPosto_Cognome');
      localStorage.removeItem('delPosto_Nome');

      localStorage.setItem('delPosto_Cognome', evposto.cognome);
      localStorage.setItem('delPosto_Nome', evposto.nome);

      this.delCognome = localStorage.getItem('delPosto_Cognome');
      this.delNome = localStorage.getItem('delPosto_Nome');
      this.open(content, evposto);
}




open(content: any, evposto: EventoPosto) {
this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
this.closeResult = `Closed with: ${result}`;
// alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
if(result ===  'Cancel click') {
alert('cancellazione abbandonata dall Utrente');
// this.cancellazioneAbort();
}
if(result ===  'Delete click') {
alert('eseguire la cancellazione utente');
this.cancellaPrenotazione(evposto);
}
}, (reason) => {
this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
this.cancellazioneAbort();
});

}

openMaster(contentMaster: any) {
this.modalService.open(contentMaster, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
this.closeResult = `Closed with: ${result}`;
// alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
if(result ===  'Cancel Global click') {
alert('cancellazione abbandonata dall Utrente');
// this.cancellazioneAbort();
}
if(result ===  'Delete Global click') {
alert('eseguire  stato eventoposto = 0');
 //  this.loadEventoPostibyannulloPrenot(this.token);
}
}, (reason) => {
this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
this.cancellazioneAbort();
});

}


dettaglio(biglietto: Biglietto) {
  alert(' devo fare apparire il dettaglio con gli altri campi del biglietto')
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
this.isVisible = true;
this.alertSuccess = false;
this.showNotification(this.type, this.Message);
}

cancellaPrenotazione(evposto: EventoPosto) {

console.log('cancellaPrenotazione: ' + JSON.stringify(evposto));
// alert('sono a cancellaPrenotazione');
// return;
let tokenactual = evposto.token;
evposto.stato = 0;  // rendo nuovamente disponibile il posto
evposto.cognome = '';
evposto.token = '';
evposto.nome = '';
evposto.cellulare = '';
evposto.email = '';
evposto.tipobiglietto = 0;

this.eventopostoService.update(evposto).subscribe(
response => {
  if(response['rc'] === 'ok') {
    this.isVisible = true;
    this.alertSuccess = true;
    this.type = 'success';
    this.Message = 'Prenotazione cancellata correttamente';
    this.showNotification(this.type, this.Message);
   }
},
error =>
  {
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'Errore cancellazione Prenotazione' + '\n' + error.message;
    this.showNotification(this.type, this.Message);
    console.log(error);
  });
}


async onSelectionChange(tipo: string)   {

  // alert('onSelectionChange - Tipo Richiesta: ' + tipo);

  this.charRic = tipo.substring(0, 1);
  this.presentiPosti = false;
  switch(this.charRic) {
      case "D":
        this.loadprendaConfermare(this.idpassed)
        break;
      case "C":
        this.stato = 1;
        this.tipobiglietto = 0;
        this.loadprenConfermate(this.idpassed,  this.stato, this.tipobiglietto );
        break;
      case "E":
        this.loadbigliettiEmessi(this.idpassed);
        break;
      default:
        console.log("No such day exists!");
        break;
      }
    }

}
