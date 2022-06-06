import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { TabellaService } from '../../../services/tabella.service';
//import { AbilfunctioneService } from '../../../services/abilfunctione.service';      // eliminare
import { CtrfuncService } from '../../../services/ctrfunc.service';
// classi
import { Tabellat} from '../../../classes/Tabella_t';
import { Abilfunctione} from '../../../classes/Abilfunctione';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tabelle',
  templateUrl: './tabelle.component.html',
  styleUrls: ['./tabelle.component.css']
})
export class TabelleComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public tabelle: Tabellat[] = [];
  public tabella: Tabellat;
  public abilfunctione: Abilfunctione;

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


  public title = "elenco Tabelle";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;


  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private tabellaService: TabellaService,
            private ctrfuncService: CtrfuncService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
              this.checkFunctionbylevel();


/*    originaria fino a 05/01/2022
      -- introduco controllo per determinare  la funzione dell'utente

            this.router.url;
            this.href = this.router.url;
            console.log('href: ..................................  ' + this.href);
            console.log('route - 1 ' + this.route.snapshot.url[0].path);
            console.log(this.href.includes(this.searchEdit));
            console.log(this.href.includes(this.searchElenco));
            console.log(this.href.includes(this.searchInqu));
            console.log(this.href.includes(this.searchNew));

            // attenzione
            // su navbar dopo login imposto la localstorage
            // in funzione del valore della user_ruolo effettuo la valorizzazione
            // della visibilità del campo

            // test
            this.testRuoloday = -1; // ----------------------------------------   test   test   test  test
            localStorage.setItem('user_ruolo', String(this.testRuoloday));

            if(this.testRuoloday === -1) {
              this.functionUser = this.navigateEdits;
            }
            if(this.testRuoloday === 0) {
              this.functionUser = this.navigateInqu;
            }
            if(this.testRuoloday === 1) {
              this.functionUser = this.navigateEdit;
            }
            this.loadManifestazioni();

*/

          }




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
                    this.loadTabelle();
                   }
                  }
                },
                   error => {
                      alert('Tabelle  -- checkFunctionbylevel - errore: ' + error.message);
                      console.log(error);
                      this.Message = error.message;
                      this.alertSuccess = false;
                   });

          }

          async loadTabelle() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.tabellaService.getAll().subscribe(
                 res => {
                    this.tabelle = res['data'];
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Tabelle  -- loadTabelle - errore: ' + error.message);
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


}

