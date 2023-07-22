import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// per gestire il popup con esito operazione
// model
import { User } from '../../../classes/User';
// Service
import { UserService } from '../../../services/user.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../services/auth.service';
import { RegisterconfirmedService } from '../../../services/registerconfirmed.service';
import { JwtInterface } from '../../../interfaces/jwt';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public form = {
    //  titolo: 0,
      cognome: null,
      nome: null,
      email: null,
      username: null,
      password: '',
      confirmPassword: ''
    };


    loading = false;
    errorMessage = '';
    errorError = '';
    errorStatus = 0;

    public Message = '';
    public type = '';
    public formCorrect = false;
    public token = '';


    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private authService: AuthService,
                 private userService: UserService,
                 private regconfirmService: RegisterconfirmedService,
                 private notifier: NotifierService) {
                  this.notifier = notifier;
                }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm)  {

    if (!form.valid) {
      // alert('form Invalido - Login non verificabile');
      this.type = 'error';
      this.Message = 'form Invalido - Signup non eseguibile ';
      this.showNotification(this.type, this.Message);
      return;
  }

    console.log('onSubmit - form VALIDO');

    console.log(`Moreno - registerComponent - appena entrato in onsubmit  ------ form - ${form.value}`);



    console.log(`Moreno - registerComponent - prima di service.register ------ cognome - ${form.value.cognome}`);

  // verifica se email già utilizzata


    this.userService.getuserbyEmail(form.value.email).subscribe(
    resp => {
          if(resp['rc'] === 'ok') {
            this.type = 'error';
            this.Message = 'email già in uso ad altro utente - registrazione non possibile ';
            this.showNotification(this.type, this.Message);
            return;
          }
          if(resp['rc'] === 'nf') {
            this.crearegConfirm(form.value.cognome, form.value.nome, form.value.username,
              form.value.email, form.value.password);
          }
      },
    error => {
         alert('sono in onSubmit');
         console.log(error);
         console.log('log- message ' + error.message);
         console.log('log-codice-err: ' + error.status.code);
         this.type = 'error';
         this.Message = 'onSubmit - non eseguibile ';
         this.showNotification(this.type, this.Message);
       });

      }


crearegConfirm(cognome: string, nome: string, username: string, email: string, password: string)  {

    console.log('signup-creareConfirm --- appena entrato ---- password: ' + password);

    this.regconfirmService.registerMoreno(cognome, nome, username, email, password.toLowerCase()).subscribe(
          resp => {

              console.log('frontend-signup.Component - finito registermoreno ok con ceazione rec da confermare');
              console.log('dati di tirorno: - rc' + resp['rc'] + ' token: ' + resp['tokennewuser']);

              if(resp['rc'] === 'ok') {
                this.token = resp['tokennewuser'];

                console.log('signup-creareConfirm --- effettuato registraMoreno  ---- token: ' + this.token);
                console.log('sto per effettuare effettuainvioemail ---------------------------------');
                console.log('cognome:' + cognome + ' nome: ' + nome + ' email: ' + email + ' token: ' + this.token);

                this.effettuainvioemail(email, cognome, nome, this.token);
              }
           },
          error => {
               this.loading = false;
               this.errorMessage = error.message;
               console.log('Signup ------ errorMessage: ' + this.errorMessage);
               this.errorStatus = error.status;
               console.log('signup -------               errorStatus: ' + this.errorStatus);
               if(error.status === 400) {
                  this.type = 'error';
                  this.Message = error.error.message; //'email già registrata - registrazione non possibile ';
                  this.showNotification(this.type, this.Message);
                } else {
                  console.error(error);
                  this.type = 'error';
                  this.Message = 'registraMoreno - non esegibile ';
                  this.showNotification(this.type, this.Message);

                  console.error('error caught in component');
                  throw error;
                }
            });
}


/*
 * Show a notification
 *
 * @param {string} type    Notification type
 * @param {string} message Notification message
 */

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
  }


  effettuainvioemail(email: string, cognome: string, nome: string, token: string) {


    console.log('effettuainvioemail --- appena entrato ---- cog:' + cognome + ' nome: ' + nome + ' email: ' + email + ' token: ' + token);


    this.regconfirmService.SendEmailbynewUser(email, cognome, nome, token).subscribe(
      resp => {
        if(resp['rc'] === 'ok') {
           //     this.prenotazione = resp['data'];
           this.type = 'success';
           this.Message = 'Registrazione avvenuta con successo, controlla la tua email per le istruzioni di verifica ';
           this.showNotification(this.type, this.Message);
        }
      },
      error => {
           console.error(error);
           this.type = 'error';
           this.Message = 'registraMoreno - errore in invio email per registrazione nuovo utente ';
           this.showNotification(this.type, this.Message);

           console.error('registraMoreno - errore in invio email per registrazione nuovo utente');
           throw error;
         });
    }




}
