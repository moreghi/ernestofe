import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { LogisticaService } from '../../../services/logistica.service';

// classi
import { Logistica} from '../../../classes/Logistica';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-logistiche',
  templateUrl: './logistiche.component.html',
  styleUrls: ['./logistiche.component.css']
})
export class LogisticheComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public logistiche: Logistica[] = [];


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


  public title = "elenco Logistiche - logistiche";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Selettiva'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private logisticaService: LogisticaService,
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
            this.loadLogistiche();
        }




        async loadLogistiche() {

          //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
          this.trovatoRec = false;
          this.nRec = 0;
          this.isVisible = true;
          let rc =  await  this.logisticaService.getAll().subscribe(
               res => {
                  this.logistiche = res['data'];
                  this.nRec = res['number'];
                  this.trovatoRec = true;
                  this.Message = 'Situazione Attuale';
                  this.alertSuccess = true;
              },
              error => {
                 alert('loadLogistiche - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
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
  this.router.navigate(['logistica/new']);
}

onSelectionChange(tipo: string)   {

alert('da fare');
  /*
  this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
  this.validSearch = true;

  if(this.tipoRichiesta === '?') {
      this.validSearch = false;
      alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
      return;
    }

  switch (this.tipoRichiesta) {
              case 'Tutte':
              this.this.loadLogistiche();;
           //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
              break;
              case 'Aperte':
                this.stato = 1;
                this.loadbyStato(this.stato);
                break;
              case 'Non Aperte':
                this.stato = 0;
            //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.loadbyStato(this.stato);
                break;
              case 'Chiuse':
                //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                this.stato = 2;
                this.loadbyStato(this.stato);
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
     }

     */
  }


  async loadbyStato(stato: number) {


    this.trovatoRec = false;
    this.nRec = 0;
    this.isVisible = true;
    let rc = await  this.logisticaService.getbyStato(stato).subscribe(
         res => {
              this.logistiche = res['data'];
              this.nRec = res['number'];
              this.trovatoRec = true;
              this.alertSuccess = true;
              if(res['number'] > 0) {
                this.Message = 'Situazione Attuale';
              } else {
                this.nRec = 0;
                this.Message = res['message'];
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

