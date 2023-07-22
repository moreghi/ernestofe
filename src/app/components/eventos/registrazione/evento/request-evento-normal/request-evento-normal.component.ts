

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
                  localStorage.removeItem('preMultipla_Cognome');
                  localStorage.removeItem('preMultipla_Nome');
                  localStorage.removeItem('preMultipla_Email');
                  localStorage.removeItem('preMultipla_Telefono');

                } else {
                  this.token = localStorage.getItem('tokenPrenotazione');
                  this.form.cognome = localStorage.getItem('preMultipla_Cognome');
                  this.form.nome = localStorage.getItem('preMultipla_Nome');
                  this.form.email = localStorage.getItem('preMultipla_Email');
                  this.form.telefono  = localStorage.getItem('preMultipla_Telefono');
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

              nuovaPrenotazione() {
                   this.router.navigate(['/evento/registrazione/normal1/' + this.evento.id]);
              }
// per registrare richiesta di prenotazione su w_prenotav...

// fare bottone rilascia per effettuare invio email e creare eventoPosto


              onSubmit(form: NgForm) {

// non fa nulla. bottone confermaeliminato

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

