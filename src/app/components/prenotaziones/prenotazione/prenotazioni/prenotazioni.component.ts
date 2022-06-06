import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazioneService } from '../../../../services/prenotazione.service';
// import { ManifestazioneService } from '../../../../services/manifestazione.service';
// import { AbilfunctioneService } from '../../../../services/abilfunctione.service';
// import { CtrfuncService } from '../../../../services/ctrfunc.service';
// import { GiornataService } from './../../../../services/giornata.service';
// classi
import { Prenotazione} from '../../../../classes/Prenotazione';
// import { Abilfunctione} from '../../../../classes/Abilfunctione';
// import { Manifestazione} from '../../../../classes/Manifestazione';
// import { Giornata } from '../../../../classes/Giornata';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';






@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css']
})
export class PrenotazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public prenotazioni: Prenotazione[] = [];
  public prenotazioninull: Prenotazione[] = [];
  public prenotazione: Prenotazione;


  /*
  public abilfunctione: Abilfunctione;
  public manifestazione: Manifestazione;
  public giornate: Giornata[] = [];
  */

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


  public title = "elenco Prenotazioni";
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
    'selezionata'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public emailutente = '';
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente
  public enabledSelectday = false;
  public idDayActive = 0;
  public selectedDay = 0;


constructor(private prenotazioneService: PrenotazioneService,



            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
              this.isVisible = true;
             //    this.checkFunctionbylevel();     da eliminare

              this.goApplication();


          }


          goApplication() {
            this.level = parseInt(localStorage.getItem('user_ruolo'));

            if(this.level === 0) { // cliente loggato che visualizza le proprie prenotazioni
                this.emailutente = localStorage.getItem('email');
                this.loadPrenotazioniUtente(this.emailutente);
              } else {

                this.loadPrenotazioni();
              }
          }





          async loadPrenotazioni() {
            console.log('loadPrenotazioni --- appena entrato ');
            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            this.searchText = '';
            let rc =  await  this.prenotazioneService.getPrenotazioni().subscribe(
                 res => {
                    this.prenotazioni = res['data'];
                    console.log('le prenotazioni gobali  sono: ' + JSON.stringify(res['data']));
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }


          async loadPrenotazioniUtente(email: string) {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.prenotazioneService.getPrenotazinibyemail(email).subscribe(
                 res => {
                    this.prenotazioni = res['data'];
                    console.log('le prenotazioni utente  sono: ' + JSON.stringify(res['data']));
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }
/*
     async   loadAllday(id: number) {  // carico tutte le giornate della festa
            console.log('loadAddday --  appena entrato : ' + id);
            let rc =  await  this.giornataService.getGiornatebyManif(id).subscribe(
              res => {
                 this.giornate = res['data'];
        //         console.log('le giornate della manifestazione sono: ' + JSON.stringify(res['data']));
             },
             error => {
                alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                console.log(error);
                this.Message = error.message;
                this.alertSuccess = false;
             });
          }
*/

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
                case 'Tutte':
                this.enabledSelectday = false;
                this.loadPrenotazioni();
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'selezionata':
                  this.enabledSelectday = true;
                  break;

                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }






    selectedGiornata(selectedValue: number) {
      //  alert('selezionato: ' + selectedValue);
        if(selectedValue ==  999) {
          this.type = 'error';
          this.Message = 'selezione non corrette';
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
          this.isVisible = true;
          return;
       } else {
        this.selectedDay = selectedValue;
        console.log('giornata selezionata: ' + this.selectedDay);
        this.loadPrenotazioniforDay(this.selectedDay);
       }

   }

 async  loadPrenotazioniforDay(selectedDay: number) {
    // console.log('loadPrenotazionifroDay -- appena entrato');
      this.nRec = 0;
      this.isVisible = true;
      this.searchText = '';
      let rc = await  this.prenotazioneService.getPrenotazinidaEvaderebyday(selectedDay).subscribe(
           res => {
               if(res['rc'] === 'ok') {
                this.prenotazioni = res['data'];
                this.nRec = res['number'];
                this.Message = 'situazione attuale';
                this.alertSuccess = true;
               }
               if(res['rc'] === 'nf') {
                this.prenotazioni = this.prenotazioninull;
                this.nRec = res['number'];
                this.Message = 'Nessuna prenotazione per la data selezionata';
                this.alertSuccess = false;
               }


          },
          error => {
             alert('loadPrenotazioniforDay - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });
   }

   onDeletedPrenotazione(esito: string) { // ho effettuato la cancellazione quindi devo rifare l'elenco

    console.log('onDeletedPrenotazione ----- ' + esito + ' level: ' + this.level);




    if(esito === 'Dpren' ) {  // valore impostato dal figlio in fase di cancellazione
      if(this.level === 0) { // cliente loggato che visualizza le proprie prenotazioni
        this.emailutente = localStorage.getItem('email');
        this.loadPrenotazioniUtente(this.emailutente);
      } else {
          if(this.enabledSelectday === false) {
            this.loadPrenotazioni();
          } else {
            this.loadPrenotazioniforDay(this.selectedDay);
          }
      }
    }
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
                this.alertSuccess = false;
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
                    this.stato = 1;
                    this.loadManifestazioneActive(this.stato);
                    // parte personalizzata
                         this.level = parseInt(localStorage.getItem('user_ruolo'));

                    if(this.level === 0) { // cliente loggato che visualizza le proprie prenotazioni
                        this.emailutente = localStorage.getItem('email');
                        this.loadPrenotazioniUtente(this.emailutente);
                      } else {

                        this.loadPrenotazioni();
                      }
                   }
                  }
                },
                   error => {
                      alert('Prenotazioni  -- getfuncbyProfilo - errore: ' + error.message);
                      console.log(error);
                      this.Message = error.message;
                      this.alertSuccess = false;
                   });
          }





*/






}
