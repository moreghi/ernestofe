import { Component, OnInit } from '@angular/core';
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
  selector: 'app-request-evento-normal1',
  templateUrl: './request-evento-normal1.component.html',
  styleUrls: ['./request-evento-normal1.component.css']
})
export class RequestEventoNormal1Component implements OnInit {

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
  public utenteRe = false;
  public cognomeu = '';
  public nomeu = '';
  public emailu = '';
  public telefonou = '';


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

                this.token = localStorage.getItem('tokenPrenotazione');
                this.form.cognome = localStorage.getItem('preMultipla_Cognome');
                this.form.nome = localStorage.getItem('preMultipla_Nome');
                this.form.email = localStorage.getItem('preMultipla_Email');
                this.form.telefono  = localStorage.getItem('preMultipla_Telefono');

                this.visibleConferma = true;
                this.alertSuccess = true;
                this.route.paramMap.subscribe(p => {
                this.idpassed = +p.get('id');
                console.log('id recuperato: ' + this.idpassed);
                this.loadBandieragialla(this.idYellowFlag);
                this.token = localStorage.getItem('tokenPrenotazione');
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


          utentesameRegister(event) {

              this.utenteRe = event.target.checked;
                  if(this.utenteRe === true) {
                       this.form.cognomeu = localStorage.getItem('preMultipla_Cognome');;
                       this.form.nomeu = localStorage.getItem('preMultipla_Nome');
                       this.form.emailu =localStorage.getItem('preMultipla_Email');
                       this.form.telefonou = localStorage.getItem('preMultipla_Telefono');
                  } else {
                      this.form.cognomeu = '';
                      this.form.nomeu = '';
                      this.form.emailu = '';
                      this.form.telefonou = '';
              }


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


// per registrare richiesta di prenotazione su w_prenotav...

// fare bottone rilascia per effettuare invio email e creare eventoPosto


              onSubmit(form: NgForm) {
                // alert('sono in submit');
                console.log('sono in submit -----------  ' );

                if(this.selectedtipobiglietto == 99) {
                  alert('manca selezione tipo biglietto - prenotazione non possibile');
                  return;
                }
                //  controlli sui campi di registrazione
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

                  this.cognomeu = form.value.cognomeu;
                  this.nomeu = form.value.nomeu;
                  this.emailu = form.value.emailu;
                  this.telefonou = form.value.telefonou;

/*
console.log('dati utente -------  this.form.dddddddddd   ---------------- ')
console.log('dati utente ------ cognome ----------------- ' + this.cognomeu)
console.log('dati utente ------ nome ----------------- ' + this.nomeu)
console.log('dati utente ------ email ----------------- ' + this.emailu)
console.log('dati utente ------ telefono ----------------- ' + this.telefonou)




console.log('dati utente ----  secondo giro    form.value.ccccccccc  ------------------- ')
console.log('dati utente ------ cognome ----------------- ' + this.cognomeu)
console.log('dati utente ------ nome ----------------- ' + this.nomeu)
console.log('dati utente ------ email ----------------- ' + this.emailu)
console.log('dati utente ------ telefono ----------------- ' + this.telefonou)






return;
*/

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

    this.registraWprenotaEvento(this.cognomeu, this.nomeu, this.emailu, this.telefonou);
}

async registraWprenotaEvento(cognomeu: string, nomeu: string, emailu: string, telefonou: string) {

  this.wprenotazevento = new W_Prenotazevento;
  this.wprenotazevento.cognome  = cognomeu;
  this.wprenotazevento.nome  = nomeu;
  if(this.bigliettoRidotto === true) {
    this.wprenotazevento.scontabile  = 'S';
  }  else {
    this.wprenotazevento.scontabile  = 'N';
  }

  this.wprenotazevento.telefono  = telefonou;
  this.wprenotazevento.email  = emailu;
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
            this.registraPosto(cognomeu, nomeu, emailu, telefonou);
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



/*
la registrazione del master va fatto sul request-evento.normal (rilascia)

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




*/





async registraPosto(cognomeu: string, nomeu: string, emailu: string, telefonou: string) {  // ok
/*
  console.log('registraPosto ---- appena entrato ' );
  console.log('form.value.cognomeu: ' + form.value.cognomeu);
alert('controlla form')
return;
*/

  this.eventoPosto = new EventoPosto();
  this.eventoPosto.token = this.token;
  this.eventoPosto.keypren = this.token + emailu;
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

  this.eventoPosto.cognome =  cognomeu;   //               this.cognomeu;        //form.value.cognomeu;
  this.eventoPosto.nome = nomeu;      //this.nomeu;              //form.value.nomeu;
  this.eventoPosto.email = emailu;               //this.emailu;           //form.value.emailu;
  this.eventoPosto.cellulare = telefonou;   // this.telefonou;     //form.value.telefonou;



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
            this.aggiornanprenbiglietto(this.tipobiglietto);


            this.type = 'success';
            this.Message = 'Creato correttamente prenotazione -- per renderla effettiva premi Rilascia';          //'utente aggiornato con successo del cazzo';
            this.alertSuccess = true;
            this.showNotification( this.type, this.Message);
            console.log('------- Creato correttamente prenotazione ----  da rilasciare ----------- ');
            this.router.navigate(['/evento/registrazione/normal/' + this.evento.id]);
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



async aggiornanprenbiglietto(tipobiglietto: Ttipobiglietto) {

  let rc = await  this.tipobigliettoService.update(tipobiglietto).subscribe(
    response => {
        if(response['rc'] === 'ok') {


         //   this.loadtipibiglietto(this.evento.id);


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


}

