import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model Classe
import { AdesioneConfirm } from './../../../classes/AdesioneConfirm';
import { Tlocalita } from './../../../classes/T_localita';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { AdesioneConfirmService } from './../../../services/adesione-confirm.service';
import { TlocalitaService } from './../../../services/tlocalita.service';
import { AuthService } from './../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-request-adesione',
  templateUrl: './request-adesione.component.html',
  styleUrls: ['./request-adesione.component.css']
})
export class RequestAdesioneComponent implements OnInit {


  public form = {
    cognome: '',
    nome: '',
    sesso: '',
    luogonascita: '',
    datanascita: '',
    residenza: '',
    indirizzo: '',
    telcasa: '',
    cell: '',
    email: '',
    operativo: ''
  };



/*
  public Registrationform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$')]),
    password_confirmation: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$')])
  })
*/

 // private type = "password";
 public error = [];


 public ade: AdesioneConfirm;
 public localita: Tlocalita;
 public localitanew: Tlocalita;


 public numPre = 0;
 // icone
 faTrash = faTrash;
 faSave = faSave;
 faPlus = faPlus;

 public isVisible = false;
 public alertSuccess = false;
 public Message = '';
 public type = '';

 public manAct = 0;


 public cognome = '';
 public nome = '';
 public sesso = '';
 public luogonascita = '';
 public datanascita = '';
 public residenza = '';
 public indirizzo = '';
 public telcasa = '';
 public cell = '';
 public operativo = '';
 public token = '';
 public codade = '';

 public email = '';
 public selectedSesso = '?';
 public selectedOperativo = '?';
 public selezioneSesso = '';
 public selezioneOperativo = '';
 public keylocalita = 0;

 public visibleConferma = true;


 constructor(private router: Router,
             private datePipe: DatePipe,
             private adesioneConfirmService: AdesioneConfirmService,
             private tlocalitaService: TlocalitaService,
             private auth: AuthService,
             private notifier: NotifierService) {
                this.notifier = notifier;
              }

      ngOnInit(): void {
      console.log('request-prenotazione -----  onInit');
      // recupero la manifestazione attiva per caricare le giornate
      this. ade = new AdesioneConfirm();
      this.visibleConferma = true;
      // this.manifAttiva(this.manifActive);

      }


      nuovaAdesione() {
        this.form.cognome = '';
        this.form.nome = '';
        this.form.sesso = '';
        this.form.luogonascita = '';
        this.form.datanascita = '';
        this.form.residenza = '';
        this.form.indirizzo = '';
        this.form.telcasa = '';
        this.form.cell = '';
        this.form.operativo = '';
        this.visibleConferma = true;

      }

      selectSesso(selectedValue: string) {
        // alert('operativo selezionato: ' + selectedValue);
         this.selectedSesso = selectedValue;
         this.ade.sesso = selectedValue;

       }

       selectOperativo(selectedValue: string) {
        // alert('operativo selezionato: ' + selectedValue);
         this.selectedOperativo = selectedValue;
         this.ade.operativo = selectedValue;


       }





      onSubmit(form: NgForm) {
        // alert('sono in submit');
         console.log('sono in submit -----------  ' );

         if (form.invalid ) {
          alert('form invalido');
          return;
        }
         if(this.selectedSesso === '?') {
            this.Message = 'non hai selezionato il sesso - inserimento non consentito';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
         }

         if(this.selectedOperativo === '?') {
          this.Message = 'non hai selezionato se operativo - inserimento non consentito';
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
          return;
       }
       // verifico se esistono le località e le creo nel caso mancassero
         this.LetturaKeyLocalita(form.value.luogonascita);
         this.LetturaKeyLocalita(form.value.residenza);


         this.eseguoConferma(form);
      }




    eseguoConferma(form: NgForm)  {

      console.log('eseguoConferma -   appena entrato - data: ' + form.value.datanascita);

      this.adesioneConfirmService.getAdeConfirmbyEmailCognomeNome(form.value.email, form.value.cognome, form.value.nome).subscribe(
        resp => {
               if(resp['rc'] === 'ok') {
                    this.Message = 'Richiesta adesione già eseguita  - inserimento non consentito';
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.showNotification(this.type, this.Message);
                    return;
               }
               if(resp['rc'] === 'nf') {
                      console.log('vado a invaire la mail e creare la richiesta adesione da confermare poi  -----   da fare ----->  2');

                      this.cognome = form.value.cognome;
                      this.nome = form.value.nome;
                      this.sesso = form.value.sesso;
                      this.luogonascita = form.value.luogonascita;
                      this.datanascita = form.value.datanascita;
                      this.residenza = form.value.residenza;
                      this.indirizzo = form.value.indirizzo;
                      this.telcasa = form.value.telcasa;
                      this.cell = form.value.cell;
                      this.email = form.value.email;
                      this.operativo = form.value.operativo;

                      console.log('merda   --------        vado a invaire la mail e creare la richiesta adesione da confermare poi  -----   data nascita: ' + this.datanascita);
                      this.registraRichiestaAdesione(this.cognome, this.nome, this.sesso, this.luogonascita, this.datanascita,
                                                     this.residenza, this.indirizzo, this.email, this.telcasa, this.cell, this.operativo);
                   }
            },
            error => {
                    this.handleError(error);
                    console.log(error.message);

                    this.type = 'error';
                    this.Message = 'errore in registrazione: ' + error.message;
                    this.showNotification(this.type, this.Message);
                  });

       }



 async registraRichiestaAdesione(cognome: string, nome: string, sesso: string, luogonascita: string, datanascita: string, residenza: string,
                                 indirizzo: string, email: string, telcasa: string, cell: string, operativo: string) {

        let res = await this.adesioneConfirmService.registerConfermetAdesioneMoreno
                                  (cognome, nome, sesso, luogonascita, datanascita, residenza, indirizzo,
                                   email, telcasa, cell, operativo).subscribe(
                         resp => {
                         //  da fare
                           //      this.inoltromail(form.value.email, form.value.cognome, form.value.name);
                                 console.log('effettuata la send email per ' + email);
                                 this.visibleConferma = false;
                                 this.Message = 'utente ' + cognome + ' inviata mail di richiesta adesione --------------';
                                 this.isVisible = true;
                                 this.alertSuccess = true;

                                 this.type = 'success';
                                 this.Message = 'richiesta adesione del sig. ' + cognome + ' Registrata con successo - inviata mail di conferma';
                                 this.showNotification(this.type, this.Message);
                              },
                         error => {
                                console.log('errore in invio email ' + error.message);
                                this.handleError(error);
                                console.log(error.message);
                                this.type = 'error';
                                this.Message = 'errore in registraRichiestaAdesione: ' + error.message;
                                this.showNotification(this.type, this.Message);
                          });
                     }


                     async LetturaKeyLocalita(localita: string) {

                      let rc = await this.tlocalitaService.getbylocalita(localita).subscribe(
                         resp => {
                             if(resp['rc']  === 'ok') {
                                  // non faccio nulla
                               }
                             if(resp['rc']  === 'nf') {
                                this.creanuovaLocalita(localita);
                               }
                         },
                         error => {
                           console.log('onSubmit - error in verifica esistenza socio: ' + error.message);
                           this.isVisible = true;
                           this.alertSuccess = false;
                           this.type = 'error';
                           this.Message = 'Errore controllo se socio esistente' + '\n' + error.message;
                           this.showNotification(this.type, this.Message);
                           console.log(error);
                         });

                     }


                   async creanuovaLocalita(localita: string) {
                     let rc = await  this.tlocalitaService.getLastLocalitaid().subscribe(
                       res => {
                             if(res['rc'] === 'ok') {
                                 this.localita = res['data'];
                                 this.keylocalita = this.localita.id + 1;

                                 console.log('creanuovalocalita - ' + JSON.stringify(this.localita) + ' keylocalita:' + this.keylocalita);
                                 this.localitanew = new Tlocalita();
                                 this.localitanew.d_localita = localita.toUpperCase();
                                 this.inserisciNuovaLocalita(this.localitanew);
                               }
                          },
                       error => {
                            console.log(error);
                            this.type = 'error';
                            this.Message = error.message;
                            this.alertSuccess = false;
                            this.showNotification( this.type, this.Message);
                         });
                   }


                   async inserisciNuovaLocalita(localita: Tlocalita) {
                    let rc = await  this.tlocalitaService.create(localita).subscribe(
                      res => {
                            if(res['rc'] === 'ok') {
                              // non faccio nulla
                             }
                         },
                      error => {
                           console.log(error);
                           this.type = 'error';
                           this.Message = error.message;
                           this.alertSuccess = false;
                           this.showNotification( this.type, this.Message);
                        });

                  }


//
// Show a notification
//
// @param {string} type    Notification type
// @param {string} message Notification message
//

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  //   alert('sono in notifier' + message);
  }



  handleResponse(data) {
    //  this.Token.handle(data.access_token);
      this.router.navigateByUrl('/profile');
    }

    handleError(error) {
      this.error = error.error.errors;
    }


      }


/*



                 }

               else {

                 console.log('vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare');



                 let res =  this.auth.sendAccountConfirmedLink
                                 (form.value.email, form.value.cognome, form.value.name, form.value.username, form.value.password)
                                 .subscribe(
                     resp => {
                           console.log('effettuata la send email per ' + form.value.email);
                     },
                   error => {
                     console.log('errore in invio email ' + error.message);
                   }
                 );
                 this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                 this.isVisible = true;
                 this.alertSuccess = true;

                 this.type = 'success';
                 this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                 this.showNotification(this.type, this.Message);
               }
          }
               if(resp['rc'] === 'nf') {

          }


        },
        error => {
          this.handleError(error);
          console.log(error.message);

          this.type = 'error';
          this.Message = 'errore in registrazione: ' + error.message;
          this.showNotification(this.type, this.Message);
        });


  }

*/
















    /*



          onSubmit(form: NgForm) {
       // alert('sono in submit');
        console.log('sono in submit -----------  ' );
    // determino la giornata








        // effettuo una verifica su user se presenti utenti con la stessa mail









      handleResponse(data) {
      //  this.Token.handle(data.access_token);
        this.router.navigateByUrl('/profile');
      }

      handleError(error) {
        this.error = error.error.errors;
      }




    showNotification( type: string, message: string ): void {
      this.notifier.notify( type, message );
    }

    nuovaPrenotazione() {
      this.form.cognome = '';
      this.form.name = '';
      this.form.email = '';
      this.form.telefono = '';
      this.form.persone = '';
      this.visibleConferma = true;

    }






























}



/*


@Component({
  selector: 'app-request-prenotazione',
  templateUrl: './request-prenotazione.component.html',
  styleUrls: ['./request-prenotazione.component.css']
})
export class RequestPrenotazioneComponent implements OnInit {

  public form = {
    cognome: '',
    name: '',
    email: '',
    telefono: '',
    datapre: null,
    persone: ''
  };






  constructor(private router: Router,
              private datePipe: DatePipe,
              private prenotazioneConfirmService: PrenotazioneConfirmService,
              private auth: AuthService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

  ngOnInit(): void {
      console.log('request-prenotazione -----  onInit');
      // recupero la manifestazione attiva per caricare le giornate
      this.visibleConferma = true;
     // this.manifAttiva(this.manifActive);

  }


  nuovaPrenotazione() {
    this.form.cognome = '';
    this.form.name = '';
    this.form.email = '';
    this.form.telefono = '';
    this.form.persone = '';
    this.visibleConferma = true;

  }

  onSubmit(form: NgForm) {
    // alert('sono in submit');
     console.log('sono in submit -----------  ' );
 // determino la giornata
  }



/*
  manifAttiva(stato: number) {
    this.manifService.getManifbyStato(stato).subscribe(
      response => {
        // visualizzo i dati della prima manifestazione attiva che trovo
        // ce ne deve essere una solo attiva
          if(response['number'] > 0) {
            console.log('manifAttiva ----------- ' + JSON.stringify(response['data']));
            this.sanfraActive = true;
            this.manif = response['data'];
            this.manAct = this.manif.id;
            this.loadGiornate(this.manif.id);
       //     alert('la manifestazione attive è: ' + this.manAct);
          } else {
            this.isVisible = true;
            this.alertSuccess = false;
            this.sanfraActive = false;
            this.Message = "Nessuna Manifestazione attiva \n funzione non eseguibile";
            this.type = 'error';
            this.showNotification(this.type, this.Message);
          }
      },
      error => {
         alert('Manif-Data  --loadManifestazione: ' + error.message);
         console.log(error);
      }
    )
  }




 loadGiornate(id: number) {

  console.log('request-prenotazione -------  loadGiornate ' + id);
    this.giornataService.getGiornatebyManif(id).subscribe(
     res => {
           this.giornate = res['data'];
        },
       error => {
          alert('Request-Prenotazione  -- loadGiornate - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }

  selectedGiornata(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
      if(selectedValue === 99) {

     //   alert('selezionato: ---  uscito errato ' );
        this.type = 'error';
        this.Message = 'selezione non corrette';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;

    } else {
    //  alert('selezionato: ------------- uscito corretto');
      this.giornataService.getGiornata(selectedValue).subscribe(
          resp => {
            this.giornata = resp['data'];
            this.dataSelected = this.datePipe.transform(this.giornata.dtGiornata, 'dd-MM-yyyy');  //this.giornata.dtGiornata;
            this.dataPrenotata = this.giornata.dtGiornata;
            console.log('data selezionata: ' + this.dataSelected + ' dataPrenotata: ' + this.dataPrenotata);
          },
          error => {
            this.isVisible = true;
            this.alertSuccess = false;
            console.log(error);
            this.Message = error.message;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
          });
       }
    }


  onSubmit(form: NgForm) {
   // alert('sono in submit');
    console.log('sono in submit -----------  ' );
// determino la giornata








    // effettuo una verifica su user se presenti utenti con la stessa mail
    this.prenotazioneConfirmService.getPreConfirmbyEmail(form.value.email).subscribe(
        resp => {
               if(resp['rc'] === 'ok') {
                this.datagiaRichiesta  = false;
                console.log('onsubmit - verifica se posso inviare mail: ' + JSON.stringify(resp['data']));
                this.prens = resp['data'];
                this.numPre = resp['number'];
                if(this.numPre !== 0) {
                   console.log('n.ro di prenotazioni trovate con la mail ' + this.numPre);
                   for(let pren of this.prens) {
                      this.datapre = this.datePipe.transform(pren.datapren, 'dd-MM-yyyy');
                      console.log('data selezionata: ' + this.dataSelected);
                      console.log('datapre: ' + this.datapre);
                      if(this.datapre === this.dataSelected) {
                        this.datagiaRichiesta  = true;
                      }
                   }
                   if(this.datagiaRichiesta  === true) {
                    this.Message = 'Prenotazione già eseguita  - inserimento non consentito';
                    this.isVisible = true;
                    this.alertSuccess = false;

                    this.type = 'error';
                    this.showNotification(this.type, this.Message);

                    return;
                  }  else  {
                   console.log('vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare ----->  2');

                  }
                 }

               else {

                 console.log('vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare');



                 let res =  this.auth.sendAccountConfirmedLink
                                 (form.value.email, form.value.cognome, form.value.name, form.value.username, form.value.password)
                                 .subscribe(
                     resp => {
                           console.log('effettuata la send email per ' + form.value.email);
                     },
                   error => {
                     console.log('errore in invio email ' + error.message);
                   }
                 );
                 this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                 this.isVisible = true;
                 this.alertSuccess = true;

                 this.type = 'success';
                 this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                 this.showNotification(this.type, this.Message);
               }
          }
               if(resp['rc'] === 'nf') {

                this.cognome = form.value.cognome;
                this.nome = form.value.name;
                this.email = form.value.email;

                console.log('merda   -------------------        vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare');


                const res =  this.prenotazioneConfirmService.registerConfermetPrenotazioneMoreno
                              (this.cognome.toLowerCase(), this.nome.toLowerCase(), this.email.toLowerCase(),
                              form.value.telefono, this.dataSelected , form.value.persone, this.giornata.id)
                              .subscribe(
                     resp => {
                             console.log('effettuata la send email per ' + form.value.email);
                             this.visibleConferma = false;
                             this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                             this.isVisible = true;
                             this.alertSuccess = true;

                             this.type = 'success';
                             this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                             this.showNotification(this.type, this.Message);
                          },
                     error => {
                            console.log('errore in invio email ' + error.message);
                      });

          }


        },
        error => {
          this.handleError(error);
          console.log(error.message);

          this.type = 'error';
          this.Message = 'errore in registrazione: ' + error.message;
          this.showNotification(this.type, this.Message);
        });


  }









  handleResponse(data) {
  //  this.Token.handle(data.access_token);
    this.router.navigateByUrl('/profile');
  }

  handleError(error) {
    this.error = error.error.errors;
  }




showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}

nuovaPrenotazione() {
  this.form.cognome = '';
  this.form.name = '';
  this.form.email = '';
  this.form.telefono = '';
  this.form.persone = '';
  this.visibleConferma = true;

}


  /*
  show() {
    this.type = "text"
  }
  hide() {
    this.type = "password"
  }
  */


// importante

/*
 la fase di creazione effettiva utente va spostata nella form di conferma (response-signup)

*/
            /*
                let resp =  this.auth.signUp(form.value.cognome, form.value.name, form.value.username, form.value.email, form.value.password);
                if (resp) {
                     console.log('resp - dopo creazione utente ' + resp.);
                     let res =  this.auth.sendAccountConfirmedLink(form.value.email);
                    this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                    this.isVisible = true;
                    this.alertSuccess = true;

                    this.type = 'success';
                    this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                    this.showNotification(this.type, this.Message);
                   }
                     */


/*


/* ------------------------------------------------   buttare
async  inviataMail(form.value.email: NgForm) {

    const resp = await this.auth.sendAccountConfirmedLink(form.value.email).subscribe(
      resp => {
                this.handleResponse(resp);
           console.log(' -------------1------ ?' + resp);
                this.type = 'success';
           this.Message = 'inviata richiesta di reset password per utente ';
           this.showNotification(this.type, this.Message);

//alert(resp.cognome + ' loggatao correttamente');
           this.Message = 'inviata richiesta di reset password per utente ';
           this.isVisible = true;
           this.alertSuccess = true;
      },
      error => {
           this.Message = error.error.error;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
//  messaggio sulla barra

           this.isVisible = true;
           this.alertSuccess = false;

      });

  }

*/










