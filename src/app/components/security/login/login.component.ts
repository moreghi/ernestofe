import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { JwtInterface } from '../../../interfaces/jwt';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public error = '';
  public form = {
    email: null,
    password: null
  };

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';

  isLoggedIn = false;

  constructor(private auth: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

ngOnInit(): void {
// presente solo per nuova versione jwt

  console.log('login - onInit ');
  if (this.tokenStorage.getToken()) {
    console.log('login - uscita 1');
    this.isLoggedIn = true;
  } else {
    this.form.email = '';
    this.form.password = '';
    console.log('login - uscita 2');
  }
}







/*

attenzione: 1° soluzione - utilizzo di subscribe

onSubmit(form: NgForm) {
if(!form.valid) {
alert('form Invalido - Login non verificabile');
return;
}

this.auth.signIn(form.value.email, form.value.password).subscribe(
(_payload: JwtInterface) => {
alert('login eseguito con successo');
this.router.navigate(['/']);
},
({error}) =>{
alert(error.error);
console.log(error)
}
);


}

*/

// nuova versione con jwt  24/11/2021

onSubmit(form: NgForm): void {       // funziona alla perfezione
  if (!form.valid) {
    // alert('form Invalido - Login non verificabile');
    this.type = 'error';
    this.Message = 'form Invalido - Login non verificabile ';
    this.showNotification(this.type, this.Message);
    return;
}
  const xx = form.value.password;

  console.log('password inserito e messa a lowercase ' + form.value.password.toLowerCase());

  console.log('password inserito e messa a lowercase  DIRETTA ' + form.value.password.toLowerCase());

  if(form.value.password.toLowerCase() === 'provvisoria') {
    this.router.navigate(['/chgpswnuwuser']);
  }



 // const { username, password } = this.form;
  this.isVisible = true;



  //  con gestione subscribe  - in auth.service faccio solo la lettura  semplice
/*
  this.auth.signIn(form.value.email, form.value.password).subscribe(
    data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      this.type = 'success';
      this.Message = 'utente loggato correttamente';
      this.showNotification(this.type, this.Message);
    //  this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.alertSuccess = true;
    },
    err => {
      this.type = 'error';
      this.Message = err.error.message;  //'form Invalido - Login non verificabile ';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
    }
  );
*/








  try {

  this.auth.signIn(form.value.email.toLowerCase(), form.value.password.toLowerCase());

  this.type = 'success';
  this.Message = 'utente   Loggato con successo';
  this.showNotification(this.type, this.Message);

  // alert(resp.cognome + ' loggatao correttamente');
  this.Message = 'utente   Loggato con successo';
  this.isVisible = true;
  this.alertSuccess = true;


} catch (e) {
  switch(e.status) {
    case 401:
       this.Message = 'email e/o password errati';
       break;
    case 404:
       this.Message = e.error.message;
       break;
    case 500:
      this.Message = 'errore server - contattare amministratore';
      break;
    default:
       this.Message = 'errore non identificato: ' + e.status;
       break;
  }


  this.type = 'error';
  this.showNotification(this.type, this.Message);
//  messaggio sulla barra

  this.isVisible = true;
  this.alertSuccess = false;

}



}



// vecchia versione  fino al 23/11/2021 prima di gestione jwt


// secondo metodo utilizzando  async - await    <-------------------  Importante
/*
async onSubmit(form: NgForm)  {
if (!form.valid) {
      // alert('form Invalido - Login non verificabile');
      this.type = 'error';
      this.Message = 'form Invalido - Login non verificabile ';
      this.showNotification(this.type, this.Message);
      return;
  }


console.log('onSubmit: email: ' + form.value.email);

try {
    const resp = await this.auth.signIn(form.value.email, form.value.password);
    this.type = 'success';
    this.Message = 'utente ' + resp.cognome + '  Loggato con successo';
    this.showNotification(this.type, this.Message);
    // alert(resp.cognome + ' loggatao correttamente');
    this.Message = 'utente ' + resp.cognome + '  Loggato con successo';
    this.isVisible = true;
    this.alertSuccess = true;

} catch (e) {
    switch (e.status) {
        case 401:
          this.Message = 'email e/o password errati';
          break;
        case 404:
          this.Message = e.error.message;
          break;
        case 500:
          this.Message = 'errore server - contattare amministratore';
          break;
        default:
          this.Message = 'errore non identificato: ' + e.status;
          break;
    }
    this.type = 'error';
    this.showNotification(this.type, this.Message);
    //  messaggio sulla barra
    this.isVisible = true;
    this.alertSuccess = false;
  }

}

*/

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

