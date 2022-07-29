import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// component
import { Manifestazione} from '../../../../../classes/Manifestazione';
import { Evento} from '../../../../../classes/Evento';
import { Ttipobiglietto} from '../../../../../classes/T_tipo_biglietto';
import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';
import { Prenotazevento } from '../../../../../classes/Prenotazevento';
// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';
import { TtipobigliettoService } from '../../../../../services/ttipobiglietto.service';
import { ManifestazioneService } from '../../../../../services/manifestazione.service';
import { EventoService } from '../../../../../services/evento.service';
import { PrenotazeventoService } from '../../../../../services/prenotazevento.service';


import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
// import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-response-evento-normal',
  templateUrl: './response-evento-normal.component.html',
  styleUrls: ['./response-evento-normal.component.css']
})
export class ResponseEventoNormalComponent implements OnInit {

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

  public title = 'conferma del cazzo';
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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private modalService: NgbModal,
              private prenotazeventoConfirmService: PrenotazeventoConfirmService,
              private prenotazeventoService: PrenotazeventoService,
              private eventoService: EventoService,
              private manifestazioneService: ManifestazioneService,
              private tipobigliettoService: TtipobigliettoService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.token = params['token']
                  });
              }





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

  async loadEvento(id: number) {
    console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
    if(response['rc'] === 'ok') {
      this.evento = response['data'];
      this.form.evento = this.evento.descrizione
      this.loadManifestazione(this.evento.idmanif);
      this.loadtipibiglietto(this.ricpren.idtipobiglietto);
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


    handleError(error) {
      this.error = error.error.errors;
    }


    showNotification( type: string, message: string ): void {
      this.notifier.notify( type, message );
    }

    confermaPrenotazione(prenotazevento: Prenotazevento, token: string) {
      console.log('confermaPrenotazione - pronto per la creazione prenotazione: ' + JSON.stringify(prenotazevento) + ' token: ' + token);

      this.prenotazeventoService.createPrenotazione(prenotazevento).subscribe(
        resp => {
            if(resp['rc']  === 'ok') {
              this.invioemailfinale(prenotazevento);
              this.cancellazioneConfermaPrenotazione(token);
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

cancellaPrenotazione(token: string) {

  this.prenotazioneConfirmService.deletePreConfirmbyToken(token).subscribe(
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






}





*/
