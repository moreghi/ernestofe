import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { AdesioneConfirm } from './../../../classes/AdesioneConfirm';
import { Socio } from './../../../classes/Socio';
import { Tlocalita } from './../../../classes/T_localita';
import { Bandieragialla } from '../../../classes/BandieraGialla';
// varie
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { AdesioneConfirmService } from './../../../services/adesione-confirm.service';
import { SocioService } from './../../../services/socio.service';
import { TlocalitaService } from './../../../services/tlocalita.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';



import { AuthService } from './../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-response-adesione',
  templateUrl: './response-adesione.component.html',
  styleUrls: ['./response-adesione.component.css']
})
export class ResponseAdesioneComponent implements OnInit {

  public form = {
    token: '',
    cognome: '',
    nome: '',
    sesso: '',
    luogonascita: '',
    datanascita: '',
    residenza: '',
    indirizzo: '',
    telcasa: '',
    cell: '',
    email: '',
    operativo: '',
    codade: ''
  };

  public error = [];

  public cognome = '';
  public nome = '';
  public sesso = '';
  public luogonascita = '';
  public datanascita = '';
  public residenza = '';
  public indirizzo = '';
  public telcasa = '';
  public cell = '';
  public operativo = '';
  public token = '';
  public codade = '';
  public email = '';


  public socio: Socio;
  public ricade: AdesioneConfirm;
  public localita: Tlocalita;
  public localitanew: Tlocalita;
  public bandieragialla: Bandieragialla;

  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';

  closeResult = '';
  public enabledNewUser = false;
  public initialDate: any;
  public visibleConferma = true;

  public confermataAdesione = false;
  public emailsend = false;
  public keylocalita = 0;
  public keyNascita = 0;
  public keyResidenza = 0;
  public idBg = 1;
  public newTessera = 0;
  public newTesseraStr = '';
  public lenmaxtessera = 5;
  public nloop = 0;
  public newLocalita = 0;
  public nlettura = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private modalService: NgbModal,
              private adesioneConfirmService: AdesioneConfirmService,
              private socioService: SocioService,
              private tlocalitaService: TlocalitaService,
              private bandieragiallaService: BandieragiallaService,
              private auth: AuthService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.token = params['token']
                  });
              }

  ngOnInit(): void {

    this.confermataAdesione = false;
    this.ricade  = new AdesioneConfirm();
    this.token = this.form.token;
    console.log('OnInit - token: ' + this.token);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;
    this.adesioneConfirmService.getAdeConfirmbyToken(this.token).subscribe(
    resp => {
      if(resp['rc'] === 'ok') {
            this.ricade = resp['data'];
            this.form.cognome = this.ricade.cognome;
            this.form.nome = this.ricade.nome;
            this.form.email = this.ricade.email;
            this.form.luogonascita = this.ricade.luogonascita;
            this.form.datanascita = this.ricade.datanascita;
            this.form.residenza = this.ricade.residenza;
            this.form.indirizzo = this.ricade.indirizzo;
            this.form.telcasa = this.ricade.telcasa;
            this.form.cell = this.ricade.cell;
            this.form.codade = '';
            this.codade = this.ricade.codade;
            if(this.ricade.sesso === 'M') {
              this.form.sesso = 'Uomo';
            }
            if(this.ricade.sesso === 'F') {
              this.form.sesso = 'Donna';
            }
            if(this.ricade.operativo === 'S') {
              this.form.operativo = 'Operativo';
            }
            if(this.ricade.operativo === 'N') {
              this.form.operativo = 'Non Operativo';
            }
       }
      if(resp['rc'] === 'nf') {
        this.Message = 'Conferma adesione già eseguita - funzione non eseguibile';
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.showNotification(this.type, this.Message);
        return;
       }
      },
      error => {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore lettura richiesta adesione' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
       });
  }


  onSubmit(form: NgForm) {

    /*   non so a cosa serva questo controllo
        if(this.modalService.open) {
          console.log('onSubmit ----   sono in open --  chiudo');
          return;
        }
    */

       // alert('sono in submit');
        console.log('sono in submit ---------  codpade --  ' + form.value.codade);

        this.emailsend = false;
        // eseguo controllo sui campi inseriti
        if(form.value.codade !== this.codade) {
          this.Message = 'codice di conferma adesione non corrisponde  - conferma non consentita';
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
          return;
        }

        // recupero il numero della tessera
        this.LetturaNumTessera(this.idBg);

       // verifico se socio gia esistente

        console.log('controllo su socio --- cognome ' + this.ricade.cognome + ' nome ' + this.ricade.nome + ' cell ' + this.ricade.cell);

        // verifica se socio già censito
        this.socioService.getsociobyCognomeNomeCell(this.ricade.cognome, this.ricade.nome, this.ricade.cell).subscribe(
          resp => {
              if(resp['rc']  === 'ok') {
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Socio già registrato - inibire il flag di registrazione';
                this.showNotification(this.type, this.Message);
                return;
                }
          },
          error => {
            console.log('onSubmit - error in verifica esistenza socio: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore controllo se socio esistente' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
          });

        console.log('ultima tessera normalizzata: ' + this.newTesseraStr);


      // posso procedere con la registrazione del socio (provvisorio) e la cancellazione della richiesta di adesione

      // step 1 -- Recupero dalla descrizione della località il codice della località

        console.log('eseguo la lettura per luogoNascita: ' + this.ricade.luogonascita);

        this.nlettura = 1;
        this.LetturaKeyLocalita(this.ricade.luogonascita, this.nlettura);
        this.keyNascita = this.keylocalita;
        console.log('leggo localita nascita: ' + this.keylocalita);

       // this.sleep(10);




        console.log('eseguo la lettura per residenza: ' + this.ricade.residenza);
        this.nlettura = 2;
        this.LetturaKeyLocalita(this.ricade.residenza, this.nlettura);
        console.log('leggo localita residenza: ' + this.keylocalita);
        this.keyResidenza = this.keylocalita;


        this.token = form.value.token;
      // verificate la conferma ricevuta
        this.adesioneConfirmService.getAdeConfirmbyTokenCodade(form.value.token, form.value.codade).subscribe(
          resp => {
            this.ricade = resp['data'];
            console.log('letto la conferma: ' + JSON.stringify(resp['data']));
            this.socio = new Socio();
            this.socio.stato = 4;
            this.socio.cognome = this.ricade.cognome;
            this.socio.nome = this.ricade.nome;
            this.socio.email = this.ricade.email;
            this.socio.sesso = this.ricade.sesso;
            this.socio.locNascita =  this.keyNascita;
            this.socio.datanascita = this.ricade.datanascita;
            this.socio.residenza =  this.keyResidenza;
            this.socio.indirizzo =  this.ricade.indirizzo;
            this.socio.telcasa =  this.ricade.telcasa;
            this.socio.cell =  this.ricade.cell;
            this.socio.operativo =  this.ricade.operativo;
            this.socio.tessera =  this.newTesseraStr;


            console.log('pronto per fare creazione nuovo socio: ' + JSON.stringify(this.socio));





            console.log('frontend - sto creando nuovo socio ' + JSON.stringify(this.socio));
            this.creanuovoSocio(this.socio);
          //  cancello la vecchia richiesta adesione

            this.cancellaAdesione(this.token);
            },
            error => {
              console.log('onSubmit - error in lettura rich. adesione per new utente: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore lettura rich. adesione per new utente' + '\n' + error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
                });
      }


      sleep(s){
        const now = new Date().getTime();
        console.log('sleep - appena entrato: ' + now);
        while(new Date().getTime() < now + (s * 1000)){ /* non faccio niente */ }

        const now1 = new Date().getTime();
        console.log('sleep - finito: ' + now1);

      }



      async cancellaAdesione(token: string) {

        let rc = await this.adesioneConfirmService.deleteAdeConfirmbyToken(token).subscribe(
           resp => {
               if(resp['rc']  === 'ok') {
                  this.type = 'success';
                  this.Message =  resp['message'];
                  this.alertSuccess = true;
                  this.showNotification( this.type, this.Message);
               }
           },
           error => {
             console.log('cancellazione adesione: ' + error.message);
             this.isVisible = true;
             this.alertSuccess = false;
             this.type = 'error';
             this.Message = 'Errore cancellazione adesione' + '\n' + error.message;
             this.showNotification(this.type, this.Message);
             console.log(error);
           });

       }



  async LetturaKeyLocalita(localita: string, nlettura: number) {
   console.log('LetturaKeyLocalita : -----------------------  ' + localita);
   let rc = await this.tlocalitaService.getbylocalita(localita).subscribe(
      resp => {
          if(resp['rc']  === 'ok') {
            this.localita = resp['data'];
            if(nlettura === 1) {
              this.keyNascita = this.localita.id;
            }
            if(nlettura === 2) {
              this.keyResidenza = this.localita.id;
            }
          //  this.keylocalita = this.localita.id;
            console.log('trovata localita : ------ key -----------------  ' + this.keylocalita);
            }
          if(resp['rc']  === 'nf') {
             this.creanuovaLocalita(localita);
            }
      },
      error => {
        console.log('onSubmit - error in verifica esistenza socio: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore controllo se socio esistente' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
      });

  }


async creanuovaLocalita(localita: string) {
  let rc = await  this.tlocalitaService.getLastLocalitaid().subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.localita = res['data'];
              this.keylocalita = this.localita.id + 1;

              console.log('creanuovalocalita - ' + JSON.stringify(this.localita) + ' keylocalita:' + this.keylocalita);
              this.localitanew = new Tlocalita();
              this.localitanew.d_localita = localita;
              this.inserisciNuovaLocalita(this.localitanew);
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


async inserisciNuovaLocalita(localita: Tlocalita) {
  let rc = await  this.tlocalitaService.create(localita).subscribe(
    res => {
          if(res['rc'] === 'ok') {
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




// recupero il numero della tessera da bandieraGialla
async LetturaNumTessera(idBg: number)  {

  let rc = await  this.bandieragiallaService.getbyId(idBg).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.bandieragialla = res['data'];
              this.newTessera = this.bandieragialla.ultimaTessera;
              this.newTessera = this.newTessera + 1;
              this.newTesseraStr = '';
              this.newTesseraStr = this.newTessera.toString();
              if(this.newTesseraStr.length < 5) {
                this.nloop = this.lenmaxtessera - this.newTesseraStr.length;
                for (let i = 0; i < this.nloop; i++) {
                  this.newTesseraStr = '0' + this.newTesseraStr;
                  console.log('dentro al loop: I: ' + i + ' result: ' + this.newTesseraStr);
                }
                console.log('------- finita normalizzazione tessera ---------------     ' + this.newTesseraStr);
               }
            }
          if(res['rc'] === 'nf') {
             this.type = 'error';
             this.Message = 'iniesistente master Bandiera Gialla - errore grave - avvisare Amministratore';
             this.alertSuccess = false;
             this.showNotification( this.type, this.Message);
             return;
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

async creanuovoSocio(socio: Socio) {

  let rc = await  this.socioService.createSocio(socio).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.aggiornanumTessera(this.newTessera);
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


async aggiornanumTessera(numTessera: number) {
  this.bandieragialla.ultimaTessera = numTessera;
  let rc1 = await this.bandieragiallaService.update(this.bandieragialla).subscribe(
    res => {
            if(res['rc'] === 'ok') {

            }
            if(res['rc'] === 'nf') {
              this.type = 'error';
              this.Message =  res['message'];
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



 handleError(error) {
  this.error = error.error.errors;
}


showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
    if(result ===  'Cancel click') {
       this.cancellazioneAbort();
    }
    if(result ===  'Delete click') {
      this.cancellaAdesione(this.token);
    }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
 //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
    this.cancellazioneAbort();
  });

}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}



cancellazioneAbort() {
  this.type = 'warning';
  this.Message = 'cancellazione abbandonata dall utente';
  this.isVisible = true;
  this.alertSuccess = false;
  this.showNotification(this.type, this.Message);
}



    }

