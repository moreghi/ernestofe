
import { Component, OnInit } from '@angular/core';
// Model
import { Manifestazione } from './../../classes/Manifestazione';
import { Evento } from './../../classes/Evento';
// service
import { TesseramentoService } from './../../services/tesseramento.service';
import { ManifestazioneService } from './../../services/manifestazione.service';
import { EventoService } from './../../services/evento.service';
// Router
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { environment } from './../../../environments/environment';
@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  public manifestazione: Manifestazione;
  public manifestazioni: Manifestazione[] = [];

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public pathimageSoci = environment.APIURL + '/upload/files/jumbotron/soci.png';
  public pathimageManifestazioni = environment.APIURL + '/upload/files/jumbotron/manifestazioni.png';

  public pathimageManifestazione = environment.APIURL + '/upload/files/manifestaziones/';
  public pathimageManifestazioni1 = '';
  public pathimageManifestazioni2 = '';
  public pathimageManifestazioni3 = '';
  public pathimageManifestazioni4 = '';
  public pathimageManifestazioni5 = '';
  public pathimageManifestazioni6 = '';

  public nameManifestazione1 = '';
  public nameManifestazione2 = '';
  public nameManifestazione3 = '';
  public nameManifestazione4 = '';
  public nameManifestazione5 = '';
  public nameManifestazione6 = '';


  public tessereannoprev = 0;
  public tessereannoactual = 0;
  public numtessere = 0;
  public anno = 0;
  public date = new Date();

  public manifactive = true;
  public activemanif1 = false;
  public activemanif2 = false;
  public activemanif3 = false;
  public activemanif4 = false;
  public activemanif5 = false;
  public activemanif6 = false;

  public tipoEv1 = '';
  public tipoEv2 = '';
  public tipoEv3 = '';
  public tipoEv4 = '';
  public tipoEv5 = '';
  public tipoEv6 = '';

  public nEvento1 = 0;
  public nEvento2 = 0;
  public nEvento3 = 0;
  public nEvento4 = 0;
  public nEvento5 = 0;
  public nEvento6 = 0;

  public nManif1 = 0;
  public nManif2 = 0;
  public nManif3 = 0;
  public nManif4 = 0;
  public nManif5 = 0;
  public nManif6 = 0;

  public numEventi1 = 0;
  public numEventi2 = 0;
  public numEventi3 = 0;
  public numEventi4 = 0;
  public numEventi5 = 0;
  public numEventi6 = 0;

  public statomanifActiv = 1;
  public manifActive = 0;
  public prg = 0;

  constructor(private tesseramentoService: TesseramentoService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private router: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
               }

  ngOnInit(): void {
    this.goApplication();
  }

  goApplication() {
    console.log('goApplication - request statistiche tesseramento per editare card --------  appena entrato');

    this.anno = this.date.getFullYear();
    this.loadtessereAnnoActual(this.anno);
    this.loadManifActive();
}


async loadtessereAnnoActual(anno: number) {
  console.log('frontend - loadtessereAnno: ' + anno);
  let rc = await  this.tesseramentoService.countTesserebyanno(anno).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.tessereannoactual = response['data'].numero;
          this.anno -= 1;
          this.loadtessereAnnoPrev(this.anno);
       }
    },
    error => {
        alert('loadtessereAnnoActual: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadtessereAnnoActual' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

async loadtessereAnnoPrev(anno: number) {
  console.log('frontend - loadtessereAnno: ' + anno);
  let rc = await  this.tesseramentoService.countTesserebyanno(anno).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.tessereannoprev = response['data'].numero;
       }
    },
    error => {
        alert('loadtessereAnnoPrev: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadtessereAnnoPrev' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


async viewmanifactive() {
   this.statomanifActiv = 1;
   // mettere switch
   this.activemanif1 = false;
   this.activemanif2 = false;
   this.activemanif3 = false;
   this.activemanif4 = false;
   this.activemanif5 = false;
   this.activemanif6 = false;
  console.log('frontend - viewmanifactive: ' + this.statomanifActiv);
  let rc = await  this.manifestazioneService.getManifbyStato(this.statomanifActiv).subscribe(    //
    resp => {
        if(resp['rc'] === 'ok') {
          this.manifestazioni = resp['data'];
          this.editaManifestazioni(this.manifestazioni);
       }
    },
    error => {
        alert('viewmanifactive: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore viewmanifactive' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}



editaManifestazioni(manifestazioni: Manifestazione[]) {

  console.log('j - EditaManifestazioni ' + JSON.stringify(manifestazioni));
  this.prg = 0;

  for(let manife of manifestazioni) {
    this.manifestazione = new Manifestazione();
    this.countEventibyManif(manife);

  }
  this.isVisible = true;
  this.alertSuccess = true;
  this.type = 'success';
  this.Message = 'situazione attuale Eventi da prenotare';
  this.showNotification(this.type, this.Message);

}

async countEventibyManif(manife: Manifestazione) {
  console.log('frontend - countEventibyManif -- appena entrato ' + JSON.stringify(manife));
  let rc = await  this.eventoService.getnumbyManif(manife.id).subscribe(
    response => {


      console.log('count----  idManif: ' + manife.id + ' numero: ' + response['number']);
        if(response['rc'] === 'ok') {
          if(response['number'] > 0) {
            this.manifActive = response['number'];
            console.log('frontend - countEventibyManif -- numero eventi: ' + response['number']);
            this.prg = this.prg + 1;
            console.log(' sono il prg: ' + this.prg);
            switch (this.prg) {
                case 1:
                    this.pathimageManifestazioni1 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione1 = manife.descManif;
                    this.activemanif1 = true;
                    this.numEventi1 = response['number'];
                    this.nEvento1 = response['idEvento'];
                    this.tipoEv1 = 'M';
                    this.nManif1 = manife.id;
/*
                    this.tipoEv1 = response['tipoManif'];
                    if(this.tipoEv1 === 'M') {
                      this.nEvento1 = 0;
                    } else {
                      this.nEvento1 = response['idEvento'];
                    }
                    this.numEventi1 = this.manifActive; */
                    break;
                case 2:
                    this.pathimageManifestazioni2 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione2 = manife.descManif;
                    this.activemanif2 = true;
                    this.numEventi2 = response['number'];
                    this.nEvento2 = response['idEvento'];
                    this.tipoEv2 = 'M';
                    this.nManif2 = manife.id;






/*
                    this.nManif2 = manife.id;
                    this.tipoEv2 = response['tipoManif'];
                    if(this.tipoEv2 === 'M') {
                      this.nEvento2 = 0;
                    } else {
                      this.nEvento2 = response['idEvento'];
                    }
                    this.numEventi2 = this.manifActive;
*/
                    break;
                case 3:
                    this.pathimageManifestazioni3 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione3 = manife.descManif;
                    this.activemanif3 = true;

                    this.numEventi3 = response['number'];
                    this.nEvento3 = response['idEvento'];
                    this.tipoEv3 = 'M';
                    this.nManif3 = manife.id;





/*

                    if(this.tipoEv3 === 'M') {
                      this.nEvento3 = 0;
                    } else {
                      this.nEvento3 = response['idEvento'];
                    }
                    this.numEventi3 = this.manifActive;  */
                    break;
                case 4:
                    this.pathimageManifestazioni4 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione4 = manife.descManif;
                    this.activemanif4 = true;

                    this.numEventi4 = response['number'];
                    this.nEvento4 = response['idEvento'];
                    this.tipoEv4 = 'M';
                    this.nManif4 = manife.id;




/*

                    this.nManif4 = manife.id;
                    this.tipoEv4 = response['tipoManif'];
                    if(this.tipoEv4 === 'M') {
                      this.nEvento4 = 0;
                    } else {
                      this.nEvento4 = response['idEvento'];
                    }
                    this.numEventi4 = this.manifActive;  */
                    break;
                case 5:
                    this.pathimageManifestazioni5 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione5 = manife.descManif;
                    this.activemanif5 = true;

                    this.numEventi5 = response['number'];
                    this.nEvento5 = response['idEvento'];
                    this.tipoEv5 = 'M';
                    this.nManif5 = manife.id;


/*

                    this.nManif5 = manife.id;
                    this.tipoEv5 = response['tipoManif'];
                    if(this.tipoEv5 === 'M') {
                      this.nEvento5 = 0;
                    } else {
                      this.nEvento5 = response['idEvento'];
                    }
                    this.numEventi5 = this.manifActive;  */
                    break;
                case 6:
                    this.pathimageManifestazioni6 = this.pathimageManifestazione + manife.photo;
                    this.nameManifestazione6 = manife.descManif;
                    this.activemanif6 = true;

                    this.numEventi6 = response['number'];
                    this.nEvento6 = response['idEvento'];
                    this.tipoEv6 = 'M';
                    this.nManif6 = manife.id;

/*

                    this.nManif6 = manife.id;
                    this.tipoEv6 = response['tipoManif'];
                    if(this.tipoEv6 === 'M') {
                      this.nEvento6 = 0;
                    } else {
                      this.nEvento6 = response['idEvento'];
                    }
                    this.numEventi6 = this.manifActive; */
                    break;
                default:
                alert('troppe manifestazioni attive' + '\n' + 'avvisare ced');
                break;
             }
        }
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
// --------------------------



async loadManifActive() {
  console.log('frontend - loadManifActive -- appena entrato ');
  let rc = await  this.manifestazioneService.getManifAttiva(this.statomanifActiv).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.manifActive = response['data'].numero;
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


Prenota(tipoEvento: string,nEvento: number, nManif: number, numEventi: number) {

  this.router.navigate(['/prenotEventi/' + nManif + '/' + numEventi]);

  // per tutte le manifestazioni edito gli eventi.
  // poi scegliero in base a idTipo se fare prenotazione con logistica o senza


/*
  console.log(' sono in Prenota: -- TipoEvento ' + tipoEvento + ' idEvento: ' + nEvento );

  switch (tipoEvento) {
    case 'M':
        this.router.navigate(['/prenotEventi/' + nManif + '/' + numEventi]);
        break;
    case 'S':
       this.router.navigate(['/prenEventi/new/' + nEvento]);
        break;
    default:
    alert('operatività di Prenotazione errata' + '\n' + 'avvisare ced');
    break;

 }
*/



}


}
