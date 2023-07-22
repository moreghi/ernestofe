import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../../../classes/Manifestazione';
import { Evento} from '../../../../../classes/Evento';
import { Ttipobiglietto} from '../../../../../classes/T_tipo_biglietto';
import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';
import { Prenotazevento } from '../../../../../classes/Prenotazevento';
import { EventoPosto } from '../../../../../classes/Eventoposto';
import { PrenotazeventomasterConfirm } from '../../../../../classes/PrenotazeventomasterConfirm';

// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';
import { TtipobigliettoService } from '../../../../../services/ttipobiglietto.service';
import { ManifestazioneService } from '../../../../../services/manifestazione.service';
import { EventoService } from '../../../../../services/evento.service';
import { PrenotazeventoService } from '../../../../../services/prenotazevento.service';
import { EventopostoService } from '../../../../../services/eventoposto.service';
import { PrenotazeventomasterConfirmService } from '../../../../../services/prenotazeventomaster-confirm.service';

import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-response-prenotazione-evento',
  templateUrl: './response-prenotazione-evento.component.html',
  styleUrls: ['./response-prenotazione-evento.component.css']
})
export class ResponsePrenotazioneEventoComponent implements OnInit {

  public form = {
    token: '',
    cognome: '',
    nome: '',
    email: '',
    telefono: '',
    dataevento: null,
    evento: '',
    tipobiglietto: '',
    persone: 0,
    codpren: ''
};

public title = 'conferma Prenotaz Evento Master ';
public error = [];
public token = '';
public password = '';
public codpren = '';
public cognome = '';
public email = '';

public manif: Manifestazione;
public evento: Evento;
public tipobiglietto: Ttipobiglietto;
public ricpren: PrenotazeventoConfirm;
public prenotazevento: Prenotazevento;
public prenotazionieventoConfirm: PrenotazeventoConfirm[] = [];
public eventoposti: EventoPosto[] = [];
public prenotazeventomasterConfirm: PrenotazeventomasterConfirm;
public wprenotazeventomasterConfirm: PrenotazeventomasterConfirm;

public datapre = '';
public datagiaRichiesta = false;
public currencyPipeString = '';
public data1 = '';

public gg = '';
public mm = '';
public yyyy = '';
public dataPren: Date;

// icone
faTrash = faTrash;
faSave = faSave;
faPlus = faPlus;
faUserEdit = faUserEdit;

public isVisible = false;
public alertSuccess = false;
public Message = '';
public type = '';

closeResult = '';
public enabledNewUser = false;
public initialDate: any;
public visibleConferma = true;

public confermataPrenotazione = false;
public emailsend = false;
public importoTotb = 0;
// per paginazone
p: number = 1;

public registratoevento = false;
public editdetailPosti = false;
public codprenVerify = false;


constructor(private router: Router,
            private route: ActivatedRoute,
            private datePipe: DatePipe,
            private modalService: NgbModal,
            private prenotazeventoConfirmService: PrenotazeventoConfirmService,
            private prenotazeventoService: PrenotazeventoService,
            private eventoService: EventoService,
            private eventopostoService: EventopostoService,
            private manifestazioneService: ManifestazioneService,
            private tipobigliettoService: TtipobigliettoService,
            private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
            private notifier: NotifierService) {
              this.notifier = notifier;
              route.queryParams.subscribe(
                params => {
                  this.form.token = params['token']

                });
            }


  ngOnInit(): void {


    this.wprenotazeventomasterConfirm = new PrenotazeventomasterConfirm();
    this.codprenVerify = false;
    this.registratoevento = false;
    this.confermataPrenotazione = false;
    this.editdetailPosti = false;
    this.ricpren  = new PrenotazeventoConfirm();
    this.token = this.form.token;

    console.log('OnInit - token: ' + this.token);


// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;
    this.prenotazeventomasterConfirmService.getbytoken(this.token).subscribe(
        resp => {
          if(resp['rc'] === 'ok') {
                // this.ricpren = resp['data'];
                this.prenotazeventomasterConfirm = resp['data'];

                console.log(' dati della prenotazioneMaster: ' + JSON.stringify(resp['data']))
                this.codpren = this.prenotazeventomasterConfirm.codpren;
              //  this.form.cognome = this.prenotazeventomasterConfirm.cognome;
              //  this.form.nome = this.ricpren.nome;
              //  this.form.email = this.ricpren.email;
             //   this.form.dataevento = this.ricpren.datapren;
              //  this.form.persone = this.ricpren.persone;
             //   this.form.telefono = this.ricpren.telefono;
            //    this.codpren = this.ricpren.codpren;
                this.loadEvento(this.prenotazeventomasterConfirm.idEvento);
           }
          if(resp['rc'] === 'nf') {
            this.Message = 'Conferma prenotazione già eseguita - funzione non eseguibile';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
           }
          },
          error => {
                console.log('error in lettura user: ' + error.message);
           });


  }


  async loadEvento(id: number) {
    console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
    if(response['rc'] === 'ok') {
      this.evento = response['data'];
      this.form.evento = this.evento.descrizione
      this.loadManifestazione(this.evento.idmanif);
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
        this.loadEventoPosti(this.token);

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

  openDetailPosti() {
        if(this.editdetailPosti === false) {
          this.editdetailPosti = true;
        } else {
          this.editdetailPosti = false;
        }
  }

  controlConpren() {

    if(this.wprenotazeventomasterConfirm.codpren !== this.codpren) {
      this.Message = 'codice di conferma prenotazione non corrisponde  - conferma non consentita';
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    } else {
      this.codprenVerify = true;
    }

  }




  onSubmit(form: NgForm) {

    alert('da fare  xxxxx ');

    console.log('sono in submit ---------  codpren --  ' + form.value.codpren);

    this.emailsend = false;
    // eseguo controllo sui campi inseriti
    if(form.value.codpren !== this.codpren) {
      this.Message = 'codice di conferma prenotazione non corrisponde  - conferma non consentita';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }

    this.token = form.value.token;
    // verificate la conferma ricevuta
    this.prenotazeventoConfirmService.getAllPreConfirmbyTokenCodpre(form.value.token, form.value.codpren).subscribe(
      resp => {
         if(resp['rc'] === 'ok') {
           this.prenotazionieventoConfirm = resp['data'];
           for(const prenconf of this.prenotazionieventoConfirm) {
              this.creaPrenotazioneevento(prenconf);
            }
           this.deleteAllPreneventConfirmed(this.token);
         }
      },
      error => {
            console.log('error in lettura richiesta prenotazione: ' + error.message);
          });

  }

  handleError(error) {
    this.error = error.error.errors;
  }


  showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }


  creaPrenotazioneevento(prenconf: PrenotazeventoConfirm) {

    console.log('creaPrenotazioneevento : ---------- prenotazionida confermare ------------------ ' + JSON.stringify(prenconf));
    this.prenotazevento = new Prenotazevento();
    this.prenotazevento.cognome = prenconf.cognome;
    this.prenotazevento.nome = prenconf.nome;
    this.prenotazevento.email = prenconf.email;
    this.prenotazevento.idevento = prenconf.idevento;
    this.prenotazevento.idlogistica = prenconf.idlogistica;
    this.prenotazevento.idsettore = prenconf.idsettore;
    this.prenotazevento.idfila = prenconf.idfila;
    this.prenotazevento.idposto = prenconf.idposto;
    this.prenotazevento.idtipobiglietto = prenconf.idtipobiglietto;
    this.prenotazevento.persone = 1;
    this.prenotazevento.telefono = prenconf.telefono;
    this.prenotazevento.datapren = prenconf.datapren;
    console.log('pronto per inserimento prenotazione: ----------- prenotazevento -----' + JSON.stringify(this.prenotazevento));
    this.prenotazeventoService.createPrenotazione(this.prenotazevento).subscribe(
      resp => {
                 if(resp['rc'] === 'ok') {
                  // non faccio nulla
                 }
          },
      error => {
             console.log('errore in creazione prenotazione ' + error.message);
             this.handleError(error);
             console.log(error.message);
             this.type = 'error';
             this.Message = 'errore in creazione  prenotazione: ' + error.message;
             this.showNotification(this.type, this.Message);
       });
  }

async  deleteAllPreneventConfirmed(token: string) {
  let rc =  this.prenotazeventoConfirmService.deletePreConfirmbyToken(token).subscribe(
      resp => {
         if(resp['rc'] === 'ok') {
            this.deletePreneventmasterConfirmed(token);
         }
      },
      error => {
            console.log('error in lettura richiesta prenotazione: ' + error.message);
          });
  }

  deletePreneventmasterConfirmed(token: string) {
    let rc =  this.prenotazeventomasterConfirmService.deletebytoken(token).subscribe(
      resp => {
         if(resp['rc'] === 'ok') {
          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Prenotazioni evemnto confermati con successo';
          this.showNotification(this.type, this.Message);
          this.visibleConferma = false;
          this.registratoevento = true;
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


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
      if(result ===  'Cancel click') {
         this.cancellazioneAbort();
      }
      if(result ===  'Delete click') {
        this.cancellaPrenotazione(this.token);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
   //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
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
    this.isVisible = true;
    this.alertSuccess = false;
    this.showNotification(this.type, this.Message);
  }

  cancellaPrenotazione(token: string) {
    this.prenotazeventoConfirmService.deletePreConfirmbyToken(token).subscribe(
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

}
