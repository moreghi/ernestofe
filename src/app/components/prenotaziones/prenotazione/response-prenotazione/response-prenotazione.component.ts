import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// component
import { PrenotazioneConfirm } from './../../../../classes/PrenotazioneConfirm';
import { Prenotazione } from './../../../../classes/Prenotazione';
import { User } from './../../../../classes/User';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazioneConfirmService } from './../../../../services/prenotazione-confirm.service';
import { PrenotazioneService } from './../../../../services/prenotazione.service';
import { AuthService } from './../../../../services/auth.service';
import { UserService } from './../../../../services/user.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-response-prenotazione',
  templateUrl: './response-prenotazione.component.html',
  styleUrls: ['./response-prenotazione.component.css']
})
export class ResponsePrenotazioneComponent implements OnInit {

  public form = {
    token: '',
    cognome: '',
    name: '',
    email: '',
    telefono: '',
    datapren: null,
    codpren: '',
    persone: 0,
    password: ''
  };

  public error = [];
  public token = '';
  public password = '';
  public codpren = '';
  public cognome = '';
  public email = '';

  public user: User;
  public ricpren: PrenotazioneConfirm;
  public prenotazione: Prenotazione;
  public datapre = '';
  public datagiaRichiesta = false;

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
              private prenotazioneConfirmService: PrenotazioneConfirmService,
              private prenotazioneService: PrenotazioneService,
              private userService: UserService,
              private auth: AuthService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.token = params['token']
                  });
              }

  ngOnInit(): void {
    this.confermataPrenotazione = false;
    this.ricpren  = new PrenotazioneConfirm();
    this.token = this.form.token;
    console.log('OnInit - token: ' + this.token);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;
    this.prenotazioneConfirmService.getPreConfirmbyToken(this.token).subscribe(
    resp => {
      if(resp['rc'] === 'ok') {
            this.ricpren = resp['data'];
            this.form.cognome = this.ricpren.cognome;
            this.form.name = this.ricpren.nome;
            this.form.email = this.ricpren.email;
            /*
            this.data1 =   this.ricpren.datapren.toString();

            this.gg = this.data1.substr(8,2);
            this.mm =  this.data1.substr(5,2);
            this.yyyy =  this.data1.substr(0,4);
            this. data1 = this.gg + '/' + this.mm + '/' + this.yyyy;
            this.form.datapren = this. data1;
            */

            this.gg = this.ricpren.datapren.substr(0, 2);
            this.mm =  this.ricpren.datapren.substr(3, 2);
            this.yyyy =  this.ricpren.datapren.substr(6, 4);

            this.data1 = this.yyyy + '-' + this.mm + '-' + this.gg;

            console.log('onInit - manipolazione ricpren.datapren: ' + this.ricpren.datapren);
            console.log('onInit - gg mm yyyy ' + this.gg + ' -- ' + this.mm + ' -- ' + this.yyyy);
            console.log('onInit - data1 ' + this.data1);



            this.initialDate = this.datePipe.transform(this.data1, 'yyyy-MM-dd');
            console.log('onInit - initializeDate: ' + this.initialDate);

            this.dataPren = this.initialDate;

           // this.dataPren = new Date(this.ricpren.datapren);
            console.log('onInit - dataPren: ' + this.dataPren + ' origine: ' + this.ricpren.datapren);

            this.form.datapren = this.ricpren.datapren;
            this.form.persone = this.ricpren.persone;
            this.form.telefono = this.ricpren.telefono;
            this.form.password = '';
            this.codpren = this.ricpren.codpren;
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

  onSubmit(form: NgForm) {

/*   non so a cosa serva questo controllo
    if(this.modalService.open) {
      console.log('onSubmit ----   sono in open --  chiudo');
      return;
    }
*/

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

  confermaPrenotazione(prenotazione: Prenotazione, token: string) {
    console.log('confermaPrenotazione - pronto per la creazione prenotazione: ' + JSON.stringify(prenotazione) + ' token: ' + token);

    this.prenotazioneService.createPrenotazione(prenotazione).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.invioemailfinale(prenotazione);
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
  invioemailfinale(pren: Prenotazione)  {

    this.prenotazioneService.sendemailPrenotazioneConfermataMoreno(pren).subscribe(
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
    this.prenotazioneConfirmService.deletePreConfirmbyToken(token).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.visibleConferma = false;
            if(this.form.password !== '') {
              this.creautenteAnonimus();
            } else {
              this.form.codpren = '';
              this.isVisible = true;
              this.alertSuccess = true;
              this.type = 'success';
              this.Message = 'Prenotazione confermata correttamente';
              this.showNotification(this.type, this.Message);
            }

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



  handleError(error) {
    this.error = error.error.errors;
  }


  showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
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


abilitaUser($event) {

  /*
  const aa = $event.target.value;
  const isChecked = $event.target.checked;
  alert(' lo stato è :' + aa);
  alert('è checked:' + isChecked);
  console.log(aa, isChecked);
*/
  const isChecked = $event.target.checked;
  this.enabledNewUser = isChecked;

}




}
