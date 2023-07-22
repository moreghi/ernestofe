import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faCheck } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Evento } from '../../../classes/Evento';
import { Locandina } from '../../../classes/Locandina';
import { W_Prenotazevento } from '../../../classes/W_Prenotazevento';
import { Ttipobiglietto } from '../../../classes/T_tipo_biglietto';
import { WEventoTagliaBiglietto } from '../../../classes/W_evento_taglia_biglietto';
import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogPosto } from '../../../classes/Logposto';
import { EventoPosto } from '../../../classes/Eventoposto'
// Service
import { EventoService } from './../../../services/evento.service';
import { PrenotazeventoService } from './../../../services/prenotazevento.service';
import { W_PrenotazeventoService } from './../../../services/w_prenotazevento.service';
import { LocandinaService } from './../../../services/locandina.service';
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { WEventoTagliaBigliettoService } from './../../../services/w-evento-taglia-biglietto.service';
import { LogsettoreService } from './../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';
import { LogpostoService } from './../../../services/logposto.service';
import { EventopostoService } from './../../../services/eventoposto.service';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// popup per visualizzazione logistica
import { LocandinapopComponent } from '../../../components/popups/locandinapop/locandinapop.component';
import { LogpostopopComponent } from '../../../components/popups/logpostopop/logpostopop.component';



@Component({
  selector: 'app-prenotazione-detail',
  templateUrl: './prenotazione-detail.component.html',
  styleUrls: ['./prenotazione-detail.component.css']
})

export class PrenotazioneDetailComponent implements OnInit {


 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;
 faUserEdit = faUserEdit;
 faSave = faSave;
 faPlus = faPlus;
 faTrash = faTrash;
 faReply = faReply;
 faCheck = faCheck;

// variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';

 public fase = '';
 public evento: Evento;
 public locandina: Locandina;
 public wprenotazevento: W_Prenotazevento;

 public logfila: LogFila;
 public logfile: LogFila[] = [];
 public logposti: LogPosto[] = [];
 public logposto: LogPosto;
 public logsettori: LogSettore[] = [];
 public logsettore: LogSettore;
 public workSettoreDetail: LogSettore;
 public workFilaDetail: LogFila;
 public tipobiglietto: Ttipobiglietto;
 public wEventoTagliaBiglietti: WEventoTagliaBiglietto[] = [];
 public wEventoTagliaBiglietto: WEventoTagliaBiglietto;
 public eventoPosti: EventoPosto[] = [];
 public eventoPostipren: EventoPosto[] = [];


 public title = '';
 public prenotate = 0;
 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottafase = '';
 public rottaEvento = 0;
 public rottaPosto = 0;
 public dataOdierna;
 public idpassed = 0;

 public prenotati = 0;
 public disponibili = 0;
 public pathimageEvent = '';
 public msgwarning = 'siamo quasi alla fine ';

 public settore1 = false;
 public settore2 = false;
 public settore3 = false;
 public settore4 = false;
 public settore5 = false;
 public settore6 = false;
 public settore7 = false;
 public settore8 = false;
 public settore9 = false;
 public settore10 = false;

 public nameSettore1 = '';
 public nameSettore2 = '';
 public nameSettore3 = '';
 public nameSettore4 = '';
 public nameSettore5 = '';
 public nameSettore6 = '';
 public nameSettore7 = '';
 public nameSettore8 = '';
 public nameSettore9 = '';
 public nameSettore10 = '';

public token = '';
public stato = 0;

p_righe = 1;
p_posti = 1;

public nameselectedSettoreview = ' ';
public nameselectedFilaview = ' ';

public SettoreSelected = false;
public FilaSelected = false;

public stato1 = 0;
public selectedtaglia = false;
public confermaRidotto = false;
public alertSettore ="Selezionare il Settore";
public alertFila ="Selezionare la Fila";
public loadedlogPosti = false;
public loadedlogPostiPren = false;
public presentiPrenotazioni = false;

//  parametri per zoom della locandina
//  https://stackoverflow.com/questions/73838711/how-to-use-ngx-img-zoom-with-html-range-in-angular
scaleRange: number;
xValue: number;
yValue: number;



 constructor(private eventoService: EventoService,
             private locandinaService: LocandinaService,
             private prenotazeventoService: PrenotazeventoService,
             private wprenotazeventoService: W_PrenotazeventoService,
             private logsettoreService: LogsettoreService,
             private logfilaService: LogfilaService,
             private logpostoService: LogpostoService,
             private ttipobigliettoService: TtipobigliettoService,
             private wEventoTagliaBigliettoService: WEventoTagliaBigliettoService,
             private eventopostoService: EventopostoService,
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

  this.workSettoreDetail = new LogSettore();
  this.workFilaDetail = new LogFila();
  const date = Date();
  this.dataOdierna = new Date(date);

  this.isVisible = true;
  this.alertSuccess = true;
  this.loadedlogPosti = false;
  this.loadedlogPostiPren = false;
  this.presentiPrenotazioni = false;


  this.rotta = this.route.snapshot.url[0].path;
  this.rottafase = this.route.snapshot.url[1].path;
  this.rottaEvento = +this.route.snapshot.url[2].path;
 // this.rottaPosto = +this.route.snapshot.url[3].path;

  console.log('----- rotta ..................  ------ ' + this.rotta);
  console.log('----- rottaEvento  +++++++++   ------ ' + this.rottaEvento);
  console.log('----- rottafase ------::::::: ' + this.rottafase);
  //console.log('----- rottaposto ---------________ ' + this.rottaPosto);



  this.loadEvento(this.rottaEvento);

  if(this.rottafase === 'new') {
    this.fase = 'N';
    this.title = 'Inserimento Prenotazione Evento';
    this.Message = 'inserire i dati della Prenotazione';
    this.wprenotazevento = new W_Prenotazevento();

    this.token = "nf";
    this.token = localStorage.getItem('tokenPrenotazione');
    console.log('ho verificato se esisteva il token ' + this.token);
    if(this.token === null) {
      this.token = (Math.random() + 1).toString(36).substring(2,7);
      console.log('non esiste il localstorage ...tokenPrenotazione... ----  creato ' + this.token)
      localStorage.setItem('tokenPrenotazione', this.token);
    } else {
      this.token = localStorage.getItem('tokenPrenotazione');
      console.log('ESISTE il localstorage ...tokenPrenotazione... --- impostato token: ' + this.token)
    }
    this.wprenotazevento.token = this.token;    // (Math.random() + 1).toString(36).substring(2,7);


  //  this.wprenotazevento.token = (Math.random() + 1).toString(36).substring(2,7);
//  console.log('token: ' + JSON.stringify(this.wprenotazevento));
// alert('token: ' + this.wprenotazevento.token);
   // this.wprenotazevento.key_utenti_operation = +localStorage.getItem('id');
  } else {
      this.fase = 'M';
      this.title = 'Aggiornamento Prenotazione Evento';
      this.route.paramMap.subscribe(p => {
      this.idpassed = +p.get('id');
      console.log('id recuperato: ' + this.idpassed);
      this.loadPrenotazione(this.idpassed);
      this.Message = 'pronto per aggiornamento Prenotazione';
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
        console.log('evento da editare : ' + JSON.stringify(response['data']));
        this.evento = response['data'];
        this.loadLocandina(this.evento);

        if(this.evento.idlogistica > 0) {   // se ho posti con logistica
          this.stato = 0;
          this.loadSettoriSelected(this.evento.idlogistica, this.stato);
        }

        if(this.evento.tipobiglietto === 1) {
          //  this.loadPrezzoUnico(this.evento.id);    vecchio metodo non valido
          this.stato1 = 1;
          this.loadwEventotagliaunicabiglietto(this.evento.id, this.stato1);  // da fare
        }
        this.stato1 = 1;
        if(this.evento.tipobiglietto === 2) {
          this.loadwEventotaglabiglietto(this.evento.id, this.stato1);
       }
       // verifico se effettuate prenotazioni precedenti
       let tokenapp = localStorage.getItem('tokenPrenotazione');
       console.log('ho verificato se esisteva il token ' + tokenapp);
       if(tokenapp !== null) {
         this.loadPostiPrenotati(tokenapp);
        }
    }
    if(response['rc'] === 'nf') {
      this.Message = response['message'];
      this.type = 'error';
      this.showNotification( this.type, this.Message);
    }
  },
    error => {
    alert('Socio-Detail  --loadSocio: ' + error.message);
    console.log(error);
    this.alertSuccess = false;
    this.Message = error.message;
    this.type = 'error';
    this.showNotification( this.type, this.Message);
    });
  }


  async loadPostiPrenotati(token: string) {
    console.log('frontend - loadPostiPrenotati: ' + token);
    let rc = await this.eventopostoService.getbytoken(token).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('loadPostiPrenotati  .......... trovati ' + JSON.stringify(response['data']));
            this.eventoPostipren = response['data'];
            this.loadedlogPostiPren = true;
            this.presentiPrenotazioni = true;

            this.wprenotazevento = new W_Prenotazevento();
            this.wprenotazevento.cognome = localStorage.getItem('prenEventoCognome');
            this.wprenotazevento.nome = localStorage.getItem('prenEventoNome');
            this.wprenotazevento.email = localStorage.getItem('prenEventoEmail');
            this.wprenotazevento.telefono = localStorage.getItem('prenEventoCell');

            console.log('loadPostiPrenotati  --- faccio nuova istanza: ' + JSON.stringify(this.wprenotazevento));
            // visualizzo messaggio
            this.alertSuccess = true;
            this.Message = 'pronto per una nuova registrazione';
            this.type = 'success';
          }

        },
          error => {
                alert('Prenotazione-Detail  --loadPostiPrenotati: ' + error.message);
                console.log(error);
                this.alertSuccess = false;
                this.Message = error.message;
                this.type = 'error';
                this.showNotification( this.type, this.Message);
          });
    }

  async loadPrezzoUnico(id: number) {
    console.log('frontend - loadPrezzoUnico: ' + id);
    let rc = await  this.ttipobigliettoService.getbyid(id).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('loadLocandina  ' + JSON.stringify(response['data']));
        this.tipobiglietto = response['data'];
      }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
      alert('Prenotazione-Detail  --loadPrezzoUnico: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
    }

    async  loadwEventotaglabiglietto(id: number, stato: number) {
      console.log('...........................  loadwEventotaglabiglietto - Appena entrato' + id + ' stato: ' + stato);
      let rc = await this.wEventoTagliaBigliettoService.getAllPren(id, stato).subscribe(
          resp => {
            console.log('                     trovati wEvento. ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
                 if(resp['rc'] === 'ok') {
                   this.wEventoTagliaBiglietti = resp['data'];
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



       async  loadwEventotagliaunicabiglietto(id: number, stato: number) {
        console.log('...........................  loadwEventotagliaunicabiglietto - Appena entrato' + id + ' stato: ' + stato);
        let rc = await this.wEventoTagliaBigliettoService.getbyideStato(id, stato).subscribe(
            resp => {
              console.log('                     trovati prezzo unico ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
                   if(resp['rc'] === 'ok') {
                     this.wEventoTagliaBiglietto = resp['data'];
                  }
               },
            error => {
                 alert('sono in loadwEventotagliaunicabiglietto');
                 console.log('loadwEventotagliaunicabiglietto - errore: ' + error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.showNotification(this.type, this.Message);
             });
         }


         deletePostoPrenotato(evposto: EventoPosto){
          alert('cancellazione prenotazione - da fare');
         }


  async loadLocandina(evento: Evento) {
    console.log('frontend - loadLocandina: ' + evento.locandina);
    let rc = await  this.locandinaService.getbyId(evento.locandina).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('loadLocandina  ' + JSON.stringify(response['data']));
        this.locandina = response['data'];
        this.pathimageEvent =  environment.APIURL + '/upload/files/eventos_locandina/' +  this.locandina.photo;
        this.countEvento(evento);

      }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
      alert('Prenotazione-Detail  --loadLocandina: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
    }


async loadPrenotazione(id: number) {
 // leggo eventoPosto ed edito in elenco
console.log('frontend - loadPrenotazione: ' + id);
let rc = await  this.eventopostoService.getbyIdEvento(id).subscribe(
response => {
  if(response['rc'] === 'ok') {
    console.log('evento-- Posti da editare ' + JSON.stringify(response['data']));
    this.eventoPosti = response['data'];
    this.loadedlogPosti = true;
  }
  if(response['rc'] === 'nf') {
    this.Message = response['message'];
    this.type = 'error';
    this.showNotification( this.type, this.Message);
    return;
  }
},
  error => {
      alert('Prenotazione-Detail  --loadPrenotazione: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
}



async loadSettoriSelected(id: number, stato: number) {
  console.log('frontend - loadSettoriSelected: ' + id);
  let rc = await  this.logsettoreService.getbySettoreActive(id, stato).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('loadSettoriSelected  ' + JSON.stringify(response['data']));
      this.logsettori = response['data'];
    }
    if(response['rc'] === 'nf') {
      this.Message = response['message'];
      this.type = 'error';
      this.alertSuccess = false;
      this.showNotification( this.type, this.Message);
    }
  },
    error => {
          alert('Prenotazione-Detail  --loadSettoriSelected: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
      });
  }

  async  viewfilebySettore(settore: LogSettore) {

    this.nameselectedSettoreview = settore.dsettore
    this.nameselectedFilaview = '';
    this.workSettoreDetail.dsettore = settore.dsettore;   // per editarlo sulla testata delle file

    this.SettoreSelected = true;
    this.FilaSelected = false;



    let idloc = settore.idLogistica;
    let id = settore.idSettore  // per anomalia ho utilizzato idSAettore al aposto di id
    let dsettore = settore.dsettore;

    console.log('viewfilebySettore  --- appena entrato ' + id);

    let rc = await this.logfilaService.getAll(idloc, id).subscribe(
        resp => {
              console.log('--------------------------viewfilebySettore ----------> :  ' + JSON.stringify(resp['data']));
              if(resp['rc'] === 'ok') {
                this.logfile = resp['data'];
      //          this.filaSelected = true;

              }
              if(resp['rc'] === 'nf') {
        //         this.workfilaSelected = false;
              }
        },
        error => {
             alert('sono in viewfilebySettore');
             console.log('viewfilebySettore - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
         });

     }



     async  viewpostybyFila(fila: LogFila) {

    //  alert('sto trattando la fila: ' + fila.dfila);

      let idloc = fila.idLogistica;
      let idsett = fila.idSettore  // per anomalia ho utilizzato idSAettore al aposto di id
      let id = fila.id;
      let stato = 0;
      this.workFilaDetail.dfila = fila.dfila;

      this.FilaSelected = true;
     // let dsettore = settore.dsettore;

      console.log('viewpostobyfila  --- appena entrato ');
      console.log('parametri per lettura su eventoPosto');
      console.log('evento_id: ' + this.evento.id);
      console.log('idsettore: ' + idsett);
      console.log('idfila: ' + id);
      console.log('stato: ' + stato);



      //let rc = await this.logpostoService.getbyStato(idloc, idsett, id, stato).subscribe(
       let rc = await this.eventopostoService.getbyIdEventoSettFilaStato(this.evento.id, idsett, id, stato).subscribe(
          resp => {
                console.log('--------------------------viewpostybyFila ----------> :  ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.eventoPosti = resp['data'];
                  }

          },
          error => {
               alert('sono in viewpostobyfila');
               console.log('viewpostobyfila - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
           });


       }

       nuovaPren() {

            localStorage.removeItem('prenEvPosto');
            localStorage.removeItem('prenEvFila');
            localStorage.removeItem('prenEvSettore');
            localStorage.removeItem('prenEvidPosto');

            this.wprenotazevento = new W_Prenotazevento();
            this.wprenotazevento.cognome = localStorage.getItem('prenEventoCognome');
            this.wprenotazevento.nome = localStorage.getItem('prenEventoNome');
            this.wprenotazevento.email = localStorage.getItem('prenEventoEmail');
            this.wprenotazevento.telefono = localStorage.getItem('prenEventoCell');

            this.type = 'success';
            this.Message = 'Nuova prenotazione.  Effettuare la selezione del tipo biglietto';
            this.alertSuccess = true;
       }


       viewlocandina() {
        // --------------  versione con utilizzo popup
        console.log('viewlocandina ---  appena entrato')
 // variante per manifestazioni senza ocandina
        if(this.evento.locandina === -1 || this.evento.locandina === 0) {
          this.locandina.idEvento = this.evento.id;
          this.locandina.photo = 'nessunalocandina.png';
        }

      // alert('nuovaLocalita - lancio la registrazione Prodotto via popup');

       // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione



       //  lancio con popup


       const ref = this.modalService.open(LocandinapopComponent, {size:'lg'});
       ref.componentInstance.selectedUser = this.locandina;

       ref.result.then(
          (yes) => {
            console.log('Click YES');
            // non devo fare nulla

          },
          (cancel) => {
            console.log('click Cancel');
          }
        );
      }


      openlogPostopop() {
        // --------------  versione con utilizzo popup
        console.log('openlogPostopop ---  appena entrato')


      // alert('nuovaLocalita - lancio la registrazione Prodotto via popup');

       // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione



       //  lancio con popup


       const ref = this.modalService.open(LogpostopopComponent, {size:'lg'});
       ref.componentInstance.selectedUser = this.wprenotazevento;

       ref.result.then(
          (yes) => {
            console.log('Click YES');
            // imposto il flag 1 su stato posto ed effettuo la lettura di tutti i posti con lo stesso token
            // evidenziando elenco. a fianco elenco il bottone di rilascio tutte prenotazioni
          },
          (cancel) => {
            console.log('click Cancel');
            // messaggio di non registrazione e abbandono da parte utente
          }
        );
      }






// leggo le file del settore selezionato
loadFile(id: number) {
  alert('da fare');
}

// leggo i posti della fila
loadPosti(id: number) {
  alert('da fare');
}
/*
async  loadlocalita() {
  console.log('loadLocalità');
  let rc = await this.tlocalitaService.getAll().subscribe(
      resp => {
            console.log('oadlocalitaNascita: ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.localitas = resp['data'];

              console.log('---------------------  oadlocalitaNascita: ' + JSON.stringify(this.localitas));
            }
         },
      error => {
           alert('sono in loadlocalitaNascita');

           console.log('loadlocalitaNascita - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
   }
*/

async selectedPosto(posto: EventoPosto) {
  console.log('selectedPosto ---   appenaentrato: ' + JSON.stringify(posto));
console.log('this.wprenotazevento: ' + JSON.stringify(this.wprenotazevento));
console.log('this.evento: ' + JSON.stringify(this.evento));




  if(this.evento.tipobiglietto === 2 && this.selectedtaglia === false) {
    this.type = 'error';
    this.Message = 'effettuare la selezione del tipo biglietto';
    this.alertSuccess = false;
    this.showNotification(this.type, this.Message);
    return;
  }

    if(this.selectedtaglia === true && this.wEventoTagliaBiglietto.d_taglia === 'RIDOTTO' && this.confermaRidotto ===  false) {

      console.log('selectedPosto: ----- selectedTaglia: ' + this.selectedtaglia );
      console.log('selectedPosto: ----- wEventoTagliaBiglietto: ' + JSON.stringify(this.wEventoTagliaBiglietto));
      console.log('selectedPosto  .....   this.confermaRidotto - flag conferma ' + this.confermaRidotto);
      this.type = 'error';
      this.Message = 'Per il biglietto scontato devi fare conferma';
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
      return;
    }

  // controllo se selazionato il tipo di biglietto


  //console.log('selectedPosto: ----- selectedTaglia: ' + this.selectedtaglia );
  //console.log('selectedPosto: ----- wEventoTagliaBiglietto: ' + JSON.stringify(this.wEventoTagliaBiglietto));
  //console.log('selectedPosto: ----- this.wprenotazevento.scontabile: ' + this.wprenotazevento.scontabile);
  //return;



    this.wprenotazevento.idevento = this.evento.id;
    this.wprenotazevento.idlogistica = this.evento.idlogistica;
    this.wprenotazevento.persone = 1;
    this.wprenotazevento.idTipoBiglietto = this.wEventoTagliaBiglietto.id;
    this.wprenotazevento.idPosto = posto.id;
    let dataodierna = '';
    let mese = '';
    var data = new Date();
    var gg, mm, aaaa;
    gg = data.getDate() + "/";
    mm = data.getMonth() + 1
    if(mm < 10) {
       mese = '0' + mm;
    } else  {
      mese = mm;
    }
    mese = mese + "/";
    aaaa = data.getFullYear();
    dataodierna = gg + mese + aaaa;
    this.wprenotazevento.datapren = dataodierna;
   // normalizzo la dicitura del settore - fila - posto

   const str = posto.desposto;
   const lenstr = str.length;
   const searchPosto = 'POSTO';
   const searchFila = 'FILA';

   let postoUser = '';
   let settoreUser = '';
   let  filaUser = '';

   let startFila = 0;
   let startPosto = 0;
       startFila = str.indexOf(searchFila);
       startPosto = str.indexOf(searchPosto);

       console.log('stringa completa: ' + str);
   console.log(' ricerco POSTO: ' + str.indexOf(searchPosto) + ' startPosto ' + startPosto + ' lunghezza ' + str.length);
   console.log(' ricerco FILA: ' + str.indexOf(searchFila) + '  startFila ' + startFila);

   postoUser = str.substring(startPosto);  // ok
   filaUser = str.substring(startFila, (startPosto - 4)); // ok
   settoreUser = str.substring(0, (startFila - 1)); // ok

   // cancellazione localStorage
   localStorage.removeItem('prenEventoCognome');
   localStorage.removeItem('prenEventoNome');
   localStorage.removeItem('prenEventoEmail');
   localStorage.removeItem('prenEventoCell');

   localStorage.removeItem('prenEvPosto');
   localStorage.removeItem('prenEvFila');
   localStorage.removeItem('prenEvSettore');
   localStorage.removeItem('prenEvidPosto');



   // salvo i dati dell ultima registrazione
   localStorage.setItem('prenEventoCognome', this.wprenotazevento.cognome);
   localStorage.setItem('prenEventoNome', this.wprenotazevento.nome);
   localStorage.setItem('prenEventoEmail', this.wprenotazevento.email);
   localStorage.setItem('prenEventoCell', this.wprenotazevento.telefono);


   localStorage.setItem('prenEvPosto', postoUser);
   localStorage.setItem('prenEvFila', filaUser);
   localStorage.setItem('prenEvSettore', settoreUser);
   localStorage.setItem('prenEvidPosto', String(posto.id));

  // attenzione.  a questo punto dell'operatività non posso avere questi due dati s

   //  localStorage.setItem('tipoBiglietto', String(this.wEventoTagliaBiglietto.d_taglia));
   // localStorage.setItem('importoBiglietto', String(this.wEventoTagliaBiglietto.importo));

   console.log(' filaUser: ' + filaUser);
   console.log(' postoUser: ' + postoUser);
   console.log(' settoreUser: ' + settoreUser);
   /*
   settoreuser = str.substring(1,2));
   var str = "Apples are round, and apples are juicy.";
   console.log("(1,2): "    + str.substring(1,2));
   console.log("(0,10): "   + str.substring(0, 10));
   console.log("(5): "      + str.substring(5));
  */


   let rc = await this.wprenotazeventoService.create(this.wprenotazevento).subscribe(
    resp => {
          console.log('--------------------------selectedPosto ----------> :  ' + JSON.stringify(resp['data']));
          if(resp['rc'] === 'ok') {
            this.loadlast(posto);
          }
    },
    error => {
         alert('sono in selectedPosto');
         console.log('selectedPosto - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });

  }

  async loadlast(posto: EventoPosto) {
    let rc = await this.wprenotazeventoService.getLast().subscribe(
      resp => {
            console.log('--------------------------loadlast ----------> :  ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.wprenotazevento = resp['data'];

            //  alert('creato wprenotazevento')

            this.router.navigate(['/prenPosto/' + this.wprenotazevento.id + '/' + posto.id]);
              // this.openlogPostopop();   <--------  prima soluzione aprivo popup  (problemi da sistemare)
              }
      },
      error => {
           alert('sono in loadlast');
           console.log('loadlast - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
  }





goback() {
this.router.navigate(['/socio']);
}

reset() {
  alert('da fare');
  /*
this.socio = new Socio();
this.selectedOperativita = '?';
this.selectedSesso = '?';   */
}

async conferma() {
console.log('conferma - fase: ' + this.fase);

alert('da fare');
// controllo sulle date


/*
let rc = await  this.bandieragiallaService.getbyId(this.idBg).subscribe(
  res => {
        if(res['rc'] === 'ok') {
            this.bandieragialla = res['data'];
            this.newTessera = this.bandieragialla.ultimaTessera;
            this.newTessera = this.newTessera + 1;
            this.newTesseraStr = '';
            this.newTesseraStr = this.newTessera.toString();

            console.log('Nuova tessera: ' + this.newTesseraStr);
            if(this.newTesseraStr.length < 5) {
              console.log('----------------------     uscita 1 per normalizzazione tessera ' + this.newTesseraStr.length);

              for (let i = 0; i < this.lenmaxtessera -1; i++) {
                this.newTesseraStr = '0' + this.newTesseraStr;
                console.log('dentro al loop: I: ' + i + ' result: ' + this.newTesseraStr);
              }

              console.log('------- finita normalizzazione tessera ---------------     ' + this.newTesseraStr);

            }

            this.socio.key_utenti_operation = +localStorage.getItem('id');
            alert('numero tessera normalizzato a lunghezza 5: ' + this.newTesseraStr);

            switch (this.fase)  {
              case 'N':
                this.socio.tessera = this.newTesseraStr;
                console.log('pronto per fare inserimento ' + JSON.stringify(this.socio));
                let rc =  this.socioService.createSocio(this.socio).subscribe(
                    res => {
                          this.aggiornanumTessera(this.newTessera);
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

            console.log(`pronto per fare modifica : ${JSON.stringify(this.socio)}`);
            this.socio.key_utenti_operation = +localStorage.getItem('id');
            let rc1 = this.socioService.updateSocio(this.socio).subscribe(
                res => {
                      this.type = 'success';
                      this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                      this.alertSuccess = true;
                      this.showNotification( this.type, this.Message);
                      this.router.navigate(['/socio']);
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
     },
    error => {
       console.log(error);
       this.type = 'error';
       this.Message = error.message;
       this.alertSuccess = false;
       this.showNotification( this.type, this.Message);
    });
    */
}

/*  buttare
async aggiornanumTessera(numTessera: number) {
this.bandieragialla.ultimaTessera = numTessera;
let rc1 = await this.bandieragiallaService.update(this.bandieragialla).subscribe(
  res => {
          if(res['rc'] === 'ok') {
            this.type = 'success';
            this.Message =  res['message'];                               //'utente  creato con successo';
            this.alertSuccess = true;
            this.showNotification( this.type, this.Message);
            this.router.navigate(['/socio']);
          }
          if(res['rc'] === 'nf') {
            this.type = 'error';
            this.Message =  res['message'];                               //'utente  creato con successo';
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

// vecchia modalità non più usata ---  2023/05/15  --
// ora non devo creare ma utilizzare un eventoposto già esistente
async selectedPostoOld(posto: LogPosto) {
  console.log('selectedPosto ---   appenaentrato: ' + JSON.stringify(posto));

  if(this.evento.tipobiglietto === 2 && this.selectedtaglia === false) {
    this.type = 'error';
    this.Message = 'effettuare la selezione del tipo biglietto';
    this.alertSuccess = false;
    this.showNotification(this.type, this.Message);
    return;
  }

    if(this.selectedtaglia === true && this.wEventoTagliaBiglietto.d_taglia === 'RIDOTTO' && this.confermaRidotto ===  false) {

      console.log('selectedPosto: ----- selectedTaglia: ' + this.selectedtaglia );
      console.log('selectedPosto: ----- wEventoTagliaBiglietto: ' + JSON.stringify(this.wEventoTagliaBiglietto));
      console.log('selectedPosto  .....   this.confermaRidotto - flag conferma ' + this.confermaRidotto);
      this.type = 'error';
      this.Message = 'Per il biglietto scontato devi fare conferma';
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
      return;
    }

  // controllo se selazionato il tipo di biglietto



  /*
       da cancellare

    if("this.wEventoTagliaBiglietto.d_taglia === 'RIDOTTO'"){
      alert('biglietto ridotto');
      if("this.wprenotazevento.scontabile == 'N'"){
        alert('scontabile ' + this.wprenotazevento.scontabile);
        this.type = 'error';
        this.Message = 'Per il biglietto scontato devi fare conferma';
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
        return;
      }
      else {
        alert('prezzo scontatao verificato')
        return;
      }

    } else {
        alert('prezzo normale')
        return;
    }




    if("this.wEventoTagliaBiglietto.d_taglia === 'RIDOTTO' && this.wprenotazevento.scontabile != 'S'") {

      console.log('selectedPosto: ----- selectedTaglia: ' + this.selectedtaglia );
      console.log('selectedPosto: ----- wEventoTagliaBiglietto: ' + JSON.stringify(this.wEventoTagliaBiglietto));
      console.log('selectedPosto  .....   controllo prima di rilasciare posto - flag conferma ' + JSON.stringify(this.wprenotazevento));
      this.type = 'error';
      this.Message = 'Per il biglietto scontato devi fare conferma';
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
      return;
    }  else {
      alert('tutto ko');
      return;

    }

  */





  //console.log('selectedPosto: ----- selectedTaglia: ' + this.selectedtaglia );
  //console.log('selectedPosto: ----- wEventoTagliaBiglietto: ' + JSON.stringify(this.wEventoTagliaBiglietto));
  //console.log('selectedPosto: ----- this.wprenotazevento.scontabile: ' + this.wprenotazevento.scontabile);
  //return;



    this.wprenotazevento.idevento = this.evento.id;
    this.wprenotazevento.idlogistica = this.evento.idlogistica;
    this.wprenotazevento.persone = 1;
    this.wprenotazevento.idTipoBiglietto = this.wEventoTagliaBiglietto.id;
    this.wprenotazevento.idPosto = posto.id;
    let dataodierna = '';
    let mese = '';
    var data = new Date();
    var gg, mm, aaaa;
    gg = data.getDate() + "/";
    mm = data.getMonth() + 1
    if(mm < 10) {
       mese = '0' + mm;
    } else  {
      mese = mm;
    }
    mese = mese + "/";
    aaaa = data.getFullYear();
    dataodierna = gg + mese + aaaa;
    this.wprenotazevento.datapren = dataodierna;
   // normalizzo la dicitura del settore - fila - posto

   const str = posto.desposto;
   const lenstr = str.length;
   const searchPosto = 'POSTO';
   const searchFila = 'FILA';

   let postoUser = '';
   let settoreUser = '';
   let  filaUser = '';

   let startFila = 0;
   let startPosto = 0;
       startFila = str.indexOf(searchFila);
       startPosto = str.indexOf(searchPosto);

       console.log('stringa completa: ' + str);
   console.log(' ricerco POSTO: ' + str.indexOf(searchPosto) + ' startPosto ' + startPosto + ' lunghezza ' + str.length);
   console.log(' ricerco FILA: ' + str.indexOf(searchFila) + '  startFila ' + startFila);

   postoUser = str.substring(startPosto);  // ok
   filaUser = str.substring(startFila, (startPosto - 4)); // ok
   settoreUser = str.substring(0, (startFila - 1)); // ok

   localStorage.setItem('prenEvPosto', postoUser);
   localStorage.setItem('prenEvFila', filaUser);
   localStorage.setItem('prenEvSettore', settoreUser);
   localStorage.setItem('prenEvidPosto', String(posto.id));

  // attenzione.  a questo punto dell'operatività non posso avere questi due dati s

   //  localStorage.setItem('tipoBiglietto', String(this.wEventoTagliaBiglietto.d_taglia));
   // localStorage.setItem('importoBiglietto', String(this.wEventoTagliaBiglietto.importo));

   console.log(' filaUser: ' + filaUser);
   console.log(' postoUser: ' + postoUser);
   console.log(' settoreUser: ' + settoreUser);
   /*
   settoreuser = str.substring(1,2));
   var str = "Apples are round, and apples are juicy.";
   console.log("(1,2): "    + str.substring(1,2));
   console.log("(0,10): "   + str.substring(0, 10));
   console.log("(5): "      + str.substring(5));
  */


    let rc = await this.wprenotazeventoService.create(this.wprenotazevento).subscribe(
      resp => {
            console.log('--------------------------selectedPosto ----------> :  ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.loadlastOld(posto);
            }
      },
      error => {
           alert('sono in selectedPosto');
           console.log('selectedPosto - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
  }


  // ora utilizzo eventoPosto e non logPosto
  async loadlastOld(posto: LogPosto) {
    let rc = await this.wprenotazeventoService.getLast().subscribe(
      resp => {
            console.log('--------------------------loadlast ----------> :  ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {
              this.wprenotazevento = resp['data'];

            //  alert('creato wprenotazevento')

            this.router.navigate(['/prenPosto/' + this.wprenotazevento.id + '/' + posto.id]);
              // this.openlogPostopop();   <--------  prima soluzione aprivo popup  (problemi da sistemare)
              }
      },
      error => {
           alert('sono in loadlast');
           console.log('loadlast - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
  }




async countEvento(evento: Evento) {

  let rc = await  this.prenotazeventoService.getCountbyevento(evento.id).subscribe(
    response => {

      console.log('rc dopo countbyevento ' + response['rc'] + ' evento.id ' + evento.id);
        if(response['rc'] === 'ok') {
          this.prenotati =  response['prenotati'];
          this.disponibili = evento.nposti - response['prenotati'];
          // test
          // this.disponibili = 5;  // togliere dopo il test


       }
    },
    error => {
        alert('loadManifActive: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadManifActive' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
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

// per gestione zoom immagine locandina
//  metodi per gestire la versione alternativa della visualizzazione immagine -- non funziona corettamente
valueChanged(value: number) {
  if (value === 1) {
    this.scaleRange = 1;
  } else {
    this.scaleRange = value;
  }
}

scroll(magnification: number) {
  this.scaleRange = magnification;
}
mouseMove(event) {
  this.xValue = event.x;
  this.yValue = event.y;
}

ViewSettori() {
  alert('selezionare i settori  -- da fare')
}

ViewFile() {   // settore: string
  alert('selezionare i file  -- da fare')
}

ViewPosti() {   // settore: string sefila: number
  alert('selezionare i posti  -- da fare')
}

confermaScontabile(event) {
//  console.log(event.target.checked)
// alert('ho premuto: ' + event.target.checked );
this.confermaRidotto = event.target.checked;
if(event.target.checked === true) {
  this.wprenotazevento.scontabile = 'S';
}
if(event.target.checked === false) {
  this.wprenotazevento.scontabile = 'N';
}


}




async SelectTaglia(id: number) {

  let rc = await  this.wEventoTagliaBigliettoService.getbyid(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.selectedtaglia = true;
          this.wEventoTagliaBiglietto =  response['data'];
        }
    },
    error => {
        alert('SelectTaglia: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore SelectTaglia' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


}
