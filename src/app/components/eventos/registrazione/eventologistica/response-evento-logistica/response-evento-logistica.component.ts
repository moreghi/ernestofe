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
  selector: 'app-response-evento-logistica',
  templateUrl: './response-evento-logistica.component.html',
  styleUrls: ['./response-evento-logistica.component.css']
})
export class ResponseEventoLogisticaComponent implements OnInit {

  public form = {
    token: '',
    keyuserpren: '',
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

public title = 'conferma del cazzo';
public error = [];
public token = '';
public keyuserpren = '';
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

// per paginazone
p: number = 1;

public registratoevento = false;


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
                  this.form.token = params['token'],
                  this.form.keyuserpren = params['keyuserpren']
                });
            }


  ngOnInit(): void {

    this.registratoevento = false;
    this.confermataPrenotazione = false;
    this.ricpren  = new PrenotazeventoConfirm();
    this.token = this.form.token;
    this.keyuserpren = this.form.keyuserpren;
    console.log('OnInit - token: ' + this.token);
    console.log('onInit - keyuserpren: ' + this.keyuserpren);

    this.form.keyuserpren = this.keyuserpren;
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;
    this.prenotazeventoConfirmService.getPreConfirmbyToken(this.token).subscribe(
        resp => {
          if(resp['rc'] === 'ok') {
                this.ricpren = resp['data'];
                console.log('')
                this.form.cognome = this.ricpren.cognome;
                this.form.nome = this.ricpren.nome;
                this.form.email = this.ricpren.email;
                this.form.dataevento = this.ricpren.datapren;
              //  this.form.persone = this.ricpren.persone;
                this.form.telefono = this.ricpren.telefono;
                this.codpren = this.ricpren.codpren;
                this.loadEvento(this.ricpren.idevento);
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
        this.loadEventoPosti(this.keyuserpren);

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

  async   loadEventoPosti(keyuserpren: string) {
    console.log('frontend - loadEventoPosti: ' + keyuserpren);
    let rc = await  this.eventopostoService.getbykeyuserpren(keyuserpren).subscribe(
    response => {
        console.log('loadEventoPosti: --------- posti ------------- ' + JSON.stringify(response['data']));
        this.eventoposti = response['data'];
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





  onSubmit(form: NgForm) {

    alert('da fare');

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
    let rc =  this.prenotazeventomasterConfirmService.deletePreConfirmbytoken(token).subscribe(
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
          if(response['rc'] === 'OK') {
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
/*

        console.log('letto la conferma: ' + JSON.stringify(resp['data']));
        this.prenotazevento = new Prenotazevento();
        this.prenotazevento.cognome = this.ricpren.cognome.toLowerCase();
        this.prenotazevento.nome = this.ricpren.nome.toLowerCase();
        this.prenotazevento.email = this.ricpren.email.toLowerCase();
        this.prenotazevento.idevento = this.ricpren.idevento;
        this.prenotazevento.datapren =  this.ricpren.datapren;
        this.prenotazevento.idtipobiglietto = this.ricpren.idtipobiglietto;
        this.prenotazevento.persone = this.ricpren.persone;
        this.prenotazevento.telefono = this.ricpren.telefono;
        this.confermaPrenotazione(this.prenotazevento, this.token);
        },
        error => {
              console.log('error in lettura richiesta prenotazione: ' + error.message);
            }
        );



    /*







  confermaPrenotazione(prenotazevento: Prenotazevento, token: string) {
    console.log('confermaPrenotazione - pronto per la creazione prenotazione: ' + JSON.stringify(prenotazevento) + ' token: ' + token);

    this.prenotazeventoService.createPrenotazione(prenotazevento).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.invioemailfinale(prenotazevento);
            // devo fare loop per cancellare tutte
       //     this.cancellazioneConfermaPrenotazione(token);
            } else {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'problemi in registrazione Prenotazione';
            this.showNotification(this.type, this.Message);
           }
      },
      error => {
        console.log('error in creazione Prenotazione: ' + error.message);
      }
    );
  }

  // moreno
  invioemailfinale(prenotazevento: Prenotazevento)  {

    this.prenotazeventoService.sendemailPrenotazioneConfermataMoreno(prenotazevento).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.emailsend = true;
            this.confermataPrenotazione = true;
           }
      },
      error => {
        console.log('error ininvioemailfinale Prenotazione: ' + error.message);
      });
  }


  cancellazioneConfermaPrenotazione(token: string) {
    this.prenotazeventoConfirmService.deletePreConfirmbyToken(token).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
              this.visibleConferma = false;
              this.form.codpren = '';
              this.isVisible = true;
              this.alertSuccess = true;
              this.type = 'success';
              this.Message = 'Prenotazione evento confermata correttamente';
              this.showNotification(this.type, this.Message);
           } else {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'problemi in registrazione Prenotazione';
            this.showNotification(this.type, this.Message);
           }
      },
      error => {
        console.log('error in cancellazioneConfermaPrenotazione: ' + error.message);
      }
    );
  }



}
/*


// import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-response-evento-normal',
  templateUrl: './response-evento-normal.component.html',
  styleUrls: ['./response-evento-normal.component.css']
})
export class ResponseEventoNormalComponent implements OnInit {






  ngOnInit(): void {
    this.confermataPrenotazione = false;
    this.ricpren  = new PrenotazeventoConfirm();
    this.token = this.form.token;
    console.log('OnInit - token: ' + this.token);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;

   // const impoto = 10;
  //  this.currencyPipeString = this.currencyPipe.transform(impoto, 'EUR');
  //  console.log('oninit - currency: ' + this.currencyPipeString );

    this.prenotazeventoConfirmService.getPreConfirmbyToken(this.token).subscribe(
    resp => {
      if(resp['rc'] === 'ok') {
            this.ricpren = resp['data'];
            this.form.cognome = this.ricpren.cognome;
            this.form.nome = this.ricpren.nome;
            this.form.email = this.ricpren.email;
            this.form.dataevento = this.ricpren.datapren;
            this.form.persone = this.ricpren.persone;
            this.form.telefono = this.ricpren.telefono;
            this.codpren = this.ricpren.codpren;
            this.loadEvento(this.ricpren.idevento);
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


  async loadtipibiglietto(id: number) {
    console.log('frontend - loadtipibiglietto: ' + id);
    let rc = await  this.tipobigliettoService.getbyid(id).subscribe(
    response => {
        this.tipobiglietto = response['data'];
      //  this.currencyPipeString = this.currencyPipe.transform(this.tipobiglietto.importo,'EUR');
      //  this.form.tipobiglietto = this.tipobiglietto.d_tipo + ' -- Importo: ' + this.tipobiglietto.importo;
        this.form.tipobiglietto = this.tipobiglietto.d_tipo + ' -- Importo: € ' + this.tipobiglietto.importo;
        console.log('currencyImporto ' +  this.currencyPipeString);
    },
    error => {
        alert('Manif-Data  --loadtipibiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadtipibiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

  }


  onSubmit(form: NgForm) {

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
    this.prenotazeventoConfirmService.getPreConfirmbyTokenCodpre(form.value.token, form.value.codpren).subscribe(
      resp => {
        this.ricpren = resp['data'];
        console.log('letto la conferma: ' + JSON.stringify(resp['data']));
        this.prenotazevento = new Prenotazevento();
        this.prenotazevento.cognome = this.ricpren.cognome.toLowerCase();
        this.prenotazevento.nome = this.ricpren.nome.toLowerCase();
        this.prenotazevento.email = this.ricpren.email.toLowerCase();
        this.prenotazevento.idevento = this.ricpren.idevento;
        this.prenotazevento.datapren =  this.ricpren.datapren;
        this.prenotazevento.idtipobiglietto = this.ricpren.idtipobiglietto;
        this.prenotazevento.persone = this.ricpren.persone;
        this.prenotazevento.telefono = this.ricpren.telefono;
        this.confermaPrenotazione(this.prenotazevento, this.token);
        },
        error => {
              console.log('error in lettura richiesta prenotazione: ' + error.message);
            }
        );

  }






}


/*


@Component({
  selector: 'app-response-prenotazione',
  templateUrl: './response-prenotazione.component.html',
  styleUrls: ['./response-prenotazione.component.css']
})
export class ResponsePrenotazioneComponent implements OnInit {



  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {

//   non so a cosa serva questo controllo
//    if(this.modalService.open) {
//      console.log('onSubmit ----   sono in open --  chiudo');
//      return;
//    }
//

   // alert('sono in submit');
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

    console.log('form Password: ' + form.value.password);

    if(this.enabledNewUser === true && form.value.password === '') {
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'inserire la password per la creazione utente';
      this.showNotification(this.type, this.Message);
      return;
    }

    if(this.enabledNewUser === true && form.value.password !== '') {


    this.cognome = this.ricpren.cognome;
    this.email = this.ricpren.email;
    console.log('controllo su user --- cognome ' + this.cognome + ' email ' + this.email);



    // verifica se cliente già censito
    this.userService.getuserbyEmaileCognomePren(this.email.toLowerCase(), this.cognome.toLowerCase()).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Cliente già registrato - inibire il flag di registrazione';
            this.showNotification(this.type, this.Message);
            return;
            }
      },
      error => {
        console.log('onSubmit - error in verifica users: ' + error.message);
      }
    );
  }

    this.password = form.value.password;
    this.token = form.value.token;
    // verificate la conferma ricevuta
    this.prenotazioneConfirmService.getPreConfirmbyTokenCodpre(form.value.token, form.value.codpren).subscribe(
      resp => {
        this.ricpren = resp['data'];
        console.log('letto la conferma: ' + JSON.stringify(resp['data']));
        this.prenotazione = new Prenotazione();
        this.prenotazione.cognome = this.ricpren.cognome.toLowerCase();
        this.prenotazione.nome = this.ricpren.nome.toLowerCase();
        this.prenotazione.email = this.ricpren.email.toLowerCase();
        this.prenotazione.idgiornata = this.ricpren.idgiornata;
        this.prenotazione.datapren =  this.dataPren;

      //  console.log('imposto la data di prenotazione: ' + this.prenotazione.datapren + ' data di provenienza: ' + this.ricpren.datapren);
        this.prenotazione.persone = this.ricpren.persone;
        this.prenotazione.telefono = this.ricpren.telefono;
        this.confermaPrenotazione(this.prenotazione, this.token);
        },
        error => {
              console.log('error in lettura richiesta prenotazione: ' + error.message);
            }
        );
  }












async  creautenteAnonimus() {
    alert('devo creare utente anonimo');

    this.user = new User();
    this.user.cognome = this.prenotazione.cognome.toLowerCase();
    this.user.nome = this.prenotazione.nome.toLowerCase();
    this.user.username = this.prenotazione.cognome.toLowerCase();
    this.user.email = this.prenotazione.email.toLowerCase();
    this.user.telefono = this.prenotazione.telefono;
    this.user.password = this.password;

    let rc  = await this.userService.createUserbyprenotazione(this.user).subscribe(
           resp => {
             if(resp['rc']  === 'ok') {
              console.log('creato utente ');
              this.Message = 'utente ' + this.prenotazione.cognome + ' ' + this.prenotazione.nome + ' Registrato con successo';
              this.isVisible = true;
              this.alertSuccess = true;
              this.type = 'success';
              this.showNotification(this.type, this.Message);
             }
           },
          error => {
               console.log('error in creazione Prenotazione: ' + error.message);
           });
  }


// moduli popup per gestire la conferma cancellazione







}





*/



