import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TabellatwDett } from '../../../classes/tabella_tw_dett';
import { faUserEdit, faTrash, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TabellaTwDettPopComponent } from '../../../components/popups/tabella-tw-dett-pop/tabella-tw-dett-pop.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-tabella-tw-dett]',
  templateUrl: './tabella-tw-dett.component.html',
  styleUrls: ['./tabella-tw-dett.component.css']
})
export class TabellaTwDettComponent implements OnInit {

  // variabili passate dal componente padre
  @Input('tabella-tw-dett-data') tabellatwDett: TabellatwDett;
  @Input('tabella-tw-dett-prog') i: number;

  // passo dati al componente padre (tabelle)
  @Output('onUpdateTabella') onUpdateTabella = new EventEmitter();


// prod: Prodotto;
faUserEdit = faUserEdit;
faTrash = faTrash;
faInfo = faInfo;
faInfoCircle = faInfoCircle;

// -----
public textMessage1 = '';
public textMessage2 = '';
public textUser = '';
public headerPopup = '';
public perDebug = 'Prodotto passato: ';
public Message = '';
public presenti = false;
public isVisible = false;
public alertSuccess = false;
public aMenuSearch = '';
public functionEnabled = false;


public type = '';

public nRec = 0;


constructor(public modal: NgbModal,
            private route: Router,
            private notifier: NotifierService) {
             this.notifier = notifier;
           }

ngOnInit(): void {

  //   per gestire eventuale popup
  this.headerPopup = 'Registrazione Tabella';
  this.textMessage1 = '?????????? ';
//   this.textUser = this.messa.demessa;
  this.textMessage2 = 'Registrazione non possibile';

}



/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}



showelTabDetailPopup(tabellatwDett: TabellatwDett) {

  const ref = this.modal.open(TabellaTwDettPopComponent, {size:'lg'});
  ref.componentInstance.selectedUser = tabellatwDett;

  ref.result.then(
    (yes) => {
      console.log('Click YES');
      console.log('fatto aggiornamento: ' + JSON.stringify(tabellatwDett));
      // passo i dati al componente padre che aggiorna l'elemento vero sulla tabella
      this.onUpdateTabella.emit(tabellatwDett);
    },
    (cancel) => {
      console.log('click Cancel');
    });

}






// passare oggetto messa
// this.route.navigate(['messa', this.messa.id]);

//   metodo per conferma popup
okconfirm() {
// alert('metodo da fare');
}

}


