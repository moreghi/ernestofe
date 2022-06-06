import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';


// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../services/auth.service';
import { JwtInterface } from '../../../interfaces/jwt';

// vedere su nodejs_test  cosa fanno
// import { AccountService, AlertService } from '@app/_services';
// import { MustMatch } from '@app/_helpers';   // fa il controllo su passqord e conferma password




@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css'],
 // viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class RegistrazioneComponent implements OnInit {

  /*
  public form = {
    titolo: null,
    cognome: null,
    nome: null,
    email: null,
    username: null,
    password: null,
    confirmPassword: null
  };

*/

/*
  public form = {
    titolo: null,
    cognome: null,
    nome: null,
    email: null,
    username: null,
    password: ['', [
      Validators.required,
      Validators.pattern('((?=.*\d)(?=.*[a-z-9._%+-])(?=.*[A-Z-9._%+-]).{8,40})')
      ]],
      confirmPassword: ['', [
      Validators.required,
      Validators.pattern('((?=.*\d)(?=.*[a-z-9._%+-])(?=.*[A-Z-9._%+-]).{8,40})')
      ]],
  };
*/

public form = {
//  titolo: null,
  cognome: null,
  nome: null,
  email: null,
  username: null,
  password: '',
  confirmPassword: ''
};


  loading = false;
  submitted = false;

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


    if(form.valid) {

      console.log('onSubmit - form VALIDO');
      console.log('onSubmit: email: ' + form.value.email);
    }





    console.log('onSubmit: cognome: ' + form.value.cognome);


    console.log(`Moreno - registerComponent - appena entrato in onsubmit  ------ form - ${form.value}`);

    console.log(`moreno - cognome ${form.value.cognome}`);   // ${form.value.cognome}



    // originale
    /*
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;

      console.log(`registerComponent - prima di service.register - ${this.form.value}`);
      this.accountService.register(this.form.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
             */
         // moreno per gestire invio mail corretta  2021/11/18

  /* attenzione
      prima dell'invio effettuare la registrazione su "register_confirmeds"

      preparare il corpo della mail per invio  mail

*/

    this.submitted = true;

         // reset alerts on submit
        //   via                 this.alertService.clear();

         // stop here if form is invalid
    if (form.invalid) {
             return;
         }

    this.loading = true;

    console.log(`Moreno - registerComponent - prima di service.register ------ cognome - ${form.value.cognome}`);

    this.authService.registerMoreno(form.value.cognome, form.value.nome, form.value.username, form.value.email, form.value.password).subscribe(
          resp => {
           //     this.prenotazione = resp['data'];
              this.type = 'success';
              this.Message = 'Registration successful, please check your email for verification instructions ';
              this.showNotification(this.type, this.Message);
             },
          error => {
               alert('sono in Registrazione');
               console.log(error);
               this.type = 'error';
               this.Message = 'registraMoreno - non esegibile ';
               this.showNotification(this.type, this.Message);
             });


/*

         return  this.authService.registerMoreno(form.value.cognome, form.value.nome, form.value.username, form.value.email, form.value.password)
             .pipe(first())
             .subscribe({
             next: () => {
              this.type = 'success';
              this.Message = 'Registration successful, please check your email for verification instructions ';
              this.showNotification(this.type, this.Message);
             //    this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
             //    this.router.navigate(['../login'], { relativeTo: this.route });
             },
             error: error => {
              this.type = 'error';
              this.Message = 'registraMoreno - non esegibile ';
              this.showNotification(this.type, this.Message);

             }
         });
*/

       /*
         this.authService.registerMoreno(this.form.value)
             .pipe(first())
             .subscribe({
                 next: () => {
                     this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                     this.router.navigate(['../login'], { relativeTo: this.route });
                 },
                 error: error => {
                     this.alertService.error(error);
                     this.loading = false;
                 }
             });
*/
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
