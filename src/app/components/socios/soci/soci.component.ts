/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soci',
  templateUrl: './soci.component.html',
  styleUrls: ['./soci.component.css']
})
export class SociComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/

import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';    //  @fortawesome/free-regular-svg-icons
// service
import { SocioService } from '../../../services/socio.service';

// import { CtrfuncService } from '../../../services/ctrfunc.service';
// classi
import { Socio} from '../../../classes/Socio';
// import { Abilfunctione} from '../../../classes/Abilfunctione';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-soci',
  templateUrl: './soci.component.html',
  styleUrls: ['./soci.component.css']
})
export class SociComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public soci: Socio[] = [];

  // public abilfunctione: Abilfunctione;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';
 public functionUser = '';
 public functionInqu = false;
 public functionEdit = false;
 public functionNew = false;
 public functionElenco = false;

 public searchInqu = 'show';
 public searchEdit = 'edit';
 public searchNew = 'new';
 public searchElenco = 'read';


 // funzioni di navigazione
 public navigateInqu = 'Inqu';
 public navigateEdit = 'Edit';
 public navigateEdits = 'Edits';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Soci";
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
    'da Rinnovare',
    'Rinnovate'
  ];


  options1 = [
    'Alfabetico',
    'Tessera',
    'Residenza'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private xsocioService: SocioService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
           //   this.checkFunctionbylevel();
              this.goApplication();
          }


/*

          async   checkFunctionbylevel() {
            this.rotta = this.route.snapshot.url[0].path;
            this.level = parseInt(localStorage.getItem('user_ruolo'));

            console.log('checkFunctiobylevel - inizio: -- rotta ' + this.rotta + ' level:' + this.level);

            let rc =  await this.ctrfuncService.getfuncbyProfilo(this.level, this.rotta).subscribe(
              res =>{
               console.log(res,'res-->');
               if(res['rc'] === 'ko')  {
                this.type = 'error';
                this.Message = res['message'];
                this.showNotification(this.type, this.Message);
                return;
               }
               if(res['rc'] === 'ok') {
                  if(res['number'] !== 1) {
                    this.type = 'error';
                    this.Message = 'Modulo non ancona habilitation';
                    this.showNotification(this.type, this.Message);
                  }  else {
                    this.functionUser = res['data'];
                    //   parte pubblica   --  fine
                    console.log('checkFunctionbylevel - funzione determinata: ' + this.functionUser);
                    // parte personalizzata
                    this.loadManifestazioni();
                   }
                  }
                },
                   error => {
                      alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
                      console.log(error);
                      this.Message = error.message;
                      this.alertSuccess = false;
                   });

          }


          */



          goApplication() {
            this.loadSoci();

          }

          async loadSoci() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.xsocioService.getsoci().subscribe(
                 (res: any) => {

                    console.log('Frontend -Soci  ---  loadSoci ' + JSON.stringify(res['data']));
                    this.soci = res['data'];
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Soci  -- loadSoci - errore: ' + error.message);
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
    this.router.navigate(['socio/new']);
  }

  onSelectionOrderChange(tipo: string) {

    alert(' ordinamento da fare');
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
                this.loadManifestazioni();
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

/*
    async loadbyStato(stato: number) {


      this.trovatoRec = false;
      this.nRec = 0;
      this.isVisible = true;
      let rc = await  this.socioService.getsoci().subscribe(
           res => {
                this.manifestazioni = res['data'];
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
             alert('Manifestazioni  -- loadManifestazionibyStato - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }

    */

}









