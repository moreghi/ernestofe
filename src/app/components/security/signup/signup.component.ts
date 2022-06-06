import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../services/auth.service';
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

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private authService: AuthService,
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

/*
    try {
      this.authService.registerMoreno(form.value.cognome, form.value.nome, form.value.username, form.value.email, form.value.password)
      .subscribe(
        resp => {
         //     this.prenotazione = resp['data'];
            this.type = 'success';
            this.Message = 'Registration successful, please check your email for verification instructions ';
            this.showNotification(this.type, this.Message);
           },
        error => {
             alert('sono in Registrazione');
             console.log(error);
             console.log('log- message ' + error.message);
             console.log('log-codice-err: ' + error.status.code);
             this.type = 'error';
             this.Message = 'registraMoreno - non esegibile ';
             this.showNotification(this.type, this.Message);
           });

    } catch (err) {
      alert(err.name); // ReferenceError
      alert(err.message); // lalala non è definito
      alert(err.stack); // ReferenceError: lalala non è definito a (...call stack)
      alert(err.status.code); // ReferenceError: lalala non è definito
    }

*/





    this.authService.registerMoreno(form.value.cognome, form.value.nome, form.value.username, form.value.email, form.value.password)
        .subscribe(
          resp => {
           //     this.prenotazione = resp['data'];
              this.type = 'success';
              this.Message = 'Registrazione avvenuta con successo, controlla la tua email per le istruzioni di verifica ';
              this.showNotification(this.type, this.Message);
             },
          error => {
               this.loading = false;
               this.errorMessage = error.message;
               console.log('errorMessage: ' + this.errorMessage);
               this.errorStatus = error.status;
               console.log('               errorStatus: ' + this.errorStatus);
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



          //     alert('sono in Registrazione');



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





}
