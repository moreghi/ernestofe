import { Component, OnInit } from '@angular/core';
// Service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService} from './../../../services/evento.service';
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { TtagliabigliettoService } from './../../../services/ttagliabiglietto.service';
import { TstatotagliabigliettoService } from './../../../services/tstatotagliabiglietto.service';
import { WEventoTagliaBigliettoService } from 'src/app/services/w-evento-taglia-biglietto.service';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
import { Evento } from '../../../classes/Evento';
import { Ttipobiglietto } from './../../../classes/T_tipo_biglietto';
import { Ttagliabiglietto } from './../../../classes/T_taglia_biglietto';
import { Tstatotagliabiglietto } from './../../../classes/T_stato_taglia_biglietto';
import { WEventoTagliaBiglietto } from './../../../classes/W_evento_taglia_biglietto';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply, faCloud } from '@fortawesome/free-solid-svg-icons';
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
  faCloud = faCloud;

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
  public wEventoTagliaBiglietto: WEventoTagliaBiglietto;
  public wEventoTagliaBiglietti: WEventoTagliaBiglietto[] = [];
  public wEventoTagliaBigliettiSelected: WEventoTagliaBiglietto[] = [];
  public wEventoTagliaBigliettoSelected: WEventoTagliaBiglietto;
  public wEventoTagliaBiglietto1: WEventoTagliaBiglietto;

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
  public eventoattivato = false;

  public viewPrezzoUnico = false;
  public viewPrezzoFascie = false;
  public stato = 0;
  public stato1 = 0;
  public wMaxPosti = 0;
  public nfascie = 0;  // numweo delle scelta in combo per impostare le condizioni di fascia.
  public insertedFascia = false;  // per rendere disable la option button di selezione tipo pagamento (prezzo unico e/o fascie)
  public npostiAssegnati = 0;  // salvo i posti già assegnati alle fascie ti tipo biglietto
  public npostiDisponibili = 0;  // salvo i posti già assegnati alle fascie ti tipo biglietto
  public insertedTaglia = false;
  public allPostiAssegnati = false;
  public npostiDisp = 0;
  public selectedPrezzoUnico = false;
  public tipoticket = 0;
  public numeroTaglieSelected = 0;
  public numeroTaglieSelectedcopy = 0;

  constructor(private manifestazioneService: ManifestazioneService,
              public eventoService: EventoService,
              private tipobigliettoService: TtipobigliettoService,
              private tagliabigliettoService: TtagliabigliettoService,
              private wEventoTagliaBigliettoService: WEventoTagliaBigliettoService,
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
    this.wEventoTagliaBigliettoSelected = new WEventoTagliaBiglietto();
    this.anno  = this.dataOdierna.getFullYear();
    // inizializzazione
    this.selectedTaglio = 0;
    this.viewPrezzoFascie = false;
    this.viewPrezzoUnico = false;

    this.tipoticket = +localStorage.getItem('tipoBiglietto');
    localStorage.removeItem('tipoBiglietto');

    console.log('goApplication - anno: ---- ' + this.anno);
    this.numeroTaglieSelected = 0;
    this.isVisible = true;
    this.alertSuccess = true;
    this.title = 'gestione tipo di biglietto';

    this.rotta = this.route.snapshot.url[0].path;
    this.rottafase = this.route.snapshot.url[1].path;
    this.idpassed = +this.route.snapshot.url[2].path;

    console.log('goApplication - tipobiglietto ');
    console.log('goApplication - rotta: ' + this.rotta);
    console.log('goApplication - rottafase: ' + this.rottafase);
    console.log('goApplication - idpassed: ' + this.idpassed);

    //   this.deleteAllFascie(this.idpassed);  // eliminare
    this.loadStati();
    // carico le fasci delle taglie
    this.stato = 0;
    this.loadwEventotaglabiglietto(this.idpassed, this.stato);
    // recupero il taglio prezzo unico
    this.loadPrezzoUnico(this.idpassed);
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
        // in loadevento effettuo già tutte le operatività per la gestione delle gfascie o prezzo unico
        // inibisco questo metodo.
        // sono pronto per fare il rilascio  2023/05/05
        // this.Loadtipobiglietto(this.idpassed);
        this.Message = 'pronto per aggiornamento tipo biglietto';
       });
      }

    }

    // this.level = parseInt(localStorage.getItem('user_ruolo'));
   // this.rottaId = parseInt(this.route.snapshot.url[1].path);

  //  console.log('rotta -------- 0 ------ ' + this.route.snapshot.url[0].path);
  //  console.log('rotta -------- 1 ------ ' + this.route.snapshot.url[1].path);
  //   console.log('rotta -------- 2 ------ ' + this.route.snapshot.url[2].path);


  async loadEvento(id: number) {
    console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
        this.evento = response['data'];
        this.wMaxPosti = this.evento.nposti;
        this.npostiDisponibili = this.evento.npostiDisponibili;
        this.npostiAssegnati = this.evento.npostiAssegnati;
        this.npostiDisp = this.evento.npostiDisponibili - this.evento.npostiAssegnati;
        this. allPostiAssegnati = false;
        if(this.evento.npostiAssegnati === this.evento.npostiDisponibili) {
          this.allPostiAssegnati = true;
        }
        if(this.npostiAssegnati > 0) {
          this.stato = 1;
          this.loadwEventotaglabigliettoSelected(this.evento.id, this.stato);
          this.viewPrezzoFascie = true;
          this.insertedTaglia === true;
        }
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
          alert('Socio-Detail  --loadManifestazione: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
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
               console.log('loadTagli - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }


    async  loadTagli() {
      console.log('');
      let rc = await this.tagliabigliettoService.getAll().subscribe(
          resp => {
                console.log('loadTagli: ' + JSON.stringify(resp['data']));
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





    async Loadtipobiglietto(id: number) {
        console.log('frontend -  Loadtipobiglietto: ' + id);
        let rc = await  this.tipobigliettoService.getbyevento(id).subscribe(
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
          alert('Loadtipobiglietto: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
          });
        }

           async  loadwEventotaglabiglietto(id: number, stato: number) {
            console.log('...........................  loadwEventotaglabiglietto - Appena entrato' + id + ' stato: ' + stato + ' this.tipoticket: ' + this.tipoticket);

            let rc = await this.wEventoTagliaBigliettoService.getAll(id, stato).subscribe(
                resp => {
                  console.log('                     trovati wEvento...' + resp['data'] + ' rc: ' + resp['rc']);
                       if(resp['rc'] === 'ok') {
                         this.wEventoTagliaBiglietti = resp['data'];

                      }
                      if(resp['rc'] !== 'ok') {
                        alert('merda ------------   non letti fascie')
                      }

                },
                error => {
                     alert('sono in loadwEventotaglabiglietto');

                     console.log('loadwEventotaglabiglietto - errore: ' + error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.showNotification(this.type, this.Message);
                 });
             }


             async  loadwEventotaglabigliettoSelected(id: number, stato: number) {
              console.log('...........................  loadwEventotaglabigliettoSelected - Appena entrato' + id + ' stato: ' + stato);

              let rc = await this.wEventoTagliaBigliettoService.getAll(id, stato).subscribe(
                  resp => {
                    console.log('                     trovati wEvento..selected ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
                         if(resp['rc'] === 'ok') {
                           this.wEventoTagliaBigliettiSelected = resp['data'];
                           if(resp['number'] > 0) {
                             this.insertedTaglia = true;
                           }
                        }
                     },
                  error => {
                       alert('sono in loadwEventotaglabigliettoSelected');
                       console.log('loadwEventotaglabigliettoSelected - errore: ' + error);
                       this.type = 'error';
                       this.Message = error.message;
                       this.showNotification(this.type, this.Message);
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

    release() {

      if(this.selectedPrezzoUnico === true) {
        this.evento.tipobiglietto = 1;
      } else {
        this.evento.tipobiglietto = 2;
      }

      if(this.evento.statobiglietti === 1 && this.evento.statoposti === 1) {
        this.evento.stato = 1;
      }
      if(this.evento.idtipo > 0 && this.evento.tipobiglietto > 0) {
        this.evento.stato = 1;
      }



      this.aggiornaEvento(this.evento)
    }

    async   aggiornaEvento(evento: Evento){
      let rc = await this.eventoService.update(evento).subscribe(
        res => {
                if(res['rc'] === 'ok') {
                  this.type = 'success';
                  this.alertSuccess = true;
                  this.isVisible = true;
                  this.Message = 'impostati i prezzi dell evento';
                  this.router.navigate(['evento/edit/' + evento.id + '/' + evento.idmanif]);
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


    async  loadPrezzoUnico(id: number) {
      console.log('----------------------------->  loadPrezzoUnico ' + id);
                    let rc = await this.wEventoTagliaBigliettoService.getbyflagPU(id).subscribe(
                      res => {
                             this.wEventoTagliaBiglietto1  = res['data'];
                        },
                        error => {
                           console.log(error);
                           this.type = 'error';
                           this.Message = error.message;
                           this.alertSuccess = false;
                           this.showNotification( this.type, this.Message);
                        });
                    }




    reset() {
    this.evento = new Evento();

    }

    async conferma() {

        console.log('taglia selezionata: ' + JSON.stringify(this.wEventoTagliaBigliettoSelected));


          if( this.tipobiglietto.ntot > this.npostiDisp) {
            this.type = 'error';
            this.Message = 'Quantitativo biglietti richiesti maggiore dei disponibili - inserimento non possibile';
            this.alertSuccess = false;
            this.showNotification( this.type, this.Message);
            return;
           }


           if( this.tipobiglietto.importo === 0 ||  this.tipobiglietto.importo < 0) {
            if(this.wEventoTagliaBigliettoSelected.d_taglia !== 'GRATIS') {
              this.type = 'error';
              this.Message = 'Inserire il Prezzo del biglietto - inserimento non possibile';
              this.alertSuccess = false;
              this.showNotification( this.type, this.Message);
              return;
            }

           }


           if( this.selectedTaglio === 0 ) {
            this.type = 'error';
            this.Message = 'Selezionare la taglia - inserimento non possibile';
            this.alertSuccess = false;
            this.showNotification( this.type, this.Message);
            return;
           }

                  console.log('conferma - fase: ' + this.fase);
                switch (this.fase)  {
                  case 'N':
                        // verifica se ho già inserito questa taglia
                        this.tipobigliettoService.getbytaglia(this.tipobiglietto.idevento, this.tipobiglietto.idtipotaglia).subscribe(
                          res => {
                              if(res['rc'] === 'ok') {
                                  this.type = 'error';
                                  this.Message = 'tipologia biglietto già inserito - inserimento non possibile';
                                  this.alertSuccess = false;
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

           tipobiglietto.d_tipo = this.wEventoTagliaBigliettoSelected.d_taglia;
           tipobiglietto.stato = 1;
           if(this.wEventoTagliaBigliettoSelected.flagpu === 'PU') {
            tipobiglietto.prezzoUnico = 'S';
            this.evento.tipobiglietto = 1;
            } else {
              this.congelaPrezzoUnico(this.wEventoTagliaBiglietto1);
            }


           console.log('..... Inserisci tipo biglietto .-------- pronto per inserimento ------ .....>  inseriscitipologia -------  tipo biglietto: ' +  JSON.stringify(tipobiglietto));

          let rc = await this.tipobigliettoService.create(tipobiglietto).subscribe(
                res => {
                  if(res['rc'] === 'ok') {
                    // se il biglietto salvato è a prezzo unico imposto lo statobiglietto a 1
                      if(this.selectedTaglio === 1) {
                        this.evento.tipobiglietto = 1
                      }
                        this.aggiornastatoBiglietto(this.evento);
                        console.log('inserisciTipologia  --- selecredTaglio; ' +  this.selectedTaglio);
                        this.aggiornaStatoweventotagliabiglietto(this.selectedTaglio);
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

            async  congelaPrezzoUnico(wEventoTagliaB: WEventoTagliaBiglietto) {
              wEventoTagliaB.stato = 9;
              let rc = await this.wEventoTagliaBigliettoService.update(wEventoTagliaB).subscribe(
                res => {
                       if(res['rc'] !== 'ok') {
                        this.type = 'error';
                        this.Message = 'errore in congelamento Prezzo Unico rc: ' +  res['rc'];
                        this.alertSuccess  = false;
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

 async aggiornastatoBiglietto(evento: Evento) {  // ok

  this.eventoattivato = false;
  evento.statobiglietti = 1;
 // per un motivo strano il campo this.tipobiglietto.ntot non è numerico. quindi lo rendo numerico
 // prima du fare la simma
  evento.npostiAssegnati = evento.npostiAssegnati +  Number(this.tipobiglietto.ntot);;
  if(this.evento.statoposti == 1) {
    if(this.evento.stato == 0) {
      this.evento.stato = 1;
      this.eventoattivato = true;
     }
   }

  let rc = await this.eventoService.update(evento).subscribe(
    res => {
           // se attivato evento attivo la manifestazione e la rendo visibile per le registrazioni
           if(this.eventoattivato === true) {
              this.attivaManifestazione(this.manif);
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

  async  attivaManifestazione(manif: Manifestazione) {
    manif.stato = 1;
    let rc = await this.manifestazioneService.update(manif).subscribe(
      res => {
             // non faccio nulla
         },
        error => {
           console.log(error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification( this.type, this.Message);
        });
    }


    async  aggiornaStatoweventotagliabiglietto(id: number) {
      console.log('aggiornaStatoweventotagliabiglietto  -- appena entrato tipo biglietto: ' + id);
      this.wEventoTagliaBigliettoSelected.id = id;
      this.wEventoTagliaBigliettoSelected.importo = this.tipobiglietto.importo;
      this.wEventoTagliaBigliettoSelected.nbiglietti = this.tipobiglietto.ntot;
      this.wEventoTagliaBigliettoSelected.serie = this.tipobiglietto.serie;
      this.wEventoTagliaBigliettoSelected.ultimoemesso = this.tipobiglietto.ultimoemesso;
      this.wEventoTagliaBigliettoSelected.stato = 1;

      this.insertedTaglia = true;

      let rc = await this.wEventoTagliaBigliettoService.update(this.wEventoTagliaBigliettoSelected).subscribe(
        res => {
                if(res['rc'] === 'ok') {
                  this.insertedFascia = true;
                  this.type = 'success';
                  this.alertSuccess = true;
                  this.isVisible = true;
                  this.numeroTaglieSelected = this.numeroTaglieSelected + 1;
                  this.numeroTaglieSelectedcopy = this.numeroTaglieSelected;
                  if(this.npostiDisponibili > 0) {
                    // visualizzo le taglie selezionate
                    this.stato = 1;
                    this.loadwEventotaglabigliettoSelected(this.evento.id, this.stato);
                    // ricarico l'applicazione impostando le taglie residue
                    this.goApplication();
                    this.numeroTaglieSelected = this.numeroTaglieSelectedcopy;
                    this.Message = 'tipologia evento inserito correttamente - selezionare le rimanenti Taglie';
                    this.showNotification( this.type, this.Message);
                   // window.location.reload();
                  }
                  /*
                  if(this.npostiDisponibili === 0) {
                    this.Message = 'tipologia evento inserito correttamente';
                    this.router.navigate(['evento/' + this.evento.id + '/tipobiglietti']);
                    this.showNotification( this.type, this.Message);
                  } else {
                    this.stato1 = 1;
                    this.loadwEventotaglabigliettoSelected(this.evento.id, this.stato);
                    this.Message = 'tipologia evento inserito correttamente - selezionare le rimanenti Taglie';
                    this.showNotification( this.type, this.Message);
                  } */
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
    this.loadFasciabigliettoSelected(this.selectedTaglio);
   }

  }

  /*   metodo che non serve più avendo eliminato la selezione con radio button

  selectTipoBiglietto(tipo: string) {
      this.evento.tipobiglietto = parseInt(tipo);
      switch (tipo) {
        case "0":
            this.viewPrezzoUnico = false;
            this.viewPrezzoFascie = false;
            break;
        case "1":
            this.viewPrezzoFascie = false;
            this.viewPrezzoUnico = true;
            this.tipobiglietto.ntot = this.evento.nposti;
            break;
        case "2":
            this.viewPrezzoFascie = true;
            this.viewPrezzoUnico = false;
            // recuper il numero dei posti assegnati per non superare il limite su evento
       //     this.loadPostibyFascia(this.evento.id);
             // recupero le fasciedel biglietto
             console.log('-------------> dovrei caricare le wElencoTagli....');
            this.stato = 0;
            this.loadwEventotaglabiglietto(this.evento.id, this.stato);
            this.stato1 = 1;
            this.loadwEventotaglabigliettoSelected(this.evento.id, this.stato1);
            this.tipobiglietto.ntot = 0;
            break;
        default:
        alert('Scelta errata' + '\n' + 'Selezionare tipo di costo' + tipo);
            break;
       }

    }
*/

    async  loadFasciabigliettoSelected(id: number) {
      console.log('loadFasciabigliettoSelected - Appena entrato');
      let rc = await this.wEventoTagliaBigliettoService.getbyid(id).subscribe(
          resp => {
                 if(resp['rc'] === 'ok') {
                  this.wEventoTagliaBigliettoSelected = resp['data'];
                  if(this.wEventoTagliaBigliettoSelected.d_taglia === 'PREZZO UNICO') {
                      this.selectedPrezzoUnico = true;
                    }
                  }
          },
          error => {
               alert('loadFasciabigliettoSelected');

               console.log('loadFasciabigliettoSelected - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }

/*   metodo non piu usato  2023/05/04
 async  loadPostibyFascia(id: number) {  // ok

    let rc = await this.tipobigliettoService.countPostibyEvento(id).subscribe(
      res => {
                if(res['rc'] === 'ok') {
                  this.npostiAssegnati = res['posti'];
                  this.npostiDisponibili = this.evento.nposti - this.npostiAssegnati;
              }
              if(res['rc'] === 'nf')   {
                this.npostiAssegnati = 0;
                this.npostiDisponibili = this.evento.nposti;
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


    async  deletePostobyFascia(taglia: WEventoTagliaBiglietto) {
      console.log('deletePostobyFascia -- appena entrato --: ' + JSON.stringify(taglia));
      let npostiko = taglia.nbiglietti;
      taglia.importo = 0;
      taglia.nbiglietti = 0;
      taglia.stato = 0;
      let rc = await this.wEventoTagliaBigliettoService.update(taglia).subscribe(
        res => {
                if(res['rc'] === 'ok') {
                  this.evento.npostiDisponibili = this.evento.npostiDisponibili - npostiko;
                  this.aggiornaEventobyannulloPosti(this.evento);
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

      async   aggiornaEventobyannulloPosti(evento: Evento){
        let rc = await this.eventoService.update(evento).subscribe(
          res => {
                  if(res['rc'] === 'ok') {
                    this.type = 'success';
                    this.alertSuccess = true;
                    this.isVisible = true;
                    this.Message = 'annullata selezione Taglia - selezionare le rimanenti Taglie';
                    window.location.reload();
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


/*    spostato su Evento-detail quando creo l'evento
    async  loadFascie() {
      console.log('-----> loadFascie -- appena entrato')
          console.log('loadFascie - Appena entrato');
          let rc = await this.tagliabigliettoService.getAll().subscribe(
              resp => {
                    console.log('loadFascie: ' + JSON.stringify(resp['data']));
                    if(resp['rc'] === 'ok') {
                      this.tagli = resp['data'];
                      for(const taglio of this.tagli) {
                          this.wEventoTagliaBiglietto = new WEventoTagliaBiglietto();
                          this.wEventoTagliaBiglietto.idEvento = this.evento.id;
                          this.wEventoTagliaBiglietto.d_taglia = taglio.d_taglia;
                          this.wEventoTagliaBiglietto.key_utenti_operation = 1;
                          this.wEventoTagliaBigliettoService.create(this.wEventoTagliaBiglietto).subscribe(
                                  response => {
                                      if(response['rc'] === 'ok') {
                              //                non faccio nulla
                                  console.log('-----> registrato wEventoTagliaBiglietto ');
                                      }
                                  },
                                  error =>
                                  {
                                    console.log(error);
                                    this.Message = error.message;
                                    this.alertSuccess = false;
                                  });
                            }

                        }
                },
              error => {
                   console.log('loadFascie - errore: ' + error);
                   this.type = 'error';
                   this.Message = error.message;
                   this.showNotification(this.type, this.Message);
               });
           }

*/
/*
async  deleteAllFascie(id: number) {
  console.log('deleteAllFascie - Appena entrato');
  let rc = await this.wEventoTagliaBigliettoService.deleteAll(id).subscribe(
      resp => {
             if(resp['rc'] === 'ok') {
              this.loadFascie();
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
*/

}
