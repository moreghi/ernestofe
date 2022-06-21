import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';    //  @fortawesome/free-regular-svg-icons
// service
import { QuotatesseraService } from '../../../services/quotatassera.service';
import { BandieragiallaService } from './../../../services/bandieragialla.service';

// classi
import { Quotatessera} from '../../../classes/Quotatessera';
import { Bandieragialla } from '../../../classes/BandieraGialla';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quotetessera',
  templateUrl: './quotetessera.component.html',
  styleUrls: ['./quotetessera.component.css']
})
export class QuotetesseraComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public quote: Quotatessera[] = [];
  public bandieragialla: Bandieragialla;

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


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Quote Tessera";
  public trovatoRec = false;
  public nRec = 0;


  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;
  public idBg = 1;



  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private quotatesseraService: QuotatesseraService,
            private bandieragiallaService: BandieragiallaService,
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

          goApplication() {
            this.loadBandieragialla(this.idBg);
            this.loadQuote();

          }

          async loadBandieragialla(id: number) {
            console.log('frontend - loadBandieragialla: ' + id);
            let rc = await  this.bandieragiallaService.getbyId(id).subscribe(
            response => {
              if(response['rc'] === 'ok') {
                console.log('bg da editare  ' + JSON.stringify(response['data']));
                this.bandieragialla = response['data'];
              }
              if(response['rc'] === 'nf') {
                this.Message = response['message'];
                this.type = 'error';
                this.showNotification( this.type, this.Message);
              }
            },
              error => {
                  alert('loadBandieragialla: ' + error.message);
                  console.log(error);
                  this.alertSuccess = false;
                  this.Message = error.message;
                  this.type = 'error';
                  this.showNotification( this.type, this.Message);
                  });
            }


          async loadQuote() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.quotatesseraService.getAll().subscribe(
                 (res: any) => {

                    console.log('Frontend -Quote  ---  loadQuote ' + JSON.stringify(res['data']));
                    this.quote = res['data'];
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Soci  -- loadQuote - errore: ' + error.message);
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
    alert('da fare');
    this.router.navigate(['quotat/new']);
  }





}


