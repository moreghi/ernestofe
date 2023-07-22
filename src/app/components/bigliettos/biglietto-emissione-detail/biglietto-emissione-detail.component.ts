import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Ttipopagamento} from '../../../classes/T_tipo_pagamento';
import { EventoSettore } from '../../../classes/Eventosettore';
import { LogFila } from '../../../classes/Logfila';
import { EventoPosto } from '../../../classes/Eventoposto';
import { Prenotazevento } from '../../../classes/Prenotazevento';
import { Cassa } from '../../../classes/Cassa';
import { Cassamov } from '../../../classes/Cassamov';
import { Biglietto } from '../../../classes/Biglietto'

import {  faSave, faEuroSign, faPlus, faDollarSign, faTrash, faReply, faMoneyCheck,faMoneyBill, faPlusSquare, faSearch, faUserEdit, faMinus, faWindowClose} from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoService } from '../../../services/prenotazevento.service';
import { TtipobigliettoService } from '../../../services/ttipobiglietto.service';
import { TtipopagamentoService } from '../../../services/ttipopagamento.service';
import { ManifestazioneService } from '../../../services/manifestazione.service';
import { EventoService } from '../../../services/evento.service';
import { EventosettoreService } from '../../../services/eventosettore.service';
import { LogfilaService } from '../../../services/logfila.service';
import { EventopostoService } from '../../../services/eventoposto.service';
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';
import { BigliettoService } from './../../../services/biglietto.service';

import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-biglietto-emissione-detail',
  templateUrl: './biglietto-emissione-detail.component.html',
  styleUrls: ['./biglietto-emissione-detail.component.css']
})
export class BigliettoEmissioneDetailComponent implements OnInit {

  public title = 'Emissione Biglietto da prenotazione';
  public error = [];


  public pren: Prenotazevento;
  public tipobiglietto: Ttipobiglietto;
  public tipopagamento: Ttipopagamento;
  public manif: Manifestazione;
  public evento: Evento;
  public eventoposto: EventoPosto;
  public eventosettore: EventoSettore;
  public logfila: LogFila;
  public cassa: Cassa;
  public cassamov: Cassamov;
  public biglietto: Biglietto;

  public datapre = '';
  public datagiaRichiesta = false;


  public dataSelected = '';
  public dataPrenotata: string;       //Date;
  public numPre = 0;
  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  faReply = faReply;
  faEuroSign = faEuroSign;
  faDollarSign = faDollarSign;
  faMoneyBill = faMoneyBill;
  faMoneyCheck = faMoneyCheck;


  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public manifActive = 1;
  public manAct = 0;


  options = [
    'Contanti',
    'Bonifico',
    'Elettronico'
  ];


  public visibleConferma = true;
  public idpassed = 0;
  public dataEvento: Date;
  public statoAttivo = 0;
  public tipoPagamento = '?';
  public validOption = false;
  public visibleContanti = false;
  public emessobiglietto = false;
  public nrich = 0;
  public dataOdierna;
  public datadioggi = '';
  public numerobigliettoedit = '';
  public bigliettoemesso = false;
  public lencampo = 0;
  public presentaCassa = false;
  public openNewCassa = false;
  public modifyCassa = false;
  public chiusuraCassa = false;
  public Message1 = 'messaggio di mersa'
  public cassaInizialeimporto = 0;

// per normalizzare la descrizione del Posto

public searchPosto = 'POSTO';
public searchFila = 'FILA';

public postoUser = 'posto ';
public settoreUser = '';
public filaUser = '';

public startFila = 0;
public startPosto = 0;
public tPagamento = '';
public keyPagamento = 0;
public effettuatoIncasso = false;

  constructor(private prenotazeventoService: PrenotazeventoService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private eventopostoService: EventopostoService,
              private tipobigliettoService: TtipobigliettoService,
              private tipopagamentoService: TtipopagamentoService,
              private eventosettoreService: EventosettoreService,
              private logfilaService: LogfilaService,
              private cassaService: CassaService,
              private cassamovService: CassamovService,
              private bigliettoService: BigliettoService,
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
   //this.goTest();
  }


goTest() {
  this.title = 'prova per correttezza form';
  this.eventoposto = new EventoPosto();
  this.eventoposto.id = 9999;
  this.Message = 'sono in test';
  this.isVisible = true;
  this.alertSuccess = true;
}




  goApplication() {

    console.log('goApplication - biglietto-detail --------  appena entrato');
    this.resetinitial();
    this.route.paramMap.subscribe(p => {
    this.idpassed = +p.get('id');
    console.log('id recuperato: ' + this.idpassed);


    this.loadEventoPosto(this.idpassed);

    this.Message = 'pronto per acquisto biglietto';
    });
}

resetinitial() {

    this.isVisible = true;
    this.alertSuccess = true;
    this.openNewCassa = false;
    this.modifyCassa = false;
    this.chiusuraCassa = false;
    this.tPagamento = 'C';
    this.keyPagamento = 1;
    this.pagamentoperContanti = true;
    this.confermaPagamentonoContanti = false;
    this.effettuatoIncasso = false;

    this.biglietto = new Biglietto();

    const date = Date();
    this.dataOdierna = new Date(date);
    this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
}

async loadEventoPosto(id: number) {
  console.log('frontend - loadPrenotazEvento: ' + id);
  let rc = await  this.eventopostoService.getbyId(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.eventoposto = response['data'];
          this.loadEvento(this.eventoposto.idEvento);
          if(this.eventoposto.idSettore > 0) {
            this.normalisePosto(this.eventoposto);
           } else {
            this.Message = 'test';    // da togliere
             this.filaUser = '';
             this.postoUser = '';
             this.settoreUser = '';
         //   this.loadSettore(this.eventoposto.idEvento,this.eventoposto.idSettore);  // ok
         //   this.loadFila(this.eventoposto.idFila);
          }
          this.loadCassadelGiorno(this.datadioggi, this.eventoposto.idEvento);
          this.loadtipoBiglietto(this.eventoposto.tipobiglietto);
       }
    },
    error => {
        alert('loadBiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadBiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

async normalisePosto(posto: EventoPosto) {

  /*
  this.wprenotazevento.idevento = this.evento.id;
  this.wprenotazevento.idlogistica = this.evento.idlogistica;
  this.wprenotazevento.persone = 1;
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
*/

 // normalizzo la dicitura del settore - fila - posto

 const str = posto.desposto;
 const lenstr = str.length;
 const searchPosto = 'POSTO';
 const searchFila = 'FILA';

 let startFila = 0;
 let startPosto = 0;
     startFila = str.indexOf(searchFila);
     startPosto = str.indexOf(searchPosto);

     console.log('stringa completa: ' + str);
 console.log(' ricerco POSTO: ' + str.indexOf(searchPosto) + ' startPosto ' + startPosto + ' lunghezza ' + str.length);
 console.log(' ricerco FILA: ' + str.indexOf(searchFila) + '  startFila ' + startFila);

 this.postoUser = str.substring(startPosto);  // ok
 this.filaUser = str.substring(startFila, (startPosto - 4)); // ok
// this.settoreUser = str.substring(0, (startFila - 1)); // ok
 this.settoreUser = str.substring(0, 10); // ok





 console.log(' filaUser: ' + this.filaUser);
 console.log(' postoUser: ' + this.postoUser);
 console.log(' settoreUser: ' + this.settoreUser);
 /*
 settoreuser = str.substring(1,2));
 var str = "Apples are round, and apples are juicy.";
 console.log("(1,2): "    + str.substring(1,2));
 console.log("(0,10): "   + str.substring(0, 10));
 console.log("(5): "      + str.substring(5));
*/


}






openCassa() {
  localStorage.removeItem('cassaEvento');
  localStorage.removeItem('idPagamento');
  localStorage.setItem('cassaEvento', JSON.stringify(this.eventoposto.idEvento));
  localStorage.setItem('idPagamento', JSON.stringify(this.eventoposto.id));
  this.router.navigate(['cassa/' + this.datadioggi + '/tipo/A/' + this.eventoposto.idEvento]);

}
chiudiCassa() {
  localStorage.removeItem('cassaEvento');
  localStorage.removeItem('idPagamento');
  localStorage.setItem('cassaEvento', JSON.stringify(this.eventoposto.idEvento));
  localStorage.setItem('idPagamento', JSON.stringify(this.eventoposto.id));
  this.router.navigate(['cassa/' + this.datadioggi + '/tipo/C/' + this.eventoposto.idEvento]);

}
VisualizzaCassa() {
  localStorage.removeItem('cassaEvento');
  localStorage.removeItem('idPagamento');
  localStorage.setItem('cassaEvento', JSON.stringify(this.eventoposto.idEvento));
  localStorage.setItem('idPagamento', JSON.stringify(this.eventoposto.id));
  this.router.navigate(['cassa/' + this.datadioggi + '/tipo/V/' + this.eventoposto.idEvento]);
}


/*   vecchia modalità -- non in uso dal   25/05/2023
openCassa() {
  this.openNewCassa = true;
}


modificaCassa() {
  this.openNewCassa = false;
  this.chiusuraCassa = false;
  this.modifyCassa = true;
}

chiudiCassa() {
  this.openNewCassa = false;
  this.modifyCassa = false;
  this.chiusuraCassa = true;

}




GestisciCassaIniziale(cassa: Cassa) {
  console.log('GestisciCassaIniziale ................ : appena entrato ----------  ' + JSON.stringify(cassa));


  // apertura cassa
  if(this.presentaCassa === false) {
    if(cassa.cassaIniziale < 0) {
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'inserire un valore Maggiore di zero';
      this.showNotification(this.type, this.Message);
      return;
    } else {
      this.RegistraCassaIniziale(cassa.cassaIniziale);
    }
  }
}


GestisciCassaFinale(cassa: Cassa) {
console.log('GestisciCassaFinale: appena entrato ----------  ' + JSON.stringify(cassa));

  // apertura cassa
    if(this.presentaCassa === true) {
      if(cassa.cassaFinale < 0) {
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'inserire un valore Maggiore di zero';
        this.showNotification(this.type, this.Message);
        return;
      } else {
        this.RegistraCassaFinale(cassa.cassaFinale);
      }
    }
  }


  async RegistraCassaFinale(importo: number) {
    console.log('frontend - RegistraCassaFinale: ' + importo);
    this.cassa.cassaFinale = importo;
    this.cassa.stato = 2;
    let rc = await  this.cassaService.create(this.cassa).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.presentaCassa = true;
          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Cassa giornaliera Chiusa correttamente ';
          this.showNotification(this.type, this.Message);
          }
     },
    error => {
        alert('loadCassadelGiorno: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadCassadelGiorno' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
  }


async RegistraCassaIniziale(importo: number) {
  console.log('frontend - RegistraCassaIniziale: ' + importo);
  this.cassa.datacassa = this.datadioggi;
  this.cassa.idEvento = this.eventoposto.idEvento;
  this.cassa.cassaIniziale = importo;
  this.cassa.stato = 1;
  let rc = await  this.cassaService.create(this.cassa).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.presentaCassa = true;
        this.isVisible = true;
        this.alertSuccess = true;
        this.type = 'success';
        this.Message = 'Cassa giornaliera aperta correttamente ';
        this.showNotification(this.type, this.Message);
        }
   },
  error => {
      alert('loadCassadelGiorno: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadCassadelGiorno' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}
*/




async loadCassadelGiorno(datadioggi: string, idEvento: number) {
  console.log('frontend  Biglietto-emissione-detail - loadCassadelGiorno: ' + datadioggi + ' evento: ' + idEvento);
  let rc = await  this.cassaService.getbydata(datadioggi,idEvento).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.cassa = response['data'];
        this.presentaCassa = true;
       }
       if(response['rc'] === 'nf') {
        this.cassa = new Cassa();
        this.cassa.datacassa =  this.datadioggi;
        this.cassa.cassaIniziale = 0;
        this.presentaCassa = false;
        // invio messaggio per effettuare apertura cassa
        this.isVisible = true;
        this.alertSuccess = true;
        this.type = 'success';
        this.Message = 'cliccare sul pulsante Apri per inserire la Cassa';
        this.showNotification(this.type, this.Message);
       }
  },
  error => {
      alert('loadCassadelGiorno: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadCassadelGiorno' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}

async loadEvento(id: number) {
  console.log('frontend - loadEvento: ' + id);
  let rc = await  this.eventoService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.evento = response['data'];
        this.dataEvento = new Date(this.evento.data);

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

async loadSettore(idEvento: number,id: number) {
  console.log('frontend - loadSettore: ' + id);
  let rc = await  this.eventosettoreService.getbyIdEventoSettore(idEvento,id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.eventosettore = response['data'];
       }
  },
  error => {
      alert('loadSettore: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadSettore' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}


async loadFila(id: number) {
  console.log('frontend - loadFila: ' + id);
  let rc = await  this.logfilaService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.logfila = response['data'];
       }
  },
  error => {
      alert('loadFila: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadFila' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}

public confermaPagamentonoContanti = false;
public pagamentoperContanti = false;

confermaPagamentonocontanti(event) {
//  console.log(event.target.checked)
// alert('ho premuto: ' + event.target.checked );
this.confermaPagamentonoContanti = event.target.checked;
/*
if(event.target.checked === true) {
  this.wprenotazevento.scontabile = 'S';
}
if(event.target.checked === false) {
  this.wprenotazevento.scontabile = 'N';
} */
}


async loadtipoBiglietto(id: number) {
  console.log('frontend - loadtipoBiglietto: ' + id);
  let rc = await  this.tipobigliettoService.getbytipologia(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.tipobiglietto = response['data'];
        this.biglietto.importo = this.tipobiglietto.importo;
       }
  },
  error => {
      alert('loadFila: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadtipoBiglietto' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}


async loadtipopagamento(id: number) {
  console.log('frontend - loadtipopagamento: ' + id);
  let rc = await  this.tipopagamentoService.getbyid(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.tipopagamento = response['data'];
       }
  },
  error => {
      alert('loadtipopagamento: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadtipopagamento' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}

onSelectionChange(tipo: string)   {

  switch (tipo) {
              case 'Contanti':
                this.tPagamento = 'C';
                this.keyPagamento = 1;
                this.pagamentoperContanti = true;
                this.Message = 'Inserire importo del biglietto';
                break;
              case 'Bonifico':
                this.tPagamento = 'B';
                this.keyPagamento = 7;
                this.confermaPagamentonoContanti = false;
                this.pagamentoperContanti = false;
                this.Message = 'Confermare la ricezione del Bonifico';
                break;
              case 'Elettronico':
                this.tPagamento = 'E';
                this.keyPagamento = 6;
                this.confermaPagamentonoContanti = false;
                this.pagamentoperContanti = false;
                this.Message = 'Confermare la ricezione del Pagamento elettronico (Pos / Carta Credito)';
                break;
              default:
                this.keyPagamento = 0;
                alert('Scelta errata \n ricerca non possibile');
                break;
     }
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

goback() {
  this.router.navigateByUrl('/pronotevento');
}

incassaImportoBiglietto(biglietto: Biglietto) {

  if(biglietto.importo < 0) {
    this.Message = "importo da incassare non può essere negativo";
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    return;
  }


  if(biglietto.importo != this.tipobiglietto.importo) {
    this.Message = "importo da incassare deve essere di € " + this.tipobiglietto.importo;
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    return;
  }
  this.Message = '';
  this.isVisible = true;
  this.alertSuccess = true;
  this.type = 'success';
  this.loadtipologiaBiglietto(this.eventoposto.tipobiglietto);


}


async loadtipologiaBiglietto(tipobiglietto: number) {
console.log('loadtipologiaBiglietto ---------' + tipobiglietto)
    let rc = await  this.tipobigliettoService.getbytipologia(tipobiglietto).subscribe(
      response => {
          if(response['rc'] === 'ok') {
           this.tipobiglietto = response['data'];
           this.tipobiglietto.ultimoemesso =  this.tipobiglietto.ultimoemesso + 1;
           this.tipobiglietto.nemessi = this.tipobiglietto.nemessi + 1;
           console.log('pronto ad aggiornare ultimo emesso ' + JSON.stringify(this.tipobiglietto));
           this.aggiornaultimoemesso(this.tipobiglietto);
          // inibisco la visualizzazioe del bottone conferma
           this.effettuatoIncasso = true;
           this.pagamentoperContanti === false;
           this.confermaPagamentonoContanti === false;
            }
      },
      error => {
          alert('loadtipologiaBiglietto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore loadtipologiaBiglietto' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });

}


async aggiornaultimoemesso(tipobiglietto: Ttipobiglietto) {
  console.log('aggiornaultimoemesso ---------' + JSON.stringify(tipobiglietto))
  let rc = await  this.tipobigliettoService.update(tipobiglietto).subscribe(
    response => {

      console.log('rc: ' + response['rc'])
        if(response['rc'] === 'ok') {

          console.log('data: ' + JSON.stringify(response['data']))
           this.tipobiglietto = response['data'];
           console.log('rileggo tipobiglietto ' + JSON.stringify(this.tipobiglietto))
           console.log('ora vado ad aggiornare eventoPosto: ' + JSON.stringify(this.eventoposto))
           this.aggiornaeventoPosto(this.eventoposto, this.tipobiglietto.ultimoemesso);
         }
    },
    error => {
        alert('aggiornaultimoemesso: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore aggiornaultimoemesso' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


async aggiornaeventoPosto(eventoPosto: EventoPosto, ultimoem: number)  {
   console.log('----------------------------------------------- aggiornaeventoPosto ' + JSON.stringify(eventoPosto) + '  ultimo emesso: ' + ultimoem);
  eventoPosto.stato = 2;
  eventoPosto.dataemi = this.datadioggi;
  eventoPosto.idbiglietto = ultimoem;

  let rc = await  this.eventopostoService.update(eventoPosto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.emettibiglietto(this.tipobiglietto.ultimoemesso);
         }
    },
    error => {
        alert('aggiornaeventoPosto: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore aggiornaeventoPosto' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

async emettibiglietto(numeroemesso: number) {
  console.log('emettibiglietto ............... ' + numeroemesso);
  this.biglietto.evento = this.eventoposto.idEvento;
  this.biglietto.idprenotazione = this.eventoposto.id;
  this.biglietto.tipo = this.eventoposto.tipobiglietto;
  this.biglietto.numero = numeroemesso;
  this.biglietto.importo = this.tipobiglietto.importo;
  this.biglietto.cognome = this.eventoposto.cognome;
  this.biglietto.nome = this.eventoposto.nome;
  this.biglietto.email = this.eventoposto.email;
  this.biglietto.cellulare = this.eventoposto.cellulare;
  this.biglietto.stato = 1;
  this.biglietto.datapre = this.eventoposto.datapre;
  this.biglietto.dataconf = this.eventoposto.dataconf;
  this.biglietto.dataemi = this.datadioggi;
  this.biglietto.settore = this.eventoposto.idSettore;
  this.biglietto.fila = this.eventoposto.idFila;
  this.biglietto.posto = this.eventoposto.idPosto;
  this.biglietto.modpag = this.keyPagamento;
  this.biglietto.key_utenti_operation = 1;

  let rc = await  this.bigliettoService.create(this.biglietto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.bigliettoemesso = true;
          // registrazione cassa
         this.registraCassa(this.biglietto, numeroemesso)
         }
    },
    error => {
        alert('emettibiglietto: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore emettibiglietto' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


async registraCassa(biglietto: Biglietto, numeroemesso: number) {

  let AggionaCassaFinale = false;
  switch (biglietto.modpag) {
    case 1:
      AggionaCassaFinale = true;
      break;
    case 7:AggionaCassaFinale
      AggionaCassaFinale = false;
      break;
    case 6:
      AggionaCassaFinale = false;
      break;
    default:
      AggionaCassaFinale = false;;
      break;
    }

   if(AggionaCassaFinale === true) {
    this.cassa.incassi = this.cassa.incassi + biglietto.importo;
    this.cassa.cassaFinale = this.cassa.cassaIniziale + this.cassa.incassi;
   }

  let rc = await  this.cassaService.update(this.cassa).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.registraMovCassa(biglietto.importo, numeroemesso);
         }
    },
    error => {
        alert('registraCassa: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore registraCassa' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

}

async registraMovCassa(importo: number, numeroemesso: number) {

  // su crete biglietto  fare anche lettura ultimo (vedi eventofila)  per poter aggiornare eevntoposto

  this.cassamov = new Cassamov();
  this.cassamov.idcassa = this.cassa.id;
  this.cassamov.idevento = this.cassa.idEvento;
  this.cassamov.idbiglietto = numeroemesso;
  this.cassamov.importo = importo;
  this.cassamov.modpag = this.biglietto.modpag;
  this.cassamov.cognome = this.eventoposto.cognome;
  this.cassamov.nome = this.eventoposto.nome;

  switch (this.biglietto.modpag) {
    case 1:
      this.cassamov.causale = 'IC';
      this.cassamov.stato = 1;
      break;
    case 7:
      this.cassamov.causale = 'IB';
      this.cassamov.stato = 4;
      break;
    case 6:
      this.cassamov.causale = 'IE';
      this.cassamov.stato = 4;
      break;
    default:
      this.cassamov.causale = 'XX';
      this.cassamov.stato = 0;
      break;
}
  this.cassamov.idevPosto = this.eventoposto.id;
  this.cassamov.key_utenti_operation = 1;

  let rc = await  this.cassamovService.create(this.cassamov).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Biglietto emesso regolarmente';
          this.showNotification(this.type, this.Message);
         }
    },
    error => {
        alert('registraMovCassa: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore registraMovCassa' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });


}












}




/*



              ngOnInit(): void {


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

/*

        console.log('creaprenotmaster: ' + localStorage.getItem('keyuserpren_idevento'));
        let merdaxx = 0;
        merdaxx = +localStorage.getItem('idevento');
        console.log('dopo normalizzazione a numero: ' + merdaxx);

        this.prenotazeventomasterConfirm = new  PrenotazeventomasterConfirm();
        this.prenotazeventomasterConfirm.cognome = localStorage.getItem('keyuserpren_cognome');
        this.prenotazeventomasterConfirm.nome = localStorage.getItem('keyuserpren_nome');
        this.prenotazeventomasterConfirm.email = localStorage.getItem('keyuserpren_email');
        this.prenotazeventomasterConfirm.telefono = localStorage.getItem('keyuserpren_telefono');
        this.prenotazeventomasterConfirm.keyuserpren = localStorage.getItem('keyuserpren');
        this.prenotazeventomasterConfirm.datapren = localStorage.getItem('keyuserpren_datapren');
        this.prenotazeventomasterConfirm.idevento = +localStorage.getItem('keyuserpren_idevento');
        this.prenotazeventomasterConfirm.devento = this.evento.descrizione;
        this.prenotazeventomasterConfirm.idlogistica = +localStorage.getItem('keyuserpren_idlogistica');
        this.prenotazeventomasterConfirm.idsettore = +localStorage.getItem('keyuserpren_idsettore');
        this.prenotazeventomasterConfirm.idfila = +localStorage.getItem('keyuserpren_idfila');
        this.prenotazeventomasterConfirm.idposto = +localStorage.getItem('keyuserpren_idposto');
        this.prenotazeventomasterConfirm.idtipobiglietto = +localStorage.getItem('keyuserpren_idtipobiglietto');
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

*/



/*

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
          localStorage.setItem('keyuserpren', this.keyuserpren);
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
        this.eventoposto.keyuserpren = this.keyuserpren;
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
        let rc = await  this.eventopostoService.getbykeyuserpren(keyuserpren).subscribe(
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
        let rc = await  this.eventopostoService.getbykeyuserpren(keyuserpren).subscribe(
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

*/












