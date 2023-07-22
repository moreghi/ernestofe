
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../../../classes/Manifestazione';
import { Evento} from '../../../../../classes/Evento';
import { Ttipobiglietto} from '../../../../../classes/T_tipo_biglietto';
import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';
import { PrenotazeventomasterConfirm } from '../../../../../classes/PrenotazeventomasterConfirm';
import { LogSettore } from '../../../../../classes/Logsettore';
import { LogFila } from '../../../../../classes/Logfila';
import { Eventosettfilaposti } from '../../../../../classes/Eventosettfilaposti';
import { EventoPosto } from '../../../../../classes/Eventoposto';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';
import { PrenotazeventomasterConfirmService } from '../../../../../services/prenotazeventomaster-confirm.service';
import { TtipobigliettoService } from '../../../../../services/ttipobiglietto.service';
import { ManifestazioneService } from '../../../../../services/manifestazione.service';
import { EventoService } from '../../../../../services/evento.service';
import { LogsettoreService } from '../../../../../services/logsettore.service';
import { LogfilaService } from '../../../../../services/logfila.service';
import { EventosettfilapostiService } from '../../../../../services/eventosettfilaposti.service';
import { EventopostoService } from '../../../../../services/eventoposto.service';


import { AuthService } from '../../../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
// popup per gestione selezione settore/fila/posti
import { EventopostopopComponent } from '../../../../../components/popups/eventopostopop/eventopostopop.component';

@Component({
  selector: 'app-request-evento-logistica',
  templateUrl: './request-evento-logistica.component.html',
  styleUrls: ['./request-evento-logistica.component.css']
})
export class RequestEventoLogisticaComponent implements OnInit {

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
  public title = 'registrazione evento con Logistica';
  public error = [];

  public prens: PrenotazeventoConfirm[] = [];
  public pren: PrenotazeventoConfirm;
  public tipibiglietto: Ttipobiglietto[] = [];
  public tipibigliettonull: Ttipobiglietto[] = [];
  public manif: Manifestazione;
  public evento: Evento;
  //public logsettori: LogSettore[] = [];
  //public logfile: LogFila[] = [];
  public eventosettfilaposti: Eventosettfilaposti[] = [];
  public eventosettfilaposti1: Eventosettfilaposti[] = [];
  public eventosettfilapostienull: Eventosettfilaposti[] = [];
  public eventoposto: EventoPosto;
  public eventoposti: EventoPosto[] = [];
  public prenotazeventomasterConfirm: PrenotazeventomasterConfirm;

  public datapre = '';
  public datagiaRichiesta = false;


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
  public statoAttivo = 0;
  public prenotatiposti = false;
  public keyuserpren = '';
  public keyuserpren_cognome = '';
  public keyuserpren_nome = '';
  public nrich = 0;

  // per invio email di conerma richieste di gruppo
  public sendemail_address = '';
  public sendemail_cognome = '';
  public sendemail_nome = '';
  public sendemail_dataev = '';
  public sendemail_keyuserpren = '';
  public sendemail_descevento = '';

  public codpren = '';
  public token = '';

  // per paginazone
  p: number = 1;

  public registratoevento = false;



  constructor(private prenotazeventoConfirmService: PrenotazeventoConfirmService,
              private eventosettfilapostiService: EventosettfilapostiService,
              private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private eventopostoService: EventopostoService,
              private tipobigliettoService: TtipobigliettoService,
              private logsettoreService: LogsettoreService,
              private logfilaService: LogfilaService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              public modalService: NgbModal,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


              ngOnInit(): void {

                this.goApplication();
              }


              goApplication() {
                console.log('goApplication - request evento con logistica --------  appena entrato');
                this.registratoevento = false;
                this.resetlocalStorage();
                this.prenotatiposti = false;
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

             }

          },
          error => {
              alert('Manif-Data  --loadEvento: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore loadEvento' + '\n' + error.message;
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

        nuovaPrenotazione() {
          this.form.cognome = '';
          this.form.nome = '';
          this.form.email = '';
          this.form.telefono = '';
          this.form.persone = '';
          this.visibleConferma = true;
        }



        resetlocalStorage() {
          localStorage.removeItem('keyuserpren');
          localStorage.removeItem('keyuserpren_cognome');
          localStorage.removeItem('keyuserpren_nome');
          localStorage.removeItem('keyuserpren_email');
          localStorage.removeItem('keyuserpren_telefono');
          localStorage.removeItem('keyuserpren_datapren');
          localStorage.removeItem('keyuserpren_stato');

          localStorage.removeItem('keyuserpren_idevento');
          localStorage.removeItem('keyuserpren_idlogistica');
          localStorage.removeItem('keyuserpren_idsettore');
          localStorage.removeItem('keyuserpren_idfila');
          localStorage.removeItem('keyuserpren_idposto');
          localStorage.removeItem('keyuserpren_idtipobiglietto');
        }







        rilasciaRichieste() {
          alert('sono in submit  ------  da adattara e scelta con logistica');
          console.log('sono in submit -----------  ' );
          // creare il record master
          this.creaprenotazeventomasterConfirm();


         // this.invioemailperconferma();




          // leggo le richieste e faccio inserimento su pronotazeventoConfirm e poi mando la mail
          // this.loadEventoPostiprenotati(this.keyuserpren);


       }





   async   creaprenotazeventomasterConfirm() {

        console.log('creaprenotmaster: ' + localStorage.getItem('keyuserpren_idevento'));
        let merdaxx = 0;
        merdaxx = +localStorage.getItem('idevento');
        console.log('dopo normalizzazione a numero: ' + merdaxx);

        this.prenotazeventomasterConfirm = new  PrenotazeventomasterConfirm();
        this.prenotazeventomasterConfirm.cognome = localStorage.getItem('keyuserpren_cognome');
        this.prenotazeventomasterConfirm.nome = localStorage.getItem('keyuserpren_nome');
        this.prenotazeventomasterConfirm.email = localStorage.getItem('keyuserpren_email');
        this.prenotazeventomasterConfirm.telefono = localStorage.getItem('keyuserpren_telefono');

        this.prenotazeventomasterConfirm.datapren = localStorage.getItem('keyuserpren_datapren');
       // this.prenotazeventomasterConfirm.idevento = +localStorage.getItem('keyuserpren_idevento');
      //  this.prenotazeventomasterConfirm.devento = this.evento.descrizione;

        let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
                response => {
                      if(response['rc'] === 'ok') {
                      this.codpren = response['codpren'];
                      this.token = response['token'];
                      console.log('inviata email conferma - codpren: ' + this.codpren + ' token: ' + this.token);
                      // leggo le richieste e faccio inserimento su pronotazeventoConfirm -- mail appena inviata al capogruppo
                      this.loadEventoPostiprenotati(this.keyuserpren, this.codpren, this.token);
                      this.registratoevento = true;
                      }
                },
                error => {
                      alert('invioemailperconferma: ' + error.message);
                      this.isVisible = true;
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.Message = 'Errore invioemailperconferma' + '\n' + error.message;
                      this.showNotification(this.type, this.Message);
                      console.log(error);
                });
    }

/*    vecchia modalità - ora prima creo il record master e poi dai posti creo le conferme dei figli


   async   invioemailperconferma() {

        this.sendemail_address = localStorage.getItem('keyuserpren_email');
        this.sendemail_cognome = localStorage.getItem('keyuserpren_cognome');
        this.sendemail_nome = localStorage.getItem('keyuserpren_nome');
        this.sendemail_dataev = this.datePipe.transform(this.evento.data,"dd-MM-yyyy");
        this.sendemail_keyuserpren = localStorage.getItem('keyuserpren');
        this.sendemail_descevento = this.evento.descrizione;

        let rc = await  this.prenotazeventoConfirmService.getbysendmailconfirmedpren(this.sendemail_address,
                                                                                     this.sendemail_cognome,
                                                                                     this.sendemail_nome,
                                                                                     this.sendemail_dataev,
                                                                                     this.sendemail_keyuserpren,
                                                                                     this.sendemail_descevento).subscribe(
                response => {
                  if(response['rc'] === 'ok') {
                    this.codpren = response['codpren'];
                    this.token = response['token'];
                    console.log('inviata email conferma - codpren: ' + this.codpren + ' token: ' + this.token);
                   // leggo le richieste e faccio inserimento su pronotazeventoConfirm -- mail appena inviata al capogruppo
                    this.loadEventoPostiprenotati(this.keyuserpren);
                  }
                },
                error => {
                    alert('invioemailperconferma: ' + error.message);
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.Message = 'Errore invioemailperconferma' + '\n' + error.message;
                    this.showNotification(this.type, this.Message);
                    console.log(error);
                });

       }

*/



/*

       exports.invioemailconfirmedprenotazionelogistica  = (req,res)=> {


        let email = req.params.email;
        let cognome = req.params.cognome;
        let nome = req.params.nome;
        let keyuserpren = req.params.keyuserpren;
        let devento = req.params.devento;
        let dataev = req.params.dataev;

*/



       openSelezPosto(form: NgForm) {
       // alert('aprire popup per selezione settore/fila posto/tipo biglietto');
        console.log('aprire popup per selezione settore/fila posto/tipo biglietto ');

        // verifico se creato il gruppo di prenotazione su localstorage
        this.keyuserpren = localStorage.getItem('keyuserpren');
        console.log('localStorage - keyuserpren ' + this.keyuserpren);
        if(this.keyuserpren == null) {

          const date = new Date();

          //console.log(this.datePipe.transform(date,"dd/MM/yyyy")); //output : 2018-02-13


          this.keyuserpren = form.value.cognome.substring(0, 3) + form.value.nome.substring(0, 3) + form.value.telefono.substring(-2, 2) + this.datePipe.transform(date,"dd-MM-yyyy");

          localStorage.setItem('keyuserpren_cognome', form.value.cognome);
          localStorage.setItem('keyuserpren_nome', form.value.nome);
          localStorage.setItem('keyuserpren_email', form.value.email);
          localStorage.setItem('keyuserpren_telefono', form.value.telefono);
          localStorage.setItem('keyuserpren_datapren', this.datePipe.transform(date,"dd-MM-yyyy"));
          localStorage.setItem('keyuserpren_stato', 'prima');
          console.log('localStorage - Creata keyuserpren ' + this.keyuserpren);
        }

        this.eventoposto = new EventoPosto();
        this.eventoposto.id = 1;
        this.eventoposto.token = this.token;
        this.eventoposto.idlogistica = this.evento.idlogistica;
        this.eventoposto.idEvento = this.evento.id;
        this.eventoposto.cognome = form.value.cognome;
        this.eventoposto.nome = form.value.nome;
        this.eventoposto.cellulare = form.value.telefono;
        this.eventoposto.email = form.value.email;

        console.log('nuovoElemento ----------  dati passati: ' + JSON.stringify(this.eventoposto));


        const ref = this.modalService.open(EventopostopopComponent, {size:'lg'});
        ref.componentInstance.selectedUser = this.eventoposto;

        ref.result.then(
           (yes) => {
             console.log('Click YES');

             // leggo il file con elemento caricato
             this.nrich = 0;
             this.loadEventoPosti(this.keyuserpren);


            // this.loadlocalita();
             //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
           },
           (cancel) => {
             console.log('click Cancel');
           });
      }


   async   loadEventoPosti(keyuserpren: string) {
        console.log('frontend - loadEventoPosti: ' + keyuserpren);
        let rc = await  this.eventopostoService.getbykeypren(keyuserpren).subscribe(
        response => {
            this.eventoposti = response['data'];
            this.nrich  = response['number'];
            this.prenotatiposti = true;
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




      async   loadEventoPostiprenotati(keyuserpren: string, codpren: string, token: string) {
        console.log('frontend - loadEventoPostiprenotati: ' + keyuserpren);
        let rc = await  this.eventopostoService.getbykeypren(keyuserpren).subscribe(
        response => {
            this.eventoposti = response['data'];
            const oggi = new Date();
            for(const posto of this.eventoposti) {
              console.log('postoprenotato : ---------- posto ------------------ ' + JSON.stringify(posto));
              this.pren = new PrenotazeventoConfirm();
              this.pren.cognome = posto.cognome;
              this.pren.nome = posto.nome;
              this.pren.email = posto.email;
              this.pren.idevento = posto.idEvento;
              this.pren.idlogistica = posto.idlogistica;
              this.pren.idsettore = posto.idSettore;
              this.pren.idfila = posto.idFila;
              this.pren.idposto = posto.idPosto;
              this.pren.idtipobiglietto = posto.tipobiglietto;
              this.pren.persone = 1;
              this.pren.telefono = posto.cellulare;
              this.pren.datapren = this.datePipe.transform(oggi,"dd/MM/yyyy");
              this.pren.codpren =  codpren;
              this.pren.token = token;
              console.log('pronto per inserimento prenotazione: ----------- pren -------------' + JSON.stringify(this.pren));
              this.prenotazeventoConfirmService.registerConfermetPrenotazeventologisticaMoreno(this.pren).subscribe(
                resp => {
                           if(resp['rc'] === 'ok') {
                            // non faccio nulla
                           }
                    },
                error => {
                       console.log('errore in creazione conferme prenotazione ' + error.message);
                       this.handleError(error);
                       console.log(error.message);
                       this.type = 'error';
                       this.Message = 'errore in creazione conferme prenotazione: ' + error.message;
                       this.showNotification(this.type, this.Message);
                 });
           }

        },
        error => {
            alert('loadEventoPostiprenotati: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventoPostiprenotati' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });

      }


/*

spostati sulla popup


    async   loadSettori(id: number) {    // utilizzo solo settori operativi per l'evevnto
            console.log('frontend - loadSettori -  logistica: ' + id);
            let rc = await  this.eventosettfilapostiService.getbyIdEventoSettori(id).subscribe(
            response => {
                this.eventosettfilaposti = response['data'];
            },
            error => {
                alert('loadSettori: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Errore loadSettori' + '\n' + error.message;
                this.showNotification(this.type, this.Message);
                console.log(error);
            });

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


            onSelectedSettore(selectedValue: number) {
              //  alert('selezionato: ' + selectedValue);
                if(selectedValue ==  99) {
                  this.type = 'error';
                  this.Message = 'selezione non corrette';
                  this.showNotification(this.type, this.Message);
                  this.alertSuccess = false;
                  this.isVisible = true;
                  this.selectedSettore = 0;
                  this.settoreselcted = false;
                  this.eventosettfilaposti1 = this.eventosettfilapostienull;
                  return;
               } else {
                this.loadFilebySettore(this.evento.id, selectedValue);
                this.selectedSettore = selectedValue;
                this.settoreselcted = true;
                console.log('fatto selezione Settore - selezionato: ' + this.evento.id + ' settore ' + selectedValue);


              }

            }




            onSselectedFila(selectedValue: number) {
             //  alert('selezionato: ' + selectedValue);
               if(selectedValue ==  99) {
                 this.type = 'error';
                 this.Message = 'selezione non corrette';
                 this.showNotification(this.type, this.Message);
                 this.alertSuccess = false;
                 this.isVisible = true;
                 this.selectedFila = 0;
                 this.eventosettfilaposti1 = this.eventosettfilapostienull;
                 return;
              } else {
               this.loadPostibyFila(this.evento.id, selectedValue);
               this.selectedFila = selectedValue;
               console.log('fatto selezione Settore - selezionato: ' + this.evento.id + ' settore ' + selectedValue);


              }

          }

          loadPostibyFila(id: number, idFila: number) {
           // da fare
          }

       async  loadFilebySettore(id: number, idSett: number) {    // utilizzo solo settori operativi per l'evevnto
             console.log('frontend - loadFilebySettore -  evento: ' + id + ' settore: ' + idSett);
             let rc = await  this.eventosettfilapostiService.getbyIdEventofileofSettore(id, idSett).subscribe(
             response => {
                 this.eventosettfilaposti1 = response['data'];
             },
             error => {
                 alert('loadFilebySettore: ' + error.message);
                 this.isVisible = true;
                 this.alertSuccess = false;
                 this.type = 'error';
                 this.Message = 'Errore loadFilebySettore' + '\n' + error.message;
                 this.showNotification(this.type, this.Message);
                 console.log(error);
             });

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




*/




}


