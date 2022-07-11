import { Component, OnInit } from '@angular/core';
// Service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService} from './../../../services/evento.service';
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { TtagliabigliettoService } from './../../../services/ttagliabiglietto.service';
import { TstatotagliabigliettoService } from './../../../services/tstatotagliabiglietto.service';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { Evento } from '../../../classes/Evento';
import { Ttipobiglietto } from './../../../classes/T_tipo_biglietto';
import { Ttagliabiglietto } from './../../../classes/T_taglia_biglietto';
import { Tstatotagliabiglietto } from './../../../classes/T_stato_taglia_biglietto';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
// Varie
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tipobiglietto-detail',
  templateUrl: './tipobiglietto-detail.component.html',
  styleUrls: ['./tipobiglietto-detail.component.css']
})
export class TipobigliettoDetailComponent implements OnInit {

  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faSave = faSave;
  faPlus = faPlus;
  faTrash = faTrash;
  faReply = faReply;

  public selectedTaglio = 0;
  public selectedStato = 0;

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';

  public tipobiglietto: Ttipobiglietto;
  public manif: Manifestazione;
  public evento: Evento;
  public tagli: Ttagliabiglietto[] = [];
  public statitaglia: Tstatotagliabiglietto[] = [];

  public title = '';
  public newTessera = 0;
  public newTesseraStr = '';
  public fase = '';
  public idBg = 1;
  public alertSuccess = false;
  public isVisible = false;
  public rotta = '';
  public rottafase = '';
  public dataOdierna;
  public anno  = 0;
  public idpassed = 0;
  public lenmaxtessera = 5;
  public namepage = ' - tipobiglietto-detail';

  constructor(private manifestazioneService: ManifestazioneService,
              public eventoService: EventoService,
              private tipobigliettoService: TtipobigliettoService,
              private tagliabigliettoService: TtagliabigliettoService,
              private statotagliabigliettoService: TstatotagliabigliettoService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private datePipe: DatePipe,
              private notifier: NotifierService) {
              this.notifier = notifier;
  }


  ngOnInit(): void {
    this.goApplication();

  }

  goApplication() {
    const date = Date();
    this.dataOdierna = new Date(date);

    this.anno  = this.dataOdierna.getFullYear();

    console.log('goApplication - anno: ---- ' + this.anno);

    this.isVisible = true;
    this.alertSuccess = true;


    this.rotta = this.route.snapshot.url[0].path;
    this.rottafase = this.route.snapshot.url[1].path;
    this.idpassed = +this.route.snapshot.url[2].path;

    console.log('goApplication - rotta: ' + this.rotta);
    console.log('goApplication - rottafase: ' + this.rottafase);
    console.log('goApplication - idpassed: ' + this.idpassed);


    this.loadStati();
    this.loadTagli();
    this.loadEvento(this.idpassed);


    if(this.rottafase === 'new') {
      this.fase = 'N';
      this.title = 'Inserimento nuovo tipo biglietto' + this.namepage;
      this.Message = 'inserire i dati del nuovo tipo biglietto';
      this.tipobiglietto = new Ttipobiglietto();
      this.tipobiglietto.idevento = this.idpassed;
      this.tipobiglietto.key_utenti_operation = +localStorage.getItem('id');
    } else {
        this.fase = 'M';
        this.title = 'Aggiornamento Tipo Biglietto' + this.namepage;

        this.route.paramMap.subscribe(p => {
        this.idpassed = +p.get('id');
        console.log('id recuperato: ' + this.idpassed);
        this.Loadtipobiglietto(this.idpassed);
        this.Message = 'pronto per aggiornamento Socio';
       });
      }


    // this.level = parseInt(localStorage.getItem('user_ruolo'));
   // this.rottaId = parseInt(this.route.snapshot.url[1].path);

  //  console.log('rotta -------- 0 ------ ' + this.route.snapshot.url[0].path);
  //  console.log('rotta -------- 1 ------ ' + this.route.snapshot.url[1].path);
  //   console.log('rotta -------- 2 ------ ' + this.route.snapshot.url[2].path);





  }


  async loadEvento(id: number) {
    console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
        this.evento = response['data'];
        this.loadManifestazione(this.evento.idmanif);
        }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
          alert('Socio-Detail  --loadEvento: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
      });
    }

    async loadManifestazione(id: number) {
      let rc = await  this.manifestazioneService.getbyId(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
            this.manif = response['data'];
            }
          if(response['rc'] === 'nf') {
            this.Message = response['message'];
            this.type = 'error';
            this.showNotification( this.type, this.Message);
          }
        },
          error => {
          alert('Socio-Detail  --loadEvento: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
          });
    }

    async  loadTagli() {
      console.log('');
      let rc = await this.tagliabigliettoService.getAll().subscribe(
          resp => {
                console.log('loadStato: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.tagli = resp['data'];
                }
             },
          error => {
               alert('sono in loadTagli');
               console.log('loadTagli - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }



    async  loadStati() {
      console.log('');
      let rc = await this.statotagliabigliettoService.getAll().subscribe(
          resp => {
                console.log('loadStati: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.statitaglia = resp['data'];
                }
             },
          error => {
               alert('sono in loadStati');

               console.log('loadStati - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }

       async Loadtipobiglietto(id: number) {
        console.log('frontend -  tipobiglietto: ' + id);
        let rc = await  this.tipobigliettoService.getbyid(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
            this.tipobiglietto = response['data'];
            this.loadEvento(this.tipobiglietto.idevento);
            this.selectedStato = this.tipobiglietto.stato;
            this.selectedTaglio = this.tipobiglietto.idtipotaglia;

            }
          if(response['rc'] === 'nf') {
            this.Message = response['message'];
            this.type = 'error';
            this.showNotification( this.type, this.Message);
          }
        },
          error => {
          alert(' tipobiglietto: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
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

    goback() {
         this.router.navigate(['/evento/' + this.evento.id + '/tipobiglietti']);
    }

    reset() {
    this.evento = new Evento();

    }

    async conferma() {
                console.log('conferma - fase: ' + this.fase);
                switch (this.fase)  {
                  case 'N':
                        // verifica se ho già inserito questa taglia
                        this.tipobigliettoService.getbytaglia(this.tipobiglietto.idevento, this.tipobiglietto.idtipotaglia).subscribe(
                          res => {
                              if(res['rc'] === 'ok') {
                                  this.type = 'error';
                                  this.Message = 'tipologia biglietto già inserito - inserimento non possibile';
                                  this.alertSuccess = true;
                                  this.showNotification( this.type, this.Message);
                                  return;
                              }
                              if(res['rc'] === 'nf')   {
                                   this.inserisciTipologia(this.tipobiglietto);
                              }
                            },
                            error => {
                               console.log(error);
                               this.type = 'error';
                               this.Message = error.message;
                               this.alertSuccess = false;
                               this.showNotification( this.type, this.Message);
                            });
                     break;
                case 'M':

                console.log(`pronto per fare modifica : ${JSON.stringify(this.tipobiglietto)}`);
                this.tipobiglietto.key_utenti_operation = +localStorage.getItem('id');
                this.tipobigliettoService.update(this.tipobiglietto).subscribe(
                    res => {
                          this.aggiornastatoBiglietto(this.evento);
                          this.type = 'success';
                          this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                          this.alertSuccess = true;
                          this.showNotification( this.type, this.Message);
                          this.router.navigate(['evento/' + this.evento.id + '/tipobiglietti']);
                       },
                      error => {
                         console.log(error);
                         this.type = 'error';
                         this.Message = error.message;
                         this.alertSuccess = false;
                         this.showNotification( this.type, this.Message);
                      });
                   break;
                default:
                  alert('nav - funzione non ancora attivata');
                  break;
              }
            }


      async  inserisciTipologia(tipobiglietto: Ttipobiglietto) {
          let rc = await this.tipobigliettoService.create(tipobiglietto).subscribe(
                res => {
                  this.aggiornastatoBiglietto(this.evento);
                  this.type = 'success';
                  this.Message = 'tipologia evento inserito correttamente';
                  this.alertSuccess = true;
                  this.showNotification( this.type, this.Message);
                  this.router.navigate(['evento/' + this.evento.id + '/tipobiglietti']);
                   },
                  error => {
                     console.log(error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                     this.showNotification( this.type, this.Message);
                  });

            }


 async aggiornastatoBiglietto(evento: Evento) {
  evento.statobiglietti = 1;
  let rc = await this.eventoService.update(evento).subscribe(
    res => {
           // non faccio niente
       },
      error => {
         console.log(error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification( this.type, this.Message);
      });
    }


onSelectedStato(selectedValue: number) {
//  alert('selezionato: ' + selectedValue);
  if(selectedValue ==  9999) {
    this.type = 'error';
    this.Message = 'selezione non corrette';
    this.showNotification(this.type, this.Message);
    this.alertSuccess = false;
    this.isVisible = true;
    this.selectedStato = 0;
    return;
 } else {
  this.selectedStato = selectedValue;
  this.tipobiglietto.stato = selectedValue;
 }

}

onSelectedTaglio(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  9999) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.selectedTaglio = 0;
      return;
   } else {
    this.selectedTaglio = selectedValue;
    this.tipobiglietto.idtipotaglia = selectedValue;
   }

  }




}
