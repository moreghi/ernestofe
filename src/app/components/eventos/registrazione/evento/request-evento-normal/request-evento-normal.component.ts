
// esempio di notify
// https://stackblitz.com/edit/angular-notifier-demo?file=src%2Fapp%2Fapp.component.html

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../../../classes/Manifestazione';
import { Evento} from '../../../../../classes/Evento';
import { Ttipobiglietto} from '../../../../../classes/T_tipo_biglietto';
import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';
import { TtipobigliettoService } from '../../../../../services/ttipobiglietto.service';
import { ManifestazioneService } from '../../../../../services/manifestazione.service';
import { EventoService } from '../../../../../services/evento.service';

import { AuthService } from '../../../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-evento-normal',
  templateUrl: './request-evento-normal.component.html',
  styleUrls: ['./request-evento-normal.component.css']
})
export class RequestEventoNormalComponent implements OnInit {


  public form = {
    cognome: '',
    nome: '',
    email: '',
    telefono: '',
    datapre: null,
    persone: ''
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
  public title = 'registrazione evento';
  public error = [];

  public prens: PrenotazeventoConfirm[] = [];
  public pren: PrenotazeventoConfirm;
  public tipibiglietto: Ttipobiglietto[] = [];
  public tipibigliettonull: Ttipobiglietto[] = [];
  public manif: Manifestazione;
  public evento: Evento;

  public datapre = '';
  public datagiaRichiesta = false;
  public selectedtipobiglietto = 0;
  public dataSelected = '';
  public dataPrenotata: string;       //Date;
  public numPre = 0;
  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public manifActive = 1;
  public manAct = 0;
  public sanfraActive = false;

  public cognome = '';
  public nome = '';
  public email = '';
  public telefono = '';
  public idevento = 0;
  public persone = 0;
  public dataev = '';

  public visibleConferma = true;
  public idpassed = 0;
  public dataEvento: Date;

  constructor(private prenotazeventoConfirmService: PrenotazeventoConfirmService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private tipobigliettoService: TtipobigliettoService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


              ngOnInit(): void {
                this.goApplication();
              }

              goApplication() {
                console.log('goApplication - request evento normal --------  appena entrato');

                this.isVisible = true;
                this.alertSuccess = true;
                this.route.paramMap.subscribe(p => {
                this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
                this.loadEvento(this.idpassed);
                this.Message = 'pronto per registrazione evento';
                });
           }

                async loadEvento(id: number) {
                  console.log('frontend - loadEvento: ' + id);
                  let rc = await  this.eventoService.getbyId(id).subscribe(
                  response => {
                  if(response['rc'] === 'ok') {
                    this.evento = response['data'];
                    this.dataEvento = new Date(this.evento.data);

                    this.loadManifestazione(this.evento.idmanif);
                    this.loadtipibiglietto(this.evento.id);
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




                selectedtipoBiglietto(selectedValue: number) {
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
                    this.tipobigliettoService.getbyid(selectedValue).subscribe(
                        resp => {
                          this.tipibiglietto = resp['data'];
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



                  async loadtipibiglietto(id: number) {
                    console.log('frontend - loadtipibiglietto: ' + id);
                    let rc = await  this.tipobigliettoService.getbyevento(id).subscribe(
                    response => {
                          if(response['rc'] === 'ok') {
                            this.tipibiglietto = response['data'];
                           }
                          if(response['rc'] === 'nf') {
                            this.tipibiglietto = this.tipibigliettonull;
                           }
                      },
                  error => {
                      alert('loadtipibiglietto: ' + error.message);
                      this.isVisible = true;
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.Message = 'Erroreloadtipibiglietto' + '\n' + error.message;
                      this.showNotification(this.type, this.Message);
                      console.log(error);
                  });

              }

              nuovaPrenotazione() {
                this.form.cognome = '';
                this.form.nome = '';
                this.form.email = '';
                this.form.telefono = '';
                this.form.persone = '';
                this.visibleConferma = true;
              }

              onSubmit(form: NgForm) {
                // alert('sono in submit');
                console.log('sono in submit -----------  ' );

                if(this.selectedtipobiglietto == 99) {
                  alert('manca selezione tipo biglietto - prenotazione non possibile');
                  return;
                }
                    // effettuo una verifica su user se presenti utenti con la stessa mail
                this.prenotazeventoConfirmService.getPreConfirmbyEmailUtente
                (form.value.email, form.value.cognome, form.value.nome, form.value.persone).subscribe(
                  resp => {
                     if(resp['rc'] === 'ok') {
                          this.Message = 'Prenotazione già eseguita  - inserimento non consentito';
                          this.isVisible = true;
                          this.alertSuccess = false;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                          return;
                        }
                     if(resp['rc'] === 'nf') {
                       console.log('registro la richiesta prenotazione biglietti per evento');
                       this.registraprenotazionebigliettievento(form);
                       console.log('effettuata la send email per ' + form.value.email);
                       alert('effettuata la send email per ' + form.value.email);
                       this.visibleConferma = false;
                       this.Message = 'utente ' + form.value.cognome + ' inviata mail di conferma registrazione evento';
                       this.isVisible = true;
                       this.alertSuccess = true;
                       this.type = 'success';
                       this.showNotification(this.type, this.Message);
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

  async registraprenotazionebigliettievento(form: NgForm) {
         this.cognome = form.value.cognome;
         this.nome = form.value.nome;
         this.email = form.value.email;
         this.telefono = form.value.telefono;
         this.idevento = this.evento.id;
         this.persone = form.value.persone;
         this.dataev =  this.datePipe.transform(this.evento.data, 'dd/MM/yyyy');     //                                   this.evento.data;

         console.log('merda   --- parametri passati ----        vado a invaire la mail e creare laa prenotazione da confermare poi   ');
         console.log('cognome:  ' + this.cognome);
         console.log('nome:  ' + this.nome);
         console.log('email:  ' + this.email);
         console.log('telefono:  ' + this.telefono);
         console.log('idevento:  ' + this.idevento);
         console.log('persone:  ' + this.persone);
         console.log('dataev:  ' + this.dataev);

         const res =  this.prenotazeventoConfirmService.registerConfermetPrenotazeventonormalMoreno
                            (this.cognome.toUpperCase(), this.nome.toUpperCase(), this.email.toLowerCase(),
                            this.telefono, this.idevento, this.persone, this.selectedtipobiglietto, this.dataev)
                            .subscribe(
                   resp => {
                              if(resp['rc'] === 'ok') {
                               // non faccio nulla
                              }

                       },
                   error => {
                          console.log('errore in invio email ' + error.message);
                          this.handleError(error);
                          console.log(error.message);
                          this.type = 'error';
                          this.Message = 'registraprenotazionebigliettievento: ' + error.message;
                          this.showNotification(this.type, this.Message);
                    });

      }




              }





/*






*/




















/*







// Models






@Component({
  selector: 'app-request-prenotazione',
  templateUrl: './request-prenotazione.component.html',
  styleUrls: ['./request-prenotazione.component.css']
})
export class RequestPrenotazioneComponent implements OnInit {




  ngOnInit(): void {
      console.log('request-prenotazione -----  onInit');
      // recupero la manifestazione attiva per caricare le giornate
      this.visibleConferma = true;
     // this.manifAttiva(this.manifActive);

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






