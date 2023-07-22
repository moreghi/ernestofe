// versione originale in cui effettuavo registrazione multipla -- problemi di visualizzazione prenotazioni inserite
// modificata con gestione seconda pagina 2023/06/10

// esempio di notify
// https://stackblitz.com/edit/angular-notifier-demo?file=src%2Fapp%2Fapp.component.html

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../../../classes/Manifestazione';
import { Evento} from '../../../../../classes/Evento';
import { Ttipobiglietto} from '../../../../../classes/T_tipo_biglietto';
import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';
import { PrenotazeventomasterConfirm } from '../../../../../classes/PrenotazeventomasterConfirm';
import { Bandieragialla } from '../../../../../classes/BandieraGialla';
import { EventoPosto } from '../../../../../classes/Eventoposto';
import { W_Prenotazevento } from '../../../../../classes/W_Prenotazevento';
import { W_Prenotazevento_master } from '../../../../../classes/W_Prenotazevento_master';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';
import { TtipobigliettoService } from '../../../../../services/ttipobiglietto.service';
import { ManifestazioneService } from '../../../../../services/manifestazione.service';
import { EventoService } from '../../../../../services/evento.service';
import { PrenotazeventomasterConfirmService } from '../../../../../services/prenotazeventomaster-confirm.service';
import { BandieragiallaService } from '../../../../../services/bandieragialla.service';
import { EventopostoService } from '../../../../../services/eventoposto.service';
import { W_PrenotazeventoService } from '../../../../../services/w_prenotazevento.service';
import { W_PrenotazeventomasterService } from '../../../../../services/w_prenotazeventomaster.service';


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
    cognomeu: '',
    nomeu: '',
    emailu: '',
    telefonou: '',
    datapre: null

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
  public tipobiglietto: Ttipobiglietto;
  public tipibigliettonull: Ttipobiglietto[] = [];
  public manif: Manifestazione;
  public evento: Evento;
  public prenotazeventomasterConfirm: PrenotazeventomasterConfirm;
  public bandieragialla: Bandieragialla;
  public eventoPosto: EventoPosto;
  public wprenotazevento: W_Prenotazevento;
  public wprenotazeventi: W_Prenotazevento[] = [];
  public wprenotazevento_master: W_Prenotazevento_master;

   public selectedObject: string = 'pippo';


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
  faUserEdit = faUserEdit;

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
  public createdRegistration = false;
  public prenotMultipla = false;
  public bigliettoRidotto = false;
  public datadelGiorno = '';
  public dataeventoddmmyyyy = '';
  public idYellowFlag = 1;
  public token = '';
  public presentiPrenotazioni = false;
  public dataOdierna;
  public datadioggi = '';
  public importoBiglietto = 0;
  public importoTotb = 0;
  public abilitaPrenotazione = false;
  public idtipologiabiglietto = 0;

  constructor(private prenotazeventoConfirmService: PrenotazeventoConfirmService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private tipobigliettoService: TtipobigliettoService,
              private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
              private bandieragiallaService: BandieragiallaService,
              private eventopostoService: EventopostoService,
              private wprenotazeventoService: W_PrenotazeventoService,
              private wprenotazeventomasterService: W_PrenotazeventomasterService,
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


/*
  attenzione: reimpostare i campi del form  dopo inserimento multiplo
               form.value.cognome =  localStorage.getItem('preMultipla_Cognome');
                      form.value.nome = localStorage.getItem('preMultipla_Nome');
                      form.value.email = localStorage.getItem('preMultipla_Email');
                      form.value.telefono = localStorage.getItem('preMultipla_Telefono');

*/



              goApplication() {
                console.log('goApplication - request evento normal --------  appena entrato');

                const date = Date();
                this.dataOdierna = new Date(date);
                this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');

                console.log('goApplication  -- datadioggi ' + this.datadioggi)

                this.isVisible = true;
                this.createdRegistration = false;
                this.prenotMultipla = false;
                this.bigliettoRidotto = false;
                this.presentiPrenotazioni = false;
                this.abilitaPrenotazione = false;


                this.visibleConferma = true;
                this.alertSuccess = true;
                this.route.paramMap.subscribe(p => {
                this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
                this.loadBandieragialla(this.idYellowFlag);
                // gestione token
                this.token = "nf";
                this.token = localStorage.getItem('tokenPrenotazione');
                console.log('ho verificato se esisteva il token ' + this.token);
                if(this.token === null) {
                  this.token = (Math.random() + 1).toString(36).substring(2,7);
                  console.log('non esiste il localstorage ...tokenPrenotazione... ----  creato ' + this.token)
                  localStorage.setItem('tokenPrenotazione', this.token);

                } else {
                  this.token = localStorage.getItem('tokenPrenotazione');
                  this.prenotMultipla = true;
                  console.log('ESISTE il localstorage ...tokenPrenotazione...')
                }


                this.loadEvento(this.idpassed);
                this.Message = 'pronto per registrazione evento';
                });
           }


    async loadBandieragialla(id: number) {

            console.log('frontend - loadBandieragialla: ' + id);
            let rc = await  this.bandieragiallaService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                  this.bandieragialla = response['data'];
               }
              if(response['rc'] === 'nf') {
                this.Message = response['message'];
                this.type = 'error';
                this.showNotification( this.type, this.Message);
              }
            },
              error => {
              alert('loadBandieragialla: ' + error.message);
              console.log(error);
              this.alertSuccess = false;
              this.Message = error.message;
              this.type = 'error';
              this.showNotification( this.type, this.Message);
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
                        // verifico se effettuate prenotazioni precedenti
                     this.token = localStorage.getItem('tokenPrenotazione');
                     console.log('ho verificato se esisteva il token ' + this.token);
                     if(this.token !== null) {

                       this.loadPostiPrenotati(this.token);
                      }
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

//  attenzione   leggere da w_prenotaz




    async loadPostiPrenotati(token: string) {
            console.log('frontend - loadPostiPrenotati: ' + token);
            let rc = await this.wprenotazeventoService.getAllbytoken(token).subscribe(
                response => {
                  if(response['rc'] === 'ok') {
                    console.log('loadPostiPrenotati  ' + JSON.stringify(response['data']));
                    this.wprenotazeventi = response['data'];
                    this.presentiPrenotazioni = true;
                    this.abilitaPrenotazione = true;
                    this.importoTotb = response['totale'];
                  }
                 },
                  error => {
                        alert('loadPostiPrenotati: ' + error.message);
                        console.log(error);
                        this.alertSuccess = false;
                        this.Message = error.message;
                        this.type = 'error';
                        this.showNotification( this.type, this.Message);
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


         async  prenota() {

                  if(this.prenotMultipla === true) {
                    this.prenotazeventomasterConfirm = new PrenotazeventomasterConfirm();
                    this.prenotazeventomasterConfirm.idEvento = this.evento.id;
                    this.prenotazeventomasterConfirm.cognome = localStorage.getItem('preMultipla_Cognome');
                    this.prenotazeventomasterConfirm.nome = localStorage.getItem('preMultipla_Nome');
                    this.prenotazeventomasterConfirm.email = localStorage.getItem('preMultipla_Email');
                    this.prenotazeventomasterConfirm.telefono  = localStorage.getItem('preMultipla_Telefono');
                    this.prenotazeventomasterConfirm.token = this.token;
                    this.prenotazeventomasterConfirm.dataEvento = this.dataeventoddmmyyyy;  // this.evento.data;
                    this.prenotazeventomasterConfirm.datapren = this.datadelGiorno;
                    this.prenotazeventomasterConfirm.descEvento = this.evento.descrizione;
                    this.prenotazeventomasterConfirm.oraEvento = this.evento.ora;
                    this.prenotazeventomasterConfirm.importo = this.importoBiglietto
                    this.prenotazeventomasterConfirm.codpren = (Math.random() + 1).toString(36).substring(2,7);
                    this.prenotazeventomasterConfirm.iban = this.bandieragialla.iban;

                    //this.dataev =  this.datePipe.transform(this.evento.data, 'dd/MM/yyyy');

                    console.log('pronto per registare il Maste: ' + JSON.stringify(this.prenotazeventomasterConfirm));

                     let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
                       res => {
                             if(res['rc'] === 'ok') {
                              this.invioemail(this.prenotazeventomasterConfirm);
                              this.abilitaPrenotazione = false;
                              localStorage.removeItem('tokenPrenotazione');
                              localStorage.removeItem('preMultipla_Cognome');
                              localStorage.removeItem('preMultipla_Nome');
                              localStorage.removeItem('preMultipla_Email');
                              localStorage.removeItem('preMultipla_Telefono');
                                   console.log('------- creato correttamente file Master ----  inviata  mail ora -----------     ');
                                 }
                          },
                         error => {
                            console.log(error);
                            this.type = 'error';
                            this.Message = error.message;
                            this.alertSuccess = false;
                            this.showNotification( this.type, this.Message);
                         });
                  } else {
                    this.invioemail(this.prenotazeventomasterConfirm);
                    this.abilitaPrenotazione = false;
                    localStorage.removeItem('tokenPrenotazione');
                  }
              }

                async invioemail(prenotazeventomasterConfirm: PrenotazeventomasterConfirm) {
                  console.log('invioemail - appena entrato: ' + JSON.stringify(prenotazeventomasterConfirm))
                  let rc = await  this.prenotazeventomasterConfirmService.invioemail(prenotazeventomasterConfirm).subscribe(
                    res => {
                          if(res['rc'] === 'ok') {
                              this.type = 'success';
                              this.Message = 'Prenotazione registrata correttamente. controllare email del richiedente';          //'utente aggiornato con successo del cazzo';
                              this.alertSuccess = true;
                              this.showNotification( this.type, this.Message);
                          //              this.router.navigate(['/socio']);
                                console.log('------- inviato email  -------     ');
                              }
                       },
                      error => {
                         console.log(error);
                         this.type = 'error';
                         this.Message = error.error.message;
                         this.alertSuccess = false;
                         this.showNotification( this.type, this.Message);
                      });
                  }




                onSelectedtipoBiglietto(selectedValue: number) {
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
                          this.tipobiglietto = resp['data'];
                          this.selectedtipobiglietto = this.tipobiglietto.id;
                          this.idtipologiabiglietto = this.tipobiglietto.idtipotaglia;
                          this.importoBiglietto = this.tipobiglietto.importo;
                          this.bigliettoRidotto = false;
                          if(this.tipobiglietto.d_tipo === 'RIDOTTO') {
                            this.bigliettoRidotto = true;
                          }
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

              nuovaPrenotazione(form: NgForm) {
                 console.log('nuovaPrenotazione: ------- form.value.cognomeu: ' + form.value.cognomeu);
                if(this.prenotMultipla === true) {
                  form.value.cognomeu = '';
                  form.value.nomeu = '';
                  form.value.emailu = '';
                  form.value.telefonou = '';
                  this.visibleConferma = true;
                } else {
                  form.value.cognome = '';
                  form.value.nome = '';
                  form.value.email = '';
                  form.value.telefono = '';
                  form.value.cognomeu = '';
                  form.value.nomeu = '';
                  form.value.emailu = '';
                  form.value.telefonou = '';
                  this.visibleConferma = true;
                  this.createdRegistration = false;
                  this.presentiPrenotazioni = false;
                  localStorage.removeItem('tokenPrenotazione');
                  this.goApplication();
                }



              }
// per registrare richiesta di prenotazione su w_prenotav...

// fare bottone rilascia per effettuare invio email e creare eventoPosto


              onSubmit(form: NgForm) {
                // alert('sono in submit');
                console.log('sono in submit -----------  ' );

                if(this.selectedtipobiglietto == 99) {
                  alert('manca selezione tipo biglietto - prenotazione non possibile');
                  return;
                }
                if(this.prenotMultipla === true) {
                  if(this.form.cognomeu = '') {
                    this.Message = 'per prenotazione multipla devi inserire il cognome partecipante';
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.showNotification(this.type, this.Message);
                    return;
                  }
                  if(this.form.nomeu = '') {
                    this.Message = 'per prenotazione multipla devi inserire il nome partecipante';
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.showNotification(this.type, this.Message);
                    return;
                  }
                  if(this.form.emailu = '') {
                    this.Message = 'per prenotazione multipla devi inserire email partecipante';
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.showNotification(this.type, this.Message);
                    return;
                  }
               }
               if(this.tipobiglietto.d_tipo === 'RIDOTTO' && this.bigliettoRidotto === false) {
                this.Message = 'manca conferma di poter aver diritto alle agevolazion per prezzo ridotto';
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
                return;
              }
// registro la richiesta


const dataxx = new Date();

let dd = dataxx.getDate();
let mm = dataxx.getMonth() + 1;
let yyyy = dataxx.getFullYear();
let dd_s: string;
let mm_s: string;
let yyyy_s: string;

if(dd < 10) {
  dd_s = "0" + dd.toString();
}else {
  dd_s =  dd.toString();
}

if(mm < 10) {
  mm_s = "0" + mm.toString();
} else {
  mm_s =  mm.toString();
}
console.log('dd ' + dd_s + ' mm ' + mm_s + 'yyyy: ' + yyyy);  // funziona
this.datadelGiorno = dd_s + '-' + mm_s + '-' + yyyy;

dd_s = this.evento.data.slice(8);
mm_s = this.evento.data.slice(5, 7);
yyyy_s = this.evento.data.slice(0, 4);
//console.log('dd_s ' + dd_s);
//console.log('mm_s ' + mm_s);
//console.log('yyyy_s ' + yyyy_s);
this.dataeventoddmmyyyy = dd_s + '-' + mm_s + '-' + yyyy_s;

if(this.prenotMultipla === true) {
 //  this.registrapronotazioneMultiplaOld(form);    vecchia versione
  this.registrapronotazioneMultipla(form);
  } else {
    this.registrapronotazioneSingola(form);
  }
}

registrapronotazioneMultipla(form: NgForm) {
    this.registraWprenotaEvento(form);
    this.registraPosto(form);

}




async registraWprenotaEvento(form: NgForm) {

  if(form.value.cognomeu === ''  &&
     form.value.nomeu === '' &&
     form.value.emailu === '') {
     return;
     }

  this.wprenotazevento = new W_Prenotazevento;
  this.wprenotazevento.cognome  = form.value.cognomeu;
  this.wprenotazevento.nome  = form.value.nomeu;
  if(this.bigliettoRidotto === true) {
    this.wprenotazevento.scontabile  = 'S';
  }  else {
    this.wprenotazevento.scontabile  = 'N';
  }

  this.wprenotazevento.telefono  = form.value.telefonou;
  this.wprenotazevento.email  = form.value.emailu;
  this.wprenotazevento.idevento  = this.evento.id;
  this.wprenotazevento.idlogistica  = 0;
  this.wprenotazevento.idTipoBiglietto  = this.tipobiglietto.idtipotaglia;     // this.selectedtipobiglietto;
  this.wprenotazevento.idPosto  = 0;
  this.wprenotazevento.datapren  = this.datadelGiorno;
  this.wprenotazevento.persone  = 1;
  this.wprenotazevento.token = this.token;
  this.wprenotazevento.idstato  = 1

  console.log('pronto per registare il wprenotazevento: ' + JSON.stringify(this.wprenotazevento));

  let rc = await  this.wprenotazeventoService.create(this.wprenotazevento).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.type = 'success';
              this.Message = 'Creato correttamente prenotazione -- per renderla effettiva premi Rilascia';          //'utente aggiornato con successo del cazzo';
              this.alertSuccess = true;
              this.showNotification( this.type, this.Message);
              console.log('------- Creato correttamente prenotazione ----  da rilasciare -----------     ');
              if(this.prenotMultipla === true) {
                this.presentiPrenotazioni = false;
                if(this.token !== null) {
                        this.loadPostiPrenotati(this.token);
                }
              }
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
async registrapronotazioneSingola(form: NgForm) {  // ok

// per la prenotazione singola imposto i dati del richiedente come del utente

form.value.cognomeu = form.value.cognome;
form.value.nomeu = form.value.nome;
form.value.emailu = form.value.email;
form.value.telefonou = form.value.telefono;
// salvo i dati per visualizzare prenotazione eseguita
this.registraWprenotaEvento(form);

this.prenotazeventomasterConfirm = new PrenotazeventomasterConfirm();
this.prenotazeventomasterConfirm.idEvento = this.evento.id;
this.prenotazeventomasterConfirm.cognome = form.value.cognome;
this.prenotazeventomasterConfirm.nome = form.value.nome;
this.prenotazeventomasterConfirm.email = form.value.email;
this.prenotazeventomasterConfirm.telefono = form.value.telefono;
this.prenotazeventomasterConfirm.token = this.token;
this.prenotazeventomasterConfirm.dataEvento = this.dataeventoddmmyyyy;  // this.evento.data;
this.prenotazeventomasterConfirm.datapren = this.datadelGiorno;
this.prenotazeventomasterConfirm.descEvento = this.evento.descrizione;
this.prenotazeventomasterConfirm.oraEvento = this.evento.ora;
this.prenotazeventomasterConfirm.importo = this.importoBiglietto
this.prenotazeventomasterConfirm.codpren = (Math.random() + 1).toString(36).substring(2,7);
this.prenotazeventomasterConfirm.iban = this.bandieragialla.iban;

//this.dataev =  this.datePipe.transform(this.evento.data, 'dd/MM/yyyy');

console.log('pronto per registare il Maste: ' + JSON.stringify(this.prenotazeventomasterConfirm));

 let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
   res => {
         if(res['rc'] === 'ok') {
             this.registraPosto(form);

               console.log('------- creato correttamente file Master ----  inviare mail ora -----------     ');
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

async registraPosto(form: NgForm) {  // ok

  if(this.prenotMultipla === true) {
    if(form.value.cognomeu === '' &&
       form.value.nomeu === '' &&
       form.value.emailu === '')
        return;
  }

  this.eventoPosto = new EventoPosto();
  this.eventoPosto.token = this.token;
  this.eventoPosto.keypren = this.token + form.value.email;
  this.eventoPosto.idEvento = this.evento.id;
  this.eventoPosto.tipobiglietto = this.idtipologiabiglietto;    //this.selectedtipobiglietto;
  this.eventoPosto.idlogistica = 0;
  this.eventoPosto.key_utenti_operation = 1
  this.eventoPosto.idFila = 0;
  this.eventoPosto.idSettore = 0;
  this.eventoPosto.idPosto = 0;
  this.eventoPosto.desposto = 'Evento senza prenotazione Posto';
  this.eventoPosto.stato = 1;
  this.eventoPosto.datapre =  this.datadelGiorno;
  if(this.prenotMultipla === true) {
      this.eventoPosto.cognome = form.value.cognomeu;
      this.eventoPosto.nome = form.value.nomeu;
      this.eventoPosto.email = form.value.emailu;
      this.eventoPosto.cellulare = form.value.telefonou;
    } else {
      this.eventoPosto.cognome = form.value.cognome;
      this.eventoPosto.nome = form.value.nome;
      this.eventoPosto.email = form.value.email;
      this.eventoPosto.cellulare = form.value.telefono;
    }
  //in caso di prenotazione singola i dati del referente sono quelli dell'utilizzatore

    let rc = await  this.eventopostoService.create(this.eventoPosto).subscribe(
      response => {
          if(response['rc'] === 'ok') {
            // gestisco i pulsanti Conferma e Nuovo
          //  this.visibleConferma = false;
            this.createdRegistration = true;
            // aggiorno posti prenotati su evento
            this.evento.npostipren = this.evento.npostipren + 1;
            this.aggiornapostiprenevento(this.evento);
            // aggiorno posti prenotati per il tipo biglietto
            this.tipobiglietto.npren = this.tipobiglietto.npren + 1;
            this.aggiornanprenbiglietto(this.tipobiglietto, form);



         }
      },
      error => {
          alert('registraPosto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'registraPosto --- Errore ' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
}



async aggiornapostiprenevento(evento: Evento) {

  let rc = await  this.eventoService.update(evento).subscribe(
    response => {
        if(response['rc'] === 'ok') {

      }
    },
    error => {
        alert('aggiornapostiprenevento: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'aggiornapostiprenevento --- Errore ' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}



async aggiornanprenbiglietto(tipobiglietto: Ttipobiglietto, form: NgForm) {

  let rc = await  this.tipobigliettoService.update(tipobiglietto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          if(this.prenotMultipla === true) {
            console.log('registratoPosto--- devo fare nuovaPrenotazione: Cognome ' + form.value.cognome);
            console.log('registratoPosto--- devo fare nuovaPrenotazione: CognomeU  -- ' + form.value.cognomeu);
            this.loadtipibiglietto(this.evento.id);
            this.token = localStorage.getItem('tokenPrenotazione');
            this.form.cognome = localStorage.getItem('preMultipla_Cognome');
            this.form.nome = localStorage.getItem('preMultipla_Nome');
            this.form.email = localStorage.getItem('preMultipla_Email');
            this.form.telefono  = localStorage.getItem('preMultipla_Telefono');

            this.form.cognomeu = '';
            this.form.nomeu = '';
            this.form.emailu = '';
            this.form.telefonou = '';
         }

         //  this.loadPostiPrenotati(this.token);
          /*
          this.alertSuccess = true;
          this.Message = 'Prenotazione Registrata correttamente';
          this.type = 'success';
          this.showNotification( this.type, this.Message);  */
      }
    },
    error => {
        alert('aggiornanprenbiglietto: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'aggiornanprenbiglietto --- Errore ' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
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

         console.log('registraprenotazionebigliettievento   --- parametri passati ----        vado a invaire la mail e creare laa prenotazione da confermare poi   ');
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




      prenotazioneMultipla(event) {
        //  console.log(event.target.checked)
        // alert('ho premuto: ' + event.target.checked );
        this.prenotMultipla = event.target.checked;
        if(this.prenotMultipla === true) {

          localStorage.removeItem('preMultipla_Cognome');
          localStorage.removeItem('preMultipla_Nome');
          localStorage.removeItem('preMultipla_Email');
          localStorage.removeItem('preMultipla_Telefono');

          localStorage.setItem('preMultipla_Cognome', this.form.cognome);
          localStorage.setItem('preMultipla_Nome', this.form.nome);
          localStorage.setItem('preMultipla_Email', this.form.email);
          localStorage.setItem('preMultipla_Telefono', this.form.telefono);
          this.form.cognomeu = this.form.cognome;
          this.form.nomeu = this.form.nome;
          this.form.emailu = this.form.email;
          this.form.telefonou = this.form.telefono;
        } else {
          this.form.cognomeu = '';
          this.form.nomeu = '';
          this.form.emailu = '';
          this.form.telefonou = '';
        }


        }

        proseguiRegistrazione(form: NgForm){

          if(this.form.cognome === '' || this.form.nome === '' || this.form.email === '') {
            this.Message = 'per proseguire con la registrazione valorizzare i dati del richiedente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
          }

          if(this.form.cognome = '') {
            this.Message = 'per proseguire con la registrazione inserire il cognome Richiedente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
          }
          if(this.form.nome = '') {
            this.Message = 'per proseguire con la registrazione inserire il nome Richiedente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
          }
          if(this.form.email = '') {
            this.Message = 'per prenotazione con la registrazione inserire email Richiedente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
          }

          localStorage.removeItem('preMultipla_Cognome');
          localStorage.removeItem('preMultipla_Nome');
          localStorage.removeItem('preMultipla_Email');
          localStorage.removeItem('preMultipla_Telefono');

          localStorage.setItem('preMultipla_Cognome', form.value.cognome);
          localStorage.setItem('preMultipla_Nome', form.value.nome);
          localStorage.setItem('preMultipla_Email', form.value.email);
          localStorage.setItem('preMultipla_Telefono', form.value.telefono);
          this.router.navigate(['/evento/registrazione/normal1/' + this.evento.id]);

        }


     }

/*
  2023/06/09  --- vecchi metodi non più utilizzati

registrapronotazioneMultiplaOld(form: NgForm) {

  this.loadwprenotazMaster(this.token, form)
  if(form.value.cognome !== '' &&
     form.value.nome !== '' &&
     form.value.email !== '') {
      this.registraWprenotaEvento(form);
      this.registraPosto(form);

     }
     this.visibleConferma = true;
}

async loadwprenotazMaster(token: string, form: NgForm) {

  let rc = await  this.wprenotazeventomasterService.getbytoken(token).subscribe(
    res => {
          if(res['rc'] === 'nf') {
               // creo istanza pergestire eventuali prenotazioni Multiple
            this.wprenotazevento_master = new W_Prenotazevento_master();
            this.wprenotazevento_master.descEvento = this.evento.descrizione;
            this.wprenotazevento_master.dataEvento = this.dataeventoddmmyyyy;
            this.wprenotazevento_master.oraEvento = this.evento.ora;
            this.wprenotazevento_master.datapren = this.datadelGiorno;
            this.wprenotazevento_master.cognome = form.value.cognome;
            this.wprenotazevento_master.nome = form.value.nome;
            this.wprenotazevento_master.telefono = form.value.telefono;
            this.wprenotazevento_master.email = form.value.email;
            this.wprenotazevento_master.token = this.token;
            this.wprenotazevento_master.importo = this.importoBiglietto;
            this.creawprenotazeventomaster(this.wprenotazevento_master, form);
            }
            if(res['rc'] === 'ok') {
              this.wprenotazevento_master.importo = this.wprenotazevento_master.importo +
              this.importoBiglietto;
              this.aggiornawprenotazeventomaster(this.wprenotazevento_master);
            }
       },
      error => {
         console.log(error);
         this.type = 'error';
         this.Message = error.error.message;
         this.alertSuccess = false;
         this.showNotification( this.type, this.Message);
      });
}

async creawprenotazeventomaster(wprenotazevento_master: W_Prenotazevento_master, form: NgForm) {

  let rc = await  this.wprenotazeventomasterService.create(wprenotazevento_master).subscribe(
    res => {
          if(res['rc'] !== 'ok') {
            localStorage.removeItem('preMultipla_Cognome');
            localStorage.removeItem('preMultipla_Nome');
            localStorage.removeItem('preMultipla_Email');
            localStorage.removeItem('preMultipla_Telefono');

            localStorage.setItem('preMultipla_Cognome', form.value.cognome);
            localStorage.setItem('preMultipla_Nome', form.value.nome);
            localStorage.setItem('preMultipla_Email', form.value.email);
            localStorage.setItem('preMultipla_Telefono', form.value.telefono);

            this.type = 'error';
            this.Message = 'errore in creazione master -- rc: ' + res['rc'];
            this.alertSuccess = false;
            this.showNotification( this.type, this.Message);
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

async aggiornawprenotazeventomaster(wprenotazevento_master: W_Prenotazevento_master) {

  let rc = await  this.wprenotazeventomasterService.update(wprenotazevento_master).subscribe(
    res => {
          if(res['rc'] !== 'ok') {
            this.type = 'error';
            this.Message = 'errore in update master -- rc: ' + res['rc'];
            this.alertSuccess = false;
            this.showNotification( this.type, this.Message);
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




*/





/*   attenzione --------------------  da fare

registrare i dati su w_prenotazevento e fare tabella su html con i dati delle richieste inserite

creare bottone rilascia che effettua la creazione dei record eventoPosto e invia email di conferma











import { EventoPosto } from '../../../classes/Eventoposto';
import { W_Prenotazevento } from '../../../classes/W_Prenotazevento';

import { W_PrenotazeventoService } from './../../../services/w_prenotazevento.service';
import { EventopostoService } from './../../../services/eventoposto.service';


public wprenotazeventieventoPostipren : EventoPosto[] = [];
public eventoPosti: EventoPosto[] = [];
public eventoPosto: EventoPosto;


     private eventopostoService: EventopostoService,
    private wprenotazeventoService: W_PrenotazeventoService,




//  non mi serve passare da w.prenotazevento  perchè creo direttamente eventoposto

async conferma() {
  //this.loadLogposto(this.wprenotazevento.idPosto);   attenzione


  this.eventoPosto.token = this.wprenotazevento.token;
  this.eventoPosto.keypren = this.wprenotazevento.token + this.wprenotazevento.email;
  this.eventoPosto.tipobiglietto = this.wprenotazevento.idTipoBiglietto;
  this.eventoPosto.cognome = this.eventoPostojob.cognome;
  this.eventoPosto.nome = this.eventoPostojob.nome;
  this.eventoPosto.cellulare = this.eventoPostojob.cellulare;
  this.eventoPosto.email = this.eventoPostojob.email;
  this.eventoPosto.stato =  1;

  let rc = await  this.eventopostoService.update(this.eventoPosto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          // devo aggiornare il posto

          this.evento.npostiDisponibili = this.evento.npostiDisponibili - 1;
          this.evento.npostipren = this.evento.npostipren + 1;
          let posti = 1;
          this.aggiornaEvento(this.evento);
       }
    },
    error => {
        alert('creaEventoPosto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'creaEventoPosto --- Errore ' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
  //   this.updatelogPosto(this.wprenotazevento);   da fare
  }























*/

/*   corretto


async conferma(wprenotazevento: W_Prenotazevento) {



console.log('pronto per registare il Maste: ' + JSON.stringify(this.prenotazeventomasterConfirm));

let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
  res => {
        if(res['rc'] === 'ok') {
            this.invioemail(this.prenotazeventomasterConfirm);
            this.abilitynewPrenot = true;

          //  this.type = 'success';
          //  this.Message = 'Creato correttamente file Master ----  da inviuare  email';          //'utente aggiornato con successo del cazzo';
          //  this.alertSuccess = true;
           // this.showNotification( this.type, this.Message);
        //              this.router.navigate(['/socio']);
              console.log('------- creato correttamente file Master ----  inviare mail ora -----------     ');
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


async invioemail(prenotazeventomasterConfirm: PrenotazeventomasterConfirm) {
  let rc = await  this.prenotazeventomasterConfirmService.invioemail(prenotazeventomasterConfirm).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.type = 'success';
              this.Message = 'Prenotazione registrata correttamente. controllare email del richiedente';          //'utente aggiornato con successo del cazzo';
              this.alertSuccess = true;
              this.showNotification( this.type, this.Message);
          //              this.router.navigate(['/socio']);
                console.log('------- inviato email  -------     ');
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






