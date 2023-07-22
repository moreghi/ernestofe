import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// model
import { User } from '../../../classes/User';
import { Userlevel } from '../../../classes/UserLevel';
// Service
import { UserService } from '../../../services/user.service';
import { UserlevelService } from '../../../services/userlevel.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../services/auth.service';
// icone
import { faSave, faReply } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-abilitazione',
  templateUrl: './abilitazione.component.html',
  styleUrls: ['./abilitazione.component.css']
})
export class AbilitazioneComponent implements OnInit {



// icone
faSave = faSave;
faReply = faReply;

public selectedUserLevel = 9;
// variabili per visualizzazione messaggio di esito con notifier
 public type = '';
 public Message = '';

 public userlevels: Userlevel[] = [];
 public user: User;
 public userlevel: Userlevel;
 public userlevelw: Userlevel;
 public profilo = '';


 public title = '';
 public alertSuccess = false;
 public isVisible = false;
 public rotta = '';
 public rottafase = '';
 public dataOdierna;
 public idpassed = 0;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private authService: AuthService,
               private userService: UserService,
               private userlevelService: UserlevelService,
               private notifier: NotifierService) {
                 this.notifier = notifier;
               }

  ngOnInit(): void {
    this.goApplication();
  }


  goApplication() {

    this.isVisible = true;
    this.alertSuccess = true;
    this.loadUserLevels();
    this.title = 'Aggiornamento Abilitazioni Utente  -- aggiornamento works';
    this.route.paramMap.subscribe(p => {
    this.idpassed = +p.get('id');
    console.log('id recuperato: ' + this.idpassed);
    this.loadUser(this.idpassed);
    this.Message = 'pronto per aggiornamento Abilitazione';
   });

  }






 async loadUser(id: number) {
  console.log('frontend - loadUser: ' + id);
  let rc = await  this.userService.getuser(id).subscribe(
  response => {
    if(response['rc'] === 'ok') {
      console.log('utente da editare abilitazione: ' + JSON.stringify(response['data']));
      this.user = response['data'];
      this.selectedUserLevel = this.user.idLevel;
      this.loadUserLevelActual(this.user.idLevel);
    }
    if(response['rc'] === 'nf') {
      this.Message = response['message'];
      this.type = 'error';
      this.showNotification( this.type, this.Message);
    }
  },
    error => {
    alert('Abilitazione  --loadUser: ' + error.message);
    console.log(error);
    this.alertSuccess = false;
    this.Message = error.message;
    this.type = 'error';
    this.showNotification( this.type, this.Message);
    });
  }


  async loadUserLevelActual(level: number) {
    console.log('frontend - loadUserLevelActual: ' + level);
    let rc = await  this.userlevelService.getbyId(level).subscribe(
    response => {
      if(response['rc'] === 'ok') {
        console.log('abilitazione attuale: ' + JSON.stringify(response['data']));
        this.userlevel = response['data'];
      }
      if(response['rc'] === 'nf') {
        this.Message = response['message'];
        this.type = 'error';
        this.showNotification( this.type, this.Message);
      }
    },
      error => {
      alert('Abilitazione  --loadUserLevelActual: ' + error.message);
      console.log(error);
      this.alertSuccess = false;
      this.Message = error.message;
      this.type = 'error';
      this.showNotification( this.type, this.Message);
      });
    }



    onSelectedUserLevel(selectedValue: number) {
      //  alert('selezionato: ' + selectedValue);
        if(selectedValue ==  9999) {
          this.type = 'error';
          this.Message = 'selezione non corrette';
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
          this.isVisible = true;
          this.selectedUserLevel = 9;
          return;
       } else {
          this.selectedUserLevel = selectedValue;
          this.user.idLevel = selectedValue;
          this.type = 'success';
          this.Message = 'selezione profilo corretta - premi conferma per modificare profilo';
          this.showNotification(this.type, this.Message);
          this.alertSuccess = true;
          this.isVisible = true;
       }

     }


     async  loadUserLevels() {
      console.log('loadUserLevels');
      let rc = await this.userlevelService.getAlls().subscribe(
          resp => {
                console.log('loadUserLevels: ' + JSON.stringify(resp['data']));
                if(resp['rc'] === 'ok') {
                  this.userlevels = resp['data'];
                }
             },
          error => {
               alert('sono in loadUserLevels');

               console.log('loadUserLevels - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
       }


//
// Show a notification
//
// @param {string} type    Notification type
// @param {string} message Notification message
//

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
  this.notifier.notify( type, message );
  console.log(`sono in showNotification  ${type}`);
  //   alert('sono in notifier' + message);
  }



  async conferma() {
    if(this.selectedUserLevel === 9) {
          this.type = 'error';
          this.alertSuccess = false;
          this.Message = 'Selezionare il livello di abilitazione !!';
          this.showNotification(this.type, this.Message);
          return;
        }



    console.log(`pronto per fare modifica : ${JSON.stringify(this.user)}`);
    this.user.key_utenti_operation = +localStorage.getItem('id');
    let rc1 = this.userService.updateUser(this.user, this.user.id).subscribe(
    res => {
              if(res['rc'] === 'ok') {
                  this.type = 'success';
                  this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
                  this.alertSuccess = true;
                  this.showNotification( this.type, this.Message);
                  this.router.navigate(['/users']);
               }},
              error => {
                 console.log(error);
                 this.type = 'error';
                 this.Message = error.message;
                 this.alertSuccess = false;
                 this.showNotification( this.type, this.Message);
              });

    }

goback() {
  alert('da fare goback');
}




}
