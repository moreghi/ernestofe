

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
import { EventoPosto } from '../../../classes/Eventoposto';
import { PrenotazeventomasterConfirm } from './../../../classes/PrenotazeventomasterConfirm';
import { Bandieragialla } from './../../../classes/BandieraGialla';

import { EventoSettore } from './../../../classes/Eventosettore';
import { EventoFila } from './../../../classes/Eventofila';


// Service
import { EventoService } from './../../../services/evento.service';
import { PrenotazeventoService } from './../../../services/prenotazevento.service';
import { W_PrenotazeventoService } from './../../../services/w_prenotazevento.service';
import { PrenotazeventomasterConfirmService } from './../../../services/prenotazeventomaster-confirm.service';
import { LocandinaService } from './../../../services/locandina.service';
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { WEventoTagliaBigliettoService } from './../../../services/w-evento-taglia-biglietto.service';
import { LogsettoreService } from './../../../services/logsettore.service';
import { LogfilaService } from './../../../services/logfila.service';
import { LogpostoService } from './../../../services/logposto.service';
import { EventopostoService } from './../../../services/eventoposto.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';

import { EventosettoreService } from './../../../services/eventosettore.service';
import { EventofilaService } from './../../../services/eventofila.service';



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
 public wprenotazeventocopy: W_Prenotazevento;

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
 public eventoPostipren : EventoPosto[] = [];
 public prenotazeventomasterConfirm: PrenotazeventomasterConfirm;
 public bandieragialla: Bandieragialla;

 public eventoSettori: EventoSettore[] = [];
 public eventoFile: EventoFila[] = [];


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
public presentiPrenotazioni = false;
public cognomeRef = '';
public nomeRef = '';
public emailRef = '';
public telefonoRef = '';
public importoTotb = 0;
public idYellowFlag = 1;
public oggixx;
public datadelGiorno = '';
public dataeventoddmmyyyy = '';
public abilitynewPrenot = false;

//  parametri per zoom della locandina
//  https://stackoverflow.com/questions/73838711/how-to-use-ngx-img-zoom-with-html-range-in-angular
scaleRange: number;
xValue: number;
yValue: number;



 constructor(private eventoService: EventoService,
             private locandinaService: LocandinaService,
             private prenotazeventoService: PrenotazeventoService,
             private wprenotazeventoService: W_PrenotazeventoService,
             private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
             private logsettoreService: LogsettoreService,
             private logfilaService: LogfilaService,
             private logpostoService: LogpostoService,
             private ttipobigliettoService: TtipobigliettoService,
             private wEventoTagliaBigliettoService: WEventoTagliaBigliettoService,
             private eventopostoService: EventopostoService,
             private bandieragiallaService: BandieragiallaService,
             private eventosettoreService: EventosettoreService,
             private eventofilaService: EventofilaService,
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
  this.dataOdierna = new Date(date).toLocaleDateString('it-IT');;

  this.isVisible = true;
  this.alertSuccess = true;
  this.loadedlogPosti = false;
  this.presentiPrenotazioni = false;
  this.abilitynewPrenot = false;

  this.rotta = this.route.snapshot.url[0].path;
  this.rottafase = this.route.snapshot.url[1].path;
  this.rottaEvento = +this.route.snapshot.url[2].path;
 // this.rottaPosto = +this.route.snapshot.url[3].path;

  console.log('----- rotta ..................  ------ ' + this.rotta);
  console.log('----- rottaEvento  +++++++++   ------ ' + this.rottaEvento);
  console.log('----- rottafase ------::::::: ' + this.rottafase);
  //console.log('----- rottaposto ---------________ ' + this.rottaPosto);
  this.loadBandieragialla(this.idYellowFlag);


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
      console.log('ESISTE il localstorage ...tokenPrenotazione...')
    }
    this.wprenotazevento.token = this.token;    // (Math.random() + 1).toString(36).substring(2,7);





   // this.wprenotazevento.token = (Math.random() + 1).toString(36).substring(2,7);
console.log('token: ' + JSON.stringify(this.wprenotazevento));
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


async loadBandieragialla(id: number) {

  console.log('frontend - loadEvento: ' + id);
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
        console.log('evento da editare : ' + JSON.stringify(response['data']));
        this.evento = response['data'];
        this.loadLocandina(this.evento);

        if(this.evento.idlogistica > 0) {   // se ho posti con logistica
          this.stato = 0;
          this.loadSettoriSelected(this.evento.idlogistica, this.stato, this.evento.id);
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
       this.token = localStorage.getItem('tokenPrenotazione');
       console.log('ho verificato se esisteva il token ' + this.token);
       if(this.token !== null) {
         this.loadPostiPrenotati(this.token);
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
            console.log('loadPostiPrenotati  ' + JSON.stringify(response['data']));
            this.eventoPostipren = response['data'];
            this.presentiPrenotazioni = true;
            this.importoTotb = response['imptotale'];

          //  fare il get di tutti e 4 i campi

               this.cognomeRef = localStorage.getItem('prenEvCognome');
               this.nomeRef = localStorage.getItem('prenEvNome');
               this.emailRef = localStorage.getItem('prenEvEmail');
               this.telefonoRef = localStorage.getItem('prenEviTelefono');

            console.log('loadPostiPrenotati  ---- dati del referente salvati in localStorage ' + this.cognomeRef);
              this.wprenotazevento.cognome = this.cognomeRef;
              this.wprenotazevento.nome = this.nomeRef;
              this.wprenotazevento.email = this.emailRef;
              this.wprenotazevento.telefono = this.telefonoRef;

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



async loadSettoriSelected(id: number, stato: number, idEvento: number) {
  console.log('frontend - loadSettoriSelected: ' + id);
  let rc = await  this.eventosettoreService.getbyIdEventoLogisticaActive(id, idEvento, stato).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('loadSettoriSelected  ' + JSON.stringify(response['data']));
      this.eventoSettori = response['data'];
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

//  vecchio metodo che utilizzava logSettore
// sostituito da eventosettore dal 26/05/5023
/*
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
*/










  async  viewfilebySettore(settore: EventoSettore) {

    this.nameselectedSettoreview = settore.dsettore
    this.nameselectedFilaview = '';
    this.workSettoreDetail.dsettore = settore.dsettore;   // per editarlo sulla testata delle file

    this.SettoreSelected = true;
    this.FilaSelected = false;



    let idlog = settore.idLogistica;
    let id = settore.id  // per anomalia ho utilizzato idSAettore al aposto di id
    let idEvento = settore.idEvento;
    let dsettore = settore.dsettore;
    let stato = 0;

    console.log('viewfilebySettore  --- appena entrato ' + id);

    let rc = await this.eventofilaService.getbyeventoLogisticaSettoreStato(idlog, idEvento, id, stato).subscribe(
        resp => {
              console.log('--------------------------viewfilebySettore ----------> :  ' + JSON.stringify(resp['data']));
              if(resp['rc'] === 'ok') {
                this.eventoFile = resp['data'];

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

      console.log('viewpostobyfila  --- appena entrato ' + id);


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
  // salvo i dati del richiedente
  this.wprenotazeventocopy = new W_Prenotazevento();
  this.wprenotazeventocopy.cognome = this.wprenotazevento.cognome;
  this.wprenotazeventocopy.nome = this.wprenotazevento.nome
  this.wprenotazeventocopy.email = this.wprenotazevento.email;
  this.wprenotazeventocopy.telefono = this.wprenotazevento.telefono;
  this.wprenotazeventocopy.token = this.wprenotazevento.token;

  console.log('------------------------------------------------->>>>>>>>> fatta copia di wprenotazevento ' + JSON.stringify(this.wprenotazeventocopy));

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
 // salvo i dati del referente su localStoragwe
 localStorage.setItem('prenEvCognome', this.wprenotazevento.cognome);
 localStorage.setItem('prenEvNome', this.wprenotazevento.nome);
 localStorage.setItem('prenEvEmail', this.wprenotazevento.email);
 localStorage.setItem('prenEviTelefono', this.wprenotazevento.telefono);


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

NuovaPrenotazione() {
  alert('nuova prenotazione')
}




reset() {
  alert('da fare');
  /*
this.socio = new Socio();
this.selectedOperativita = '?';
this.selectedSesso = '?';   */
}

async  test() {

if(this.wprenotazevento.cognome === '' || this.wprenotazevento.cognome === '') {
  this.type = 'error';
  this.Message = 'inserire i dati del referente';
  this.alertSuccess = false;
  this.showNotification( this.type, this.Message);
return;
}



  const dataxx = new Date();

  let dd = dataxx.getDate();
  let mm = dataxx.getMonth() + 1;
  let yyyy = dataxx.getFullYear();
  let dd_s: string;
  let mm_s: string;
  let yyyy_s: string;
  console.log('dd ' + dd + ' mm ' + mm + 'yyyy: ' + yyyy);
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
  this.datadelGiorno = dd_s + '/' + mm_s + '/' + yyyy;


// --   data this.evento
console.log('dataevento: ' + this.evento.data);
dd_s = this.evento.data.slice(8);
mm_s = this.evento.data.slice(5, 7);
yyyy_s = this.evento.data.slice(0, 4);
console.log('dd_s ' + dd_s);
console.log('mm_s ' + mm_s);
console.log('yyyy_s ' + yyyy_s);
this.dataeventoddmmyyyy = dd_s + '/' + mm_s + '/' + yyyy_s;

console.log('dataeventoddmmyyyy: ' + this.dataeventoddmmyyyy);

this.prenotazeventomasterConfirm = new PrenotazeventomasterConfirm();
this.prenotazeventomasterConfirm.idEvento = this.evento.id;
this.prenotazeventomasterConfirm.cognome = this.wprenotazevento.cognome;
this.prenotazeventomasterConfirm.nome = this.wprenotazevento.nome;
this.prenotazeventomasterConfirm.email = this.wprenotazevento.email;
this.prenotazeventomasterConfirm.telefono = this.wprenotazevento.telefono;
this.prenotazeventomasterConfirm.token = this.wprenotazevento.token;
this.prenotazeventomasterConfirm.dataEvento = this.dataeventoddmmyyyy;  // this.evento.data;
this.prenotazeventomasterConfirm.datapren = this.datadelGiorno;
this.prenotazeventomasterConfirm.descEvento = this.evento.descrizione;
this.prenotazeventomasterConfirm.oraEvento = this.evento.ora;
this.prenotazeventomasterConfirm.importo = this.importoTotb;
this.prenotazeventomasterConfirm.codpren = (Math.random() + 1).toString(36).substring(2,7);

 console.log('pronto per registare il Maste: ' + JSON.stringify(this.prenotazeventomasterConfirm));

 let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
   res => {
         if(res['rc'] === 'ok') {
             this.type = 'success';
             this.Message = 'Creato correttamente file Master ----  da inviuare  email';          //'utente aggiornato con successo del cazzo';
             this.alertSuccess = true;
             this.showNotification( this.type, this.Message);
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



async conferma(wprenotazevento: W_Prenotazevento) {

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

  this.prenotazeventomasterConfirm = new PrenotazeventomasterConfirm();
  this.prenotazeventomasterConfirm.idEvento = this.evento.id;
  this.prenotazeventomasterConfirm.cognome = this.wprenotazevento.cognome;
  this.prenotazeventomasterConfirm.nome = this.wprenotazevento.nome;
  this.prenotazeventomasterConfirm.email = this.wprenotazevento.email;
  this.prenotazeventomasterConfirm.telefono = this.wprenotazevento.telefono;
  this.prenotazeventomasterConfirm.token = this.wprenotazevento.token;
  this.prenotazeventomasterConfirm.dataEvento = this.dataeventoddmmyyyy;  // this.evento.data;
  this.prenotazeventomasterConfirm.datapren = this.datadelGiorno;
  this.prenotazeventomasterConfirm.descEvento = this.evento.descrizione;
  this.prenotazeventomasterConfirm.oraEvento = this.evento.ora;
  this.prenotazeventomasterConfirm.importo = this.importoTotb;
  this.prenotazeventomasterConfirm.codpren = (Math.random() + 1).toString(36).substring(2,7);
  this.prenotazeventomasterConfirm.iban = this.bandieragialla.iban;

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















function dateformat(arg0: Date, arg1: string) {
  throw new Error('Function not implemented.');
}

// metodo vecchio che ountava su logSettore/LogFile
/*
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
*/
