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
import { SociosearchService } from './../../../services/sociosearch.service';

// import { CtrfuncService } from '../../../services/ctrfunc.service';
// classi
import { Socio} from '../../../classes/Socio';
import { SocioSearch } from '../../../classes/SocioSearch';
// import { Abilfunctione} from '../../../classes/Abilfunctione';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// popup per gestione filtri su ricerca soci
import { SocioSearchpopComponent } from '../../../components/popups/socio-searchpop/socio-searchpop.component';


@Component({
  selector: 'app-soci',
  templateUrl: './soci.component.html',
  styleUrls: ['./soci.component.css']
})
export class SociComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public soci: Socio[] = [];
  public socioSearch: SocioSearch;

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
    'Selettiva'
  ];


/*

 options = [
    'Tutte',
    'da Rinnovare',
    'Rinnovate'
  ];


*/

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
  public idSearch = 1;
  public strsql = '';
  public orderby = '';
  public where = '';
  public dataOdierna;
  public anno  = 0;
  public whereStato = '';
  public whereTessere = '';
  public whereLocalita = '';
  public whereOperativo = '';
  public whereSesso = '';
  public whereEmail = '';
  public whereCell = '';
  public whereparam = '';
  public wherestrcount = 0;
  public whereend = ' and ';
  public wherework = '';
  public activeFilter = false;

constructor(private xsocioService: SocioService,
            private sociosearchService: SociosearchService,
            private router: Router,
            private route: ActivatedRoute,
            private modalService: NgbModal,
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
            this.activeFilter = false;
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

  startFiltri() {

     //  lancio con popup

     this.socioSearch = new SocioSearch();
     const ref = this.modalService.open(SocioSearchpopComponent, {size:'lg'});
     ref.componentInstance.selectedUser = this.socioSearch;

     ref.result.then(
        (yes) => {
          console.log('Click YES');
          // leggo la selezione e preparo la strsql da passare a backend
          this.loadSearch(this.idSearch);

         /*

         creare stringa di selezione e fare select
          this.loadlocalita();
          //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
          */
        },
        (cancel) => {
          console.log('click Cancel');
        }
      );
  }

  async loadSearch(id: number) {

    console.log('loadSearch -- appena entrato ');

    let rc =  await  this.sociosearchService.getbyId(id).subscribe(
      (res: any) => {

         console.log('loadSearch ' + JSON.stringify(res['data']));
         this.socioSearch = res['data'];
         this.creaStrsql(this.socioSearch);
     },
     error => {
        alert('Soci  -- loadSoci - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     });

  }


/*    old
async creaStrsql(socioSearch: SocioSearch) {

  console.log('createStrsql -- appena entrato ' + JSON.stringify(socioSearch));
  this.strsql = '';
  this.orderby = '';
  this.where = '';

  this.whereStato = '';
  this.whereTessere = '';
  this.whereLocalita = '';
  this.whereOperativo = '';
  this.whereSesso = '';
  this.whereEmail = '';
  this.whereCell = '';
  this.whereparam = '';
  this.whereend = ' and ';
  this.wherework = '';

  this.wherestrcount = 0;

  const date = Date();
  this.dataOdierna = new Date(date);

  this.anno  = this.dataOdierna.getFullYear();

  switch (socioSearch.orderby)  {
    case 'T':   // Tessera
      this.orderby = ' order by `socios`.`tessera` asc';
      break;
    case 'A':   // Alfabetico
      this.orderby = ' order by `socios`.`cognome` asc';
      break;
    case 'R':   // Residenza
      this.orderby = ' order by `t_localitas`.`d_localita` asc';
      break;
  default:
      this.orderby = ' order by `socios`.`cognome` asc';
      break;
}

  if(socioSearch.tessere === `T`) {
  this.strsql = `select 'socios'.*, 't_localitas'.'d_localita' from 'socios' ` +
                ` inner join 't_localitas' ON 't_localitas'.'id' = 'socios'.'residenza' ` + this.orderby;
} else {

  this.strsql = `select distinct 'socios'.*, 't_localitas'.'d_localita', 'tesseramentos'.*, 't_stato_utentes'.* from 'socios' ` +
                ` inner join 't_localitas' ON 't_localitas'.'id' = 'socios'.'residenza' ` +
                ` inner join 'tesseramentos' ON 'tesseramentos'.'idTessera' = 'socios'.'tessera' ` +
                ` inner join 't_stato_utentes' ON 't_stato_utentes'.'id' = 'socios'.'stato' `;

// ---- selezione per tessere
  if(socioSearch.tessere === `R`) {    // rinnovate
    this.whereTessere  = ` 'tesseramentos'.'stato' = 1 and 'tesseramentos'.'anno' = ` + this.anno;
  }
  if(socioSearch.tessere === `D`) {    // da rinnovare
    this.whereTessere  = ` 'tesseramentos'.'stato' = 1 and 'tesseramentos'.'anno' != ` + this.anno;
  }
// ---- selezione per stato
  if(socioSearch.stato !== 0) {    // impostato uno stato
    if(this.whereTessere !== '') {
      this.whereStato  = ` and socios.stato = ` + socioSearch.stato;
    } else {
      this.whereStato  = ` socios.stato = ` + socioSearch.stato;
    }

  }
// ---- selezione per località di Residenza
  if(socioSearch.localita !== 0) {    // impostato uno stato
    this.whereLocalita  = ` socios.residenza = ` + socioSearch.localita;
  }
  // ---- selezione per ruolo Operativo o solo nominale
  if(socioSearch.operativo !== ``) {    // impostato uno stato
    this.whereOperativo  = ` socios.operativo = '` + socioSearch.operativo + `' `;
  }
  // ---- selezione per Sesso
  if(socioSearch.sesso !== ``) {    // impostato uno stato
    this.whereSesso  = ` socios.sesso = '` + socioSearch.sesso + `' `;
  }
  // ---- selezione per email
  if(socioSearch.email !== ``) {    // impostato uno stato

    if(socioSearch.email === 'S') {
      this.whereEmail  = ` socios.email !=  null or socios.email != ''`;
    }
    if(socioSearch.email === 'N') {
      this.whereEmail  = ` socios.email =  null or socios.email = ''`;
    }
  }
 // ---- selezione per cellulare
  if(socioSearch.cell !== '') {    // impostato uno stato
    if(socioSearch.cell === 'S') {
      this.whereCell  = ` socios.cell !=  null or socios.cell != ''`;
    }
    if(socioSearch.cell === 'N') {
      this.whereCell  = ` socios.cell =  null or socios.cell = ''`;
    }
  }

  this.whereparam = '';
  // costruzione finale della where
  if(this.whereTessere === '') {
        this.strsql = 'select `socios`.*, `t_localitas`.`d_localita` from `socios` ' +
                  ' inner join `t_localitas` ON `t_localitas`.`id` = `socios`.`residenza` ';
  }

  if(this.whereTessere !== '') {
    this.whereparam = this.whereparam + this.whereTessere;
  }
  // selezione stato
  if(this.whereStato !== '') {
    if(this.whereTessere !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereStato;
  }
  // selezione localita
  if(this.whereLocalita !== '') {
    if(this.whereparam !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereLocalita;
  }
  // selezione operativo
  if(this.whereLocalita !== '') {
    if(this.whereparam !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereOperativo;
  }
  // selezione sesso
  if(this.whereLocalita !== '') {
    if(this.whereparam !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereSesso;
  }
  // selezione email
  if(this.whereLocalita !== '') {
    if(this.whereparam !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereEmail;
  }
  // selezione cellulare
  if(this.whereLocalita !== '') {
    if(this.whereparam !== '') {
      this.whereparam = this.whereparam + this.whereend;
    }
    this.whereparam = this.whereparam + this.whereCell;
  }



// vecchia modalita di composizione where fino al 31/07/2022
//  this.whereparam = this.whereparam + this.whereTessere + this.whereStato + this.whereLocalita +
//                      this.whereOperativo + this.whereSesso + this.whereEmail + this.whereCell;
  this.where = ' where ' + this.whereparam;
  this.strsql = this.strsql + this.where + this.orderby;

  console.log('merda ' + this.whereTessere);
  console.log('creataa la strsql ' + this.strsql);

  }






  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  let rc =  await  this.xsocioService.getsociobyFilter(this.strsql).subscribe(
       (res: any) => {

          console.log('Frontend -Soci  ---  getsociobyFilter ' + JSON.stringify(res['data']));
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
*/

async creaStrsql(socioSearch: SocioSearch) {

  console.log('createStrsql -- appena entrato ' + JSON.stringify(socioSearch));
  this.strsql = '';
  this.orderby = '';
  this.where = '';

  this.whereStato = '';
  this.whereTessere = '';
  this.whereLocalita = '';
  this.whereOperativo = '';
  this.whereSesso = '';
  this.whereEmail = '';
  this.whereCell = '';
  this.whereparam = '';

  const date = Date();
  this.dataOdierna = new Date(date);

  this.anno  = this.dataOdierna.getFullYear();

  switch (socioSearch.orderby)  {
    case 'T':   // Tessera
      this.orderby = ' order by `socios`.`tessera` asc';
      break;
    case 'A':   // Alfabetico
      this.orderby = ' order by `socios`.`cognome` asc';
      break;
    case 'R':   // Residenza
      this.orderby = ' order by `t_localitas`.`d_localita` asc';
      break;
  default:
      this.orderby = ' order by `socios`.`cognome` asc';
      break;
}

  if(socioSearch.tessere === `T`) {
  this.strsql = `select 'socios'.*, 't_localitas'.'d_localita' from 'socios' ` +
                ` inner join 't_localitas' ON 't_localitas'.'id' = 'socios'.'residenza' ` + this.orderby;
} else {

  this.strsql = `select distinct 'socios'.*, 't_localitas'.'d_localita', 'tesseramentos'.*, 't_stato_utentes'.* from 'socios' ` +
                ` inner join 't_localitas' ON 't_localitas'.'id' = 'socios'.'residenza' ` +
                ` inner join 'tesseramentos' ON 'tesseramentos'.'idTessera' = 'socios'.'tessera' ` +
                ` inner join 't_stato_utentes' ON 't_stato_utentes'.'id' = 'socios'.'stato' `;

// ---- selezione per tessere
  if(socioSearch.tessere === `R`) {    // rinnovate
    this.whereTessere  = ` 'tesseramentos'.'stato' = 1 and 'tesseramentos'.'anno' = ` + this.anno;
  }
  if(socioSearch.tessere === `D`) {    // da rinnovare
    this.whereTessere  = ` 'tesseramentos'.'stato' = 1 and 'tesseramentos'.'anno' != ` + this.anno;
  }
// ---- selezione per stato
  if(socioSearch.stato !== 0) {    // impostato uno stato
    this.whereStato  = ` socios.stato = ` + socioSearch.stato;
  }
// ---- selezione per località di Residenza
  if(socioSearch.localita !== 0) {    // impostato uno stato
    this.whereLocalita  = ` socios.residenza = ` + socioSearch.localita;
  }
  // ---- selezione per ruolo Operativo o solo nominale
  if(socioSearch.operativo !== ``) {    // impostato uno stato
    this.whereOperativo  = ` socios.operativo = '` + socioSearch.operativo + `' `;
  }
  // ---- selezione per Sesso
  if(socioSearch.sesso !== ``) {    // impostato uno stato
    this.whereSesso  = ` socios.sesso = '` + socioSearch.sesso + `' `;
  }
  // ---- selezione per email
  if(socioSearch.email !== ``) {    // impostato uno stato

    if(socioSearch.email === 'S') {
      this.whereEmail  = ` socios.email !=  null or socios.email != ''`;
    }
    if(socioSearch.email === 'N') {
      this.whereEmail  = ` socios.email =  null or socios.email = ''`;
    }
  }
 // ---- selezione per cellulare
  if(socioSearch.cell !== '') {    // impostato uno stato
    if(socioSearch.cell === 'S') {
      this.whereCell  = ` socios.cell !=  null or socios.cell != ''`;
    }
    if(socioSearch.cell === 'N') {
      this.whereCell  = ` socios.cell =  null or socios.cell = ''`;
    }
  }
  // costruzione finale della where
  if(this.whereTessere === '') {
        this.strsql = 'select `socios`.*, `t_localitas`.`d_localita` from `socios` ' +
                  ' inner join `t_localitas` ON `t_localitas`.`id` = `socios`.`residenza` ';
  }

// Nuova versione 31/07/2022

  this.wherework = '';
  this.whereparam = '';


  if(this.whereTessere !== '') {
    this.wherework = this.whereTessere;
  }
// analisi per selezione stato
  if(this.whereStato !== '') {
    if(this.wherework !== '') {
      this.whereStato  = this.whereend + this.whereStato;
    }
  }
  this.wherework = this.wherework + this.whereStato;
// analisi per selezione localita
  if(this.whereLocalita !== '') {
      if(this.wherework !== '') {
        this.whereLocalita  = this.whereend  + this.whereLocalita;
      }
  }
  this.wherework = this.wherework + this.whereLocalita;
// analisi per selezione operativo
  if(this.whereOperativo !== '') {
    if(this.wherework !== '') {
      this.whereOperativo  = this.whereend  + this.whereOperativo;
    }
  }
  this.wherework = this.wherework + this.whereOperativo;
  // analisi per selezione sesso
  if(this.whereSesso !== '') {
    if(this.wherework !== '') {
      this.whereSesso  = this.whereend  + this.whereSesso;
    }
  }
  this.wherework = this.wherework + this.whereSesso;
  // analisi per selezione email
  if(this.whereEmail !== '') {
    if(this.wherework !== '') {
      this.whereEmail  = this.whereend  + this.whereEmail;
    }
  }
  this.wherework = this.wherework + this.whereEmail;
  // analisi per selezione cellulare
  if(this.whereCell !== '') {
    if(this.wherework !== '') {
      this.whereCell  = this.whereend  + this.whereCell;
    }
  }

  this.whereparam = this.whereparam + this.whereTessere + this.whereStato + this.whereLocalita +
                      this.whereOperativo + this.whereSesso + this.whereEmail + this.whereCell;
  this.where = ' where ' + this.whereparam;
  this.strsql = this.strsql + this.where + this.orderby;

  console.log('merda ' + this.whereTessere);
  console.log('creataa la strsql ' + this.strsql);

  }

  this.trovatoRec = false;
  this.nRec = 0;
  this.isVisible = true;
  let rc =  await  this.xsocioService.getsociobyFilter(this.strsql).subscribe(
       (res: any) => {

          console.log('Frontend -Soci  ---  getsociobyFilter ' + JSON.stringify(res['data']));
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



  onSelectionChange(tipo: string)   {

   // alert('da fare' + tipo);

    if(tipo = 'Tutte') {
      this.activeFilter = false;
      this.loadSoci();
    }
    if(tipo = 'Selettiva') {
      this.activeFilter = true;
    }


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









