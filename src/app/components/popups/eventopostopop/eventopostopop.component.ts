import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Eventosettfilaposti } from '../../../classes/Eventosettfilaposti';
import { EventoPosto } from '../../../classes/Eventoposto';
// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { EventoService } from './../../../services/evento.service';
import { EventosettfilapostiService } from './../../../services/eventosettfilaposti.service';
import { EventopostoService } from './../../../services/eventoposto.service';
import { AuthService } from './../../../services/auth.service';

import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-eventopostopop',
  templateUrl: './eventopostopop.component.html',
  styleUrls: ['./eventopostopop.component.css']
})
export class EventopostopopComponent implements OnInit {

  public evento: Evento;
  public tipobiglietto: Ttipobiglietto;
  public tipibiglietto: Ttipobiglietto[] = [];
  public tipibigliettonull: Ttipobiglietto[] = [];
  public eventosettfilaposti: Eventosettfilaposti[] = [];
  public eventosettfilaposti1: Eventosettfilaposti[] = [];
  public eventosettfilapostienull: Eventosettfilaposti[] = [];

  public eventoPosto: EventoPosto;
  public eventoPosti: EventoPosto[] = [];

  public title = "Selezione Posto per evento";

  // icone
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faUserEdit = faUserEdit;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faTrash = faTrash;


   // variabili per editazione messaggio
   public alertSuccess = false;
   public savechange = false;
   public isVisible = false;

   public nRecMan = 0;
   public nRec = 0;
   public trovatoRec = false;
   public Message = '';
   public type = '';
   public isSelected = false;

   public saveValueStd: boolean;

   public nRecRuoloSearch = 0;
   public selectedCorrect = false;
   public selectedUser: EventoPosto;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public d = '';
   public dsettore = '';
   public delemento = '';

   public selectedtipobiglietto = 0;
   public selectedSettore = 0;
   public selectedFila = 0;
   public selectedPosto = 0;
   public selectedidPosto = 0;


   public settoreselected = false;
   public filaselected = false;
   public bigliettoselected = false;

   public postovento: number[] = [];
   public postoventoid: number[] = [];
   public namepostovento: string[] = [];
   public postostr = '';
   public nposti = 0;
   public keyuserpren_stato = '';

   constructor(public modal: NgbActiveModal,
               private tipobigliettoService: TtipobigliettoService,
               private eventoService: EventoService,
               private eventosettfilapostiService: EventosettfilapostiService,
               private eventopostoService: EventopostoService,
               private auth: AuthService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
                }





  ngOnInit(): void {
    this.eventoPosto = this.selectedUser;
    this.saveValueStd = false;
    this.isLoading = false;
    this.isVisible = true;
    this.alertSuccess = true;
    this.Message = 'Effettuare le selezioni per individuare il posto';
    console.log('ngOnInit - dati passati: ' + JSON.stringify(this.selectedUser));
    this.loadSettori(this.eventoPosto.idEvento);
    this.loadtipibiglietto(this.eventoPosto.idEvento);
    this.setForm();

  }

  get editFormData() {
    return this.editForm.controls;
  }

 //  versione in cui gestisc solo la tabella
 private setForm() {

   console.log(this.selectedUser);
  // carico le combo
  // this.loadLogistica(this.selectedUser.id);   non serve



   this.editForm = this.formBuilder.group({
         id: [this.selectedUser.id],
         cognome: [this.selectedUser.cognome, Validators.required],
         nome: [this.selectedUser.nome, Validators.required],
         cellulare: [this.selectedUser.cellulare, Validators.required],
         email: [this.selectedUser.email, Validators.required]
        });


 }



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
  }

  closeModal(modalId?: number){

      alert('idModal: ' + modalId);
      if(modalId === 2) {
          alert('premuto Annulla su modalDelete')
      }
      if(modalId === 1) {
          alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
          this.modalService.hide();
      }
      alert('chiuso la seconda modal');
      this.modalService.hide(modalId);
  }


  onSubmit() {

    if (this.editForm.invalid ) {
      alert('form invalido');
    }


    if(this.bigliettoselected === false) {
      alert('manca selezione tipo biglietto - prenotazione non possibile');
      return;
    }
    this.inserisciEventoPosto();

  }

async  inserisciEventoPosto() {
    // alert('da fare ........');

    this.keyuserpren_stato = localStorage.getItem('keyuserpren_stato');
    if(this.keyuserpren_stato == 'prima') {
        localStorage.setItem('keyuserpren_stato', 'seconda');
        localStorage.setItem('keyuserpren_idevento', String(this.selectedUser.idEvento));
        localStorage.setItem('keyuserpren_idlogistica', String(this.selectedUser.idlogistica));
        localStorage.setItem('keyuserpren_idsettore', String(this.selectedSettore));
        localStorage.setItem('keyuserpren_idfila', String(this.selectedFila));
        localStorage.setItem('keyuserpren_idposto', String(this.selectedPosto));
        localStorage.setItem('keyuserpren_idtipobiglietto', String(this.selectedtipobiglietto));
    }

    this.eventoPosto = new EventoPosto();
    this.eventoPosto.stato = 1;
    this.eventoPosto.id = this.selectedidPosto;
    this.eventoPosto.keyuserpren = this.selectedUser.keyuserpren;
    this.eventoPosto.idEvento = this.selectedUser.idEvento;
    this.eventoPosto.idlogistica = this.selectedUser.idlogistica;
    this.eventoPosto.idSettore = this.selectedSettore;
    this.eventoPosto.idFila = this.selectedFila;
    this.eventoPosto.idPosto = this.selectedPosto;
    this.eventoPosto.cognome = this.selectedUser.cognome;
    this.eventoPosto.nome = this.selectedUser.nome;
    this.eventoPosto.cellulare = this.selectedUser.cellulare;
    this.eventoPosto.email = this.selectedUser.email;
    this.eventoPosto.tipobiglietto = this.selectedtipobiglietto;
    let rc = await this.eventopostoService.update(this.eventoPosto).subscribe(
      resp => {
        if(resp['rc'] === 'ok') {
          this.modal.close('Yes');
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




  registra(id: number, idposto: number) {

    /*
        console.log('ho schiacciato il numero: ' + id);
        this.Message = 'Selezionato il posto: ' + id;
        this.isVisible = true;
        this.alertSuccess = true;
        this.type = 'success';
        this.showNotification(this.type, this.Message);
       */

        this.Message = 'Selezionato il posto: ' + id;
        this.selectedPosto = id;
        this.selectedidPosto = idposto;
        this.alertSuccess = true;

    }




// ----------------------------  sposatat da request-evento-logistica

async   loadSettori(id: number) {    // utilizzo solo settori operativi per l'evevnto
  console.log('frontend - loadSettori -  evento: ' + id);
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
      this.bigliettoselected = false;
  } else {
  //  alert('selezionato: ------------- uscito corretto');
    this.selectedtipobiglietto = selectedValue;
    this.bigliettoselected = true;
    /*
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
     }  */
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
        this.settoreselected = false;
        this.filaselected = false;
        this.eventosettfilaposti1 = this.eventosettfilapostienull;
        return;
     } else {
          this.selectedSettore = selectedValue;
          this.settoreselected = true;
          this.alertSuccess = true;
          this.loadFilebySettore(this.eventoPosto.idEvento, selectedValue);
          console.log('fatto selezione Settore - selezionato: ' + this.evento.id + ' settore ' + selectedValue  + ' selected: ' + this.settoreselected);

      /*

      this.logsettfilaposto.idSettore = selectedValue;
      this.loadPostibySett(this.logistica.id, this.selectedSettore);
      this.viewAllSettori = true;
      this.viewAllFile = false;
      this.lastoperation = 'SelectedSettore';
      localStorage.setItem('lastoperation', this.lastoperation);
      localStorage.setItem('lastSettore', String(this.logsettfilaposto.idSettore));
      */
     }

 }




 onSelectedFila(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  99) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.selectedFila = 0;
      this.filaselected = false;
      this.eventosettfilaposti1 = this.eventosettfilapostienull;
      return;
   } else {
      this.loadPostibyFila(this.eventoPosto.idEvento, this.selectedSettore, selectedValue);
      this.selectedFila = selectedValue;
      this.filaselected = true;
      this.alertSuccess = true;
      console.log('fatto selezione Fila - selezionato: ' + this.evento.id + ' fila ' + selectedValue);

    /*

    this.logsettfilaposto.idSettore = selectedValue;
    this.loadPostibySett(this.logistica.id, this.selectedSettore);
    this.viewAllSettori = true;
    this.viewAllFile = false;
    this.lastoperation = 'SelectedSettore';
    localStorage.setItem('lastoperation', this.lastoperation);
    localStorage.setItem('lastSettore', String(this.logsettfilaposto.idSettore));
    */
   }

}



async loadPostibyFila(id: number, idSettore: number, idFila: number) {
  console.log('frontend - loadPostibyFila  ');
  let rc = await  this.eventopostoService.getbyIdEventoSettFilaActive(id, idSettore, idFila).subscribe(
  response => {
      this.eventoPosti = response['data'];
      this.nRec = response['number'];
      this.showpostiliberievento();
  },
  error => {
      alert('loadPostibyFila: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadPostibyFila' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });

}

async  loadFilebySettore(id: number, idSett: number) {    // utilizzo solo settori operativi per l'evevnto
  console.log('frontend - loadFilebySettore -  evento: ' + id + ' settore: ' + idSett);
  let rc = await  this.eventosettfilapostiService.getbyIdEventofileofSettore(id, idSett).subscribe(
  response => {
      this.eventosettfilaposti1 = response['data'];
      this.settoreselected = true;
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




showpostiliberievento() {
  console.log('showpostiliberievento: ' + this.nRec);
  // svuoto array
  this.namepostovento.length = 0;
  this.postovento.length = 0;
  this.postoventoid.length = 0;
  // ricarico array con i dati dei posti per la fila selezionata
  this.nposti = 0;
  for(const posto of this.eventoPosti) {
      if(posto.idPosto < 100) {
        if(posto.idPosto < 10) {
          this.postostr = '00' + posto.idPosto.toString();
        } else {
          this.postostr = '0' + posto.idPosto.toString();
        }
      } else {
        this.postostr =  posto.idPosto.toString();
      }
      this.namepostovento.push(this.postostr);
      this.postovento.push(posto.idPosto);
      this.postoventoid.push(posto.id);
      this.nposti += 1;

  }

  console.log('nro posti da visualizzare:' + this.nRec + ' nposti: ' + this.nposti);
  console.log('differenza: ' + (this.nRec - this.nposti));

 // pulizia iniziale dell'array

  console.log('showPosti ----------------------------------- nposti: ' + this.nposti);


  let inx;
  const tappo = 100;
  const campovuoto = '';
  this.nposti += 1;
  for(inx = this.nposti; inx < tappo; inx++) {
   this.namepostovento.push(campovuoto);
 }


}






/*   da correggere per creare eventoposto

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
                      (this.cognome.toLowerCase(), this.nome.toLowerCase(), this.email.toLowerCase(),
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





*/


















}

/*



import { PrenotazeventoConfirm } from '../../../../../classes/PrenotazeventoConfirm';
import { LogSettore } from '../../../../../classes/Logsettore';
import { LogFila } from '../../../../../classes/Logfila';



import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';

import { ManifestazioneService } from '../../../../../services/manifestazione.service';

import { LogsettoreService } from '../../../../../services/logsettore.service';
import { LogfilaService } from '../../../../../services/logfila.service';




import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';






*/





/*

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { ElementoService } from './../../../services/elemento.service';
import { LogsettoreService } from './../../../services/logsettore.service';
// Model
import { Elemento } from '../../../classes/Elemento';
import { LogSettore } from '../../../classes/Logsettore';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply, faMinus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
// varie
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-elempop',
  templateUrl: './elempop.component.html',
  styleUrls: ['./elempop.component.css']
})
export class ElempopComponent implements OnInit {



                ngOnInit(): void {

                  // alert('sono in oninit - title: ' + this.title);
                   console.log('Logisticapop -----------------------------     dati passati da chiamante: ' + this.selectedUser.id );
                 //  alert('sono in oninit - title ...................................................... : ' + this.title);
                   this.elemento = this.selectedUser;   // salvo la località ricevuta.

                   if(this.elemento.idsettore !== 0) {
                   //   this.loadElemSettore(this.elemento.idsettore);
                      this.delemento = 'Fila';
                   } else {
                    this.delemento = 'Settore';
                   }


                   console.log('Logisticapop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );


                   // alert('popup - OnInit');
                   if (this.selectedUser.id === 0) {
                      this.fase = 'I';
                      if(this.selectedUser.idsettore === 0) {
                        this.title = 'Inserimento Settore Logistica';
                        } else {
                          this.title = 'Inserimento Fila del Settore';
                        }
                  //    alert('trovato record nuovo per inserimento');

                     } else {
                      this.title = 'Aggiornamento Logistica';
                      this.fase = 'M';
                    }

                   this.saveValueStd = false;
                   this.isLoading = false;
                    //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
                   this.setForm();

                 }




                async loadElemSettore(id: number) {
                  console.log('frontend - loadSocio: ' + id);
                  let rc = await  this.logsettoreService.getbyId(id).subscribe(
                  response => {
                    if(response['rc'] === 'ok') {
                      this.logsettore = response['data'];
                      this.dsettore = this.logsettore.dsettore;
                      console.log('loadElemSettore - dsettore: ' + this.dsettore);
                    }
                    if(response['rc'] === 'nf') {
                      this.dsettore = '???????????';
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





  inserisciElemento() {
    //    alert('Inserisci Localita');
        this.elemento = this.editForm.value;
        this.elemento.key_utenti_operation = parseInt(localStorage.getItem('id'));
      // recuperare l'ultimo id inserito
        this.elementoService.create(this.elemento).subscribe(
          resp => {
            if (resp['rc'] === 'Ok') {
                  //  this.loadLocalita();
                    alert('inserimento correttamente seguito');
                    this.type = 'success';
                    this.Message = 'effettuato inserimento elemento ';
                    this.showNotification(this.type, this.Message);
                  //   this.modal.close('Yes');    //  con questo aggiorno elenco del padre chiamante
                    this.modal.dismiss('Cross click');
                 }
             },
             error => {
               alert(' sono in inserisciElemento');
               this.isLoading = false;
               console.log(error);
               this.type = 'error';
               this.Message = 'Errore inserisci Elemento' + '\n' + error.message;
               this.showNotification(this.type, this.Message);
               this.alertSuccess = false;
             });
       }







}






*/
