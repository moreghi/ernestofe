import { Component, OnInit } from '@angular/core';
// Service
import { TlocalitaService } from './../../../services/tlocalita.service';
import { SocioService} from './../../../services/socio.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';
// Model
import { Tlocalita } from '../../../classes/T_localita';
import { Socio } from '../../../classes/Socio';
import { Bandieragialla } from '../../../classes/BandieraGialla';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
// Varie
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// import { ThisReceiver } from '@angular/compiler';




@Component({
  selector: 'app-socio-detail1',
  templateUrl: './socio-detail1.component.html',
  styleUrls: ['./socio-detail1.component.css']
})
export class SocioDetail1Component implements OnInit {


// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faSave = faSave;
  faPlus = faPlus;
  faTrash = faTrash;
  faReply = faReply;

  public selectedLocalitaResidenza = 0;
  public selectedLocalitaNascita = 0;
  public selectedOperativita = '?';
  public selectedSesso = '?';
// variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';

  public localitas: Tlocalita[] = [];
  public socio: Socio;
  public localita: Tlocalita;
  public bandieragialla: Bandieragialla;

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

  constructor(private tlocalitaService: TlocalitaService,
              public socioService: SocioService,
              private bandieragiallaService: BandieragiallaService,
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

    console.log('goApplication - anno: ' + this.anno);

    this.isVisible = true;
    this.alertSuccess = true;
    this.loadlocalita();

    this.rotta = this.route.snapshot.url[0].path;
    this.rottafase = this.route.snapshot.url[1].path;

    if(this.rottafase === 'new') {
      this.fase = 'N';
      this.title = 'Inserimento nuovo Socio';
      this.Message = 'inserire i dati del nuovo Socio';
      this. socio = new Socio();
      this.socio.key_utenti_operation = +localStorage.getItem('id');
    } else {
        this.fase = 'M';
        this.title = 'Aggiornamento Socio';
        this.route.paramMap.subscribe(p => {
        this.idpassed = +p.get('id');
        console.log('id recuperato: ' + this.idpassed);
        this.loadSocio(this.idpassed);
        this.Message = 'pronto per aggiornamento Socio';
       });
      }


    // this.level = parseInt(localStorage.getItem('user_ruolo'));
   // this.rottaId = parseInt(this.route.snapshot.url[1].path);

  //  console.log('rotta -------- 0 ------ ' + this.route.snapshot.url[0].path);
  //  console.log('rotta -------- 1 ------ ' + this.route.snapshot.url[1].path);
 //   console.log('rotta -------- 2 ------ ' + this.route.snapshot.url[2].path);





}




async loadSocio(id: number) {
  console.log('frontend - loadSocio: ' + id);
  let rc = await  this.socioService.getSocio(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('socio da editare in Tesseramento: ' + JSON.stringify(response['data']));
      this.socio = response['data'];
      this.selectedLocalitaResidenza = this.socio.locNascita;
      this.selectedLocalitaResidenza = this.socio.residenza;
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







  onSelectedLocalitaNascita(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  9999) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.selectedLocalitaNascita = 0;
      return;
   } else {
    this.selectedLocalitaNascita = selectedValue;
    this.socio.locNascita = selectedValue;
   }

 }


  onSelectedLocalitaResidenza(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
     if(selectedValue ==  9999) {
       this.type = 'error';
       this.Message = 'selezione non corrette';
       this.showNotification(this.type, this.Message);
       this.alertSuccess = false;
       this.isVisible = true;
       this.selectedLocalitaResidenza = 0;
       return;
    } else {
     this.selectedLocalitaResidenza = selectedValue;
     this.socio.residenza = selectedValue;
     this.loadlocalitaResidenza(this.selectedLocalitaResidenza);
    }

  }



  async  loadlocalita() {

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


     nuovaLocalita() {
       alert('da fare');
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



selectOperativo(selectedValue: string) {
 // alert('operativo selezionato: ' + selectedValue);
  this.selectedOperativita = selectedValue;
  this.socio.operativo = selectedValue;

}

selectSesso(selectedValue: string) {
  // alert('operativo selezionato: ' + selectedValue);
   this.selectedSesso = selectedValue;
   this.socio.sesso = selectedValue;

 }




goback() {
 this.router.navigate(['/socio']);
}

reset() {
 this.socio = new Socio();
 this.selectedOperativita = '?';
 this.selectedSesso = '?';
}

async conferma() {
  console.log('conferma - fase: ' + this.fase);

// controllo sulle date

  if(this.selectedOperativita === '?') {
        this.type = 'error';
        this.alertSuccess = false;
        this.Message = 'Selezionare se socio è operativo !!';
        this.showNotification(this.type, this.Message);
        return;
      }
  if(this.selectedSesso === '?') {
        this.type = 'error';
        this.alertSuccess = false;
        this.Message = 'Selezionare il sesso !!';
        this.showNotification(this.type, this.Message);
        return;
      }
  // recupero il numero della tessera da bandieraGialla
  let rc = await  this.bandieragiallaService.getbyId(this.idBg).subscribe(
    res => {
          if(res['rc'] === 'ok') {
              this.bandieragialla = res['data'];
              this.newTessera = this.bandieragialla.ultimaTessera;
              this.newTessera = this.newTessera + 1;
              this.newTesseraStr = '';
              this.newTesseraStr = this.newTessera.toString();

              console.log('nuova tessera: ' + this.newTesseraStr);
              if(this.newTesseraStr.length < 5) {
                console.log('----------------------     uscita 1 per normalizzazione tessera ' + this.newTesseraStr.length);

                for (let i = 0; i < this.lenmaxtessera -1; i++) {
                  this.newTesseraStr = '0' + this.newTesseraStr;
                  console.log('dentro al loop: I: ' + i + ' result: ' + this.newTesseraStr);
                }

                console.log('------- finita normalizzazione tessera ---------------     ' + this.newTesseraStr);

              }
              this.socio.tessera = this.newTesseraStr;
              alert('numero tessera normalizzato a lunghezza 5: ' + this.newTesseraStr);

              switch (this.fase)  {
                case 'N':
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
}


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


async loadlocalitaResidenza(id: number) {
  console.log('frontend - ------------------------------------------------------- loadlocalitaResidenza: ' + id);
  let rc = await  this.tlocalitaService.getbyId(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('localita di residenza: ' + JSON.stringify(response['data']));
      this.localita = response['data'];
    }
    if(response['rc'] === 'nf') {
      this.Message = response['message'];
      this.type = 'error';
      this.showNotification( this.type, this.Message);
    }
  },
    error => {
    alert('Socio-Detail  --loadlocalitaResidenza: ' + error.message);
    console.log(error);
    this.alertSuccess = false;
    this.Message = error.message;
    this.type = 'error';
    this.showNotification( this.type, this.Message);
    });
  }






}
