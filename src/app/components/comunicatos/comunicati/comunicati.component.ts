import { ComunicatoInterface } from './../../../interfaces/comunicato';
import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { ComunicatoService } from '../../../services/comunicato.service';

// classi
import { Comunicato} from '../../../classes/Comunicato';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-comunicati',
  templateUrl: './comunicati.component.html',
  styleUrls: ['./comunicati.component.css']
})
export class ComunicatiComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;


  public comunicati: Comunicato[] = [];
  public comunicato: Comunicato;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Comunicati";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutti',
    'Attivi',
    'Chiusi'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private comunicatoService: ComunicatoService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
            this.goApplication();
           }


           goApplication() {
            this.loadComunicati();
        }




        async loadComunicati() {

          //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
          this.trovatoRec = false;
          this.nRec = 0;
          this.isVisible = true;
          let rc =  await  this.comunicatoService.getAll().subscribe(
               res => {

                if(res['rc'] === 'ok') {
                  console.log('loadComunicati ---- elenco ' + JSON.stringify(res['data']));
                  this.comunicati = res['data'];
                  this.nRec = res['number'];
                  this.trovatoRec = true;
                  this.Message = 'Situazione Attuale';
                  this.alertSuccess = true;
                }
                if(res['rc'] === 'nf') {
                  this.trovatoRec = false;
                  this.Message = 'Nessun Comunicato presente';
                  this.alertSuccess = true;
                }
              },
              error => {
                 alert('loadComunicati - errore: ' + error.error.message);
                 console.log(error);
                 this.Message = error.error.message;
                 this.alertSuccess = false;
              });
        }

/*
   Show a notification

   @param {string} type Notification type
   @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
// alert('sono in showNot - ' + message);
this.notifier.notify( type, message );
console.log(`sono in showNotification  ${type}`);
}


Nuovo() {
  this.router.navigate(['manif/new']);
}

onSelectionChange(tipo: string)   {

  this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta === '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
      return;
    }

  switch (this.tipoRichiesta) {
              case 'Tutti':
              this.loadComunicati();
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Attivi':
                this.stato = 1;
                this.loadbyStato(this.stato);
                break;
               case 'Chiusi':
                //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.stato = 2;
                this.loadbyStato(this.stato);
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
     }
  }


  async loadbyStato(stato: number) {
    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    let rc = await  this.comunicatoService.getbyStato(stato).subscribe(
         res => {
          if(res['rc'] === 'ok') {
            this.comunicati = res['data'];
            this.nRec = res['number'];
            this.trovatoRec = true;
            this.alertSuccess = true;
          }
          if(res['rc'] === 'nf') {
            this.trovatoRec = false;
            this.Message = 'Nessuna Manifestazione presente';
            this.alertSuccess = true;
            this.nRec = 0;
         }
        },
        error => {
           alert('loadbyStato - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        });
  }




}

