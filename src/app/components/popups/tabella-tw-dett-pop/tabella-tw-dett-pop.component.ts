import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { TabellaTwDettService } from './../../../services/tabella-tw-dett.service';
import { TabellaTwService } from './../../../services/tabella-tw.service';
import { TabellaService } from './../../../services/tabella.service';
// model Class

import { TabellatwDett } from '../../../classes/tabella_tw_dett';
import { Tabellat } from '../../../classes/tabella_t';
import { Tabellatw } from '../../../classes/tabella_tw';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-tabella-tw-dett-pop',
  templateUrl: './tabella-tw-dett-pop.component.html',
  styleUrls: ['./tabella-tw-dett-pop.component.css']
})
export class TabellaTwDettPopComponent implements OnInit {

  tabeldett: TabellatwDett;
  tabeldettw: TabellatwDett;
  tabellat: Tabellat;
  tabellatw: Tabellatw;

  public title = 'Gestione Tabelle';
  public tabella = '';

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTrash = faTrash;

  // variabili per editazione messaggio
  public alertSuccess = false;
  public savechange = false;
  public isVisible = false;

  public nRecMan = 0;
  public nRec = 0;
  public trovatoRec = false;
  public Message = '';
  public isSelected = false;

  public saveValueStd: boolean;
  public lastNumber = 0;
  public fase = '';

  public selectedUser: TabellatwDett;
  public editForm: FormGroup;
  public isLoading = false;
  public fieldVisible = false;
  public title_OK = 'Registrazione Elemento Tabella';
  public title_KO = 'Registrazione in Errore';
  public messageTest1  = 'Operazione conclusa correttamente ';
  public nameTabella = '';

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public message = '';

  modalRef2: BsModalRef;   // per aprire la seconda popup di conferma cancellazione

// parametri per interfaccia a ghost
  // Parametri obbligatori:
  // - routeApp
  // parametri facoltativi
  // keyn ---->  se numerico trasformarlo in stringa
  // tipo
  //     S--> campo string
  //     N--> campo Numerico
  //     *--> non serve key

  // se impostato tipo = '*'  va impostato anche key a '*'

  public routeApp = '';
  public keyn = 0;
  public keys = '';
  public tipo = '';

  public modalid = 0;

	/**
	 * Notifier service
	 */
  // private notifier: NotifierService;


  constructor(public modal: NgbActiveModal,
              private tabellaTwDettService: TabellaTwDettService,
              private tabellaTwService: TabellaTwService,
              private tabellaService: TabellaService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


ngOnInit(): void {

      this.fase = 'M';
      console.log('dati passati da chiamante: ' + this.selectedUser.id );
//      alert('popup - OnInit');


      this.loadTabettat(this.selectedUser.idtabella);
      this.loadTabellatw(this.selectedUser.idtabella);
      this.tabeldett = this.selectedUser;   // salvo la manifestazione ricevuta.
      this.setForm();
}

get editFormData() {
return this.editForm.controls;
}

//  versione in cui gestisc solo la tabella
private setForm() {
// this.selectedUser = this.manifestazione;

console.log(this.selectedUser);

this.editForm = this.formBuilder.group({
  id: [this.selectedUser.id],
  idtabella: [this.selectedUser.idtabella],
  descrizione: [this.selectedUser.descrizione, Validators.required],
 });

}



async loadTabellatw(id: number) {

console.log('Load tabellatw - n.tab: ' + id);

let xx =  await   this.tabellaTwService.getbyid(id).subscribe(
    resp => {
          this.tabellatw = resp['data'];
          console.log('letta tabellatw - totUpd: ' + this.tabellatw.numUpd);
        },
    error => {
        this.isLoading = false;
        this.type = 'error';
        this.Message = 'Errore in lettura tabella' + '\n' + error.message;
        this.showNotification(this.type, this.message);
    });
}





async loadTabettat(id: number) {

let xx =  await   this.tabellaService.getTabellat(id).subscribe(
    resp => {
          this.tabellat = resp['data'];
          this.nameTabella = this.tabellat.d_tabella;
          this.title = this.title;
          this.tabella = this.nameTabella;
    },
    error => {
          this.isLoading = false;
          this.type = 'error';
          this.Message = 'Errore in lettura tabella' + '\n' + error.message;
          this.showNotification(this.type, this.message);
    });
}


onSubmit() {
   //   alert(' sono in onSubmit');
      if (this.editForm.invalid ) {
          alert('form invalido');
      }
      if (this.isLoading ) {
      alert('is this.isLoading');
      }
      if (this.editForm.invalid || this.isLoading) {
       return;
      }
  //    alert(' sono in onSubmit - step_01 - fase:' + this.fase);
      // this.isLoading = true;
      this.updateElTabella(this.fase);
      this.modal.close('Yes');
      this.modalService.hide();
   //   this.modalService.hide(this.modalid);



}


routerGhost() {
    localStorage.setItem('tabellat', String(this.selectedUser.idtabella));

    this.routeApp = 'tabellat';
    this.keys = '*';
    this.tipo = '*';
    this.Message = this.message;
    // this.Message =  'operazione conclusa con successo '; //  this.message;
    this.router.navigate(['ghost/' + this.routeApp + '/tipo/' + this.tipo + '/key/'  + this.keys + '/M/' + this.Message]);

    console.log('ghost: ' + 'ghost/' + this.routeApp + '/tipo/' + this.tipo + '/key/'  + this.keys + '/M/' + this.Message);
    this.modal.close('Yes');

   // this.modalService.hide(modalId);

}





/*
async  InsertElTabella() {

let aa =  await   this.tabellaTwDettService.getLastelTabella().subscribe(
res => {
 this.tabeldettw = res['data'];

console.log('ultimo elemento inserito con tappo = N ' + this.tabeldettw.id + ' la fase è: ' +this.fase);

 this.tabeldett = new TabellatwDett();
 this.tabeldett.id = this.tabeldettw.id + 1;
 this.tabeldett.stato = this.fase;
 this.tabeldett.descrizione = this.editFormData.descrizione.value.toUpperCase();
 this.tabeldett.idtabella = this.editFormData.idtabella.value;
 this.tabeldett.key_utenti_operation = parseInt(localStorage.getItem('id'));

 console.log('tabeldett prima di insert: ' + this.tabeldett);
 this.tabellaTwDettService.createelTabella(this.tabeldett).subscribe(
   x => {
       this.isLoading = false;
       this.type = 'success';
       this.message = 'Inserimento di ' +   this.tabeldett.descrizione + ' \n  eseguita con successo';
       this.routerGhost();
  //     this.showNotification(this.type, this.message);
  //     this.modal.close('Yes');
   },
   error => {
       this.isLoading = false;
       this.type = 'error';
       this.Message = 'Errore Ins.to' + '\n' + error.message;
       this.showNotification(this.type, this.message);
 });
},
error => {
  console.log(error);
  this.type = 'error';
  this.Message = 'Errore get Last day' + '\n' + error.message;
  this.showNotification(this.type, this.message);
});

}

*/

async updateElTabella(fase: string)  {

    console.log('sono in update elemento -  fase: ' + this.fase);
    this.tabeldett.descrizione = this.editFormData.descrizione.value.toUpperCase();
    this.tabeldett.stato = this.fase;
    await this.tabellaTwDettService.update(this.tabeldett).subscribe(
        x => {
        // aggiornamento rimandato a dopo passaggio a ghost che riavvia il componente

              if(x['rc'] === 'OK') {
                this.message = 'Aggiornamento di ' +  this.tabeldett.descrizione + ' \n  eseguita con successo';
                console.log('updateElTabella - messaggio: ' + this.message);
                this.isLoading = false;
                this.type = 'success';
                this.isVisible = true;
                this.showNotification(this.type, this.message);


         //       this.routerGhost();   non ricordo come avviene questa navigazione
              }

              /*
                */
         },
      error => {
            this.isLoading = false;
            console.log(error);
            this.type = 'error';
            this.Message  = 'Errore agg.to' + '\n' + error.message;
            this.showNotification(this.type, this.message);
            //       this.alertSuccess = false;
        });
}

// metodo che non serve a nulla

async aggiornatw(id: number) {

/*
console.log('aggiorno tabellatw - n.tab:' + id);
console.log('totUpd ' + this.tabellatw.numUpd);
this.tabellatw.numUpd =  this.tabellatw.numUpd + 1;
console.log('totUpd aggiornato' + this.tabellatw.numUpd);

*/




let resp =  await this.tabellaTwService.update(this.tabellatw).subscribe(
    x => {
         this.isLoading = false;
         this.type = 'success';
         this.message = 'Aggiornamento di ' +  this.tabeldett.descrizione + ' \n  eseguita con successo';

         console.log('aggiornatw -  message: ' + this.message);
        //  this.showNotification(this.type, this.message);
        //  this.modal.close('Yes');
    },
    error => {
        this.isLoading = false;
        console.log(error);
        this.type = 'error';
        this.Message  = 'Errore agg.to tw ' + '\n' + error.message;
        this.showNotification(this.type, this.message);
    });
}


openModal2(template: TemplateRef<any>) {
this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });
}



closeModal(modalId?: number){

  /*     originale
alert('idModal: ' + modalId);
if(modalId == 2) {
alert('premuto Annulla')
}

if(modalId == 1) {
this.fase = 'D';
this.updateElTabella(this.fase);
alert('premuto Conferma - opero la cncellazione e chiudo le form')
this.modalService.hide();
}




alert('chiuso la seconda modal');
this.modalService.hide(modalId);

*/

if(modalId === 1) {
  this.onSubmit();
}


}



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/
public showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}


}

