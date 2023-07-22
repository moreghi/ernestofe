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


// controllo email prima di fare signin

  try {

/*
    this.auth.controlemail(form.value.email.toLowerCase()).subscribe(
      res => {
          if(res['rc'] === 'nf') {
            this.type = 'error';
            this.Message = res['message'];
            this.showNotification(this.type, this.Message);
            return;
          }
          if(res['rc']  === 'ok') {
            this.eseguilogin(form);
          }
     },
     error => {
        alert('Auth  -- controlemail - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     });


     */

// controllo password e email

this.eseguilogin(form);
/*
this.auth.controlpassword(form.value.email, form.value.password.toLowerCase()).subscribe(
  res => {

      console.log('frontend --> controlpassword -- return-code ' + res['rc']);


      if(res['rc'] === 'nf') {
        this.type = 'error';
        this.Message = res['message'];
        this.showNotification(this.type, this.Message);
        return;
      }
      if(res['rc']  === 'ok') {
        this.eseguilogin(form);
      }
   },
   error => {
      alert('Auth  -- controlpassword - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
 });

 */

    console.log('--------------------------------------------------  merdaaaaaaa ---------------------------------');

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


eseguilogin(form: NgForm) {

  console.log('frontend - eseguilogin email: ' + form.value.email + ' --- password: ' + form.value.password);

  this.auth.signIn(form.value.email.toLowerCase(), form.value.password.toLowerCase().subscribe(
    res => {
        if(res['rc'] === 'nf') {
          this.type = 'error';
          this.Message = res['message'];
          this.showNotification(this.type, this.Message);
          return;
        }
        if(res['rc']  === 'ok') {
          this.type = 'success';
          this.Message = 'utente   Loggato con successo';
          this.showNotification(this.type, this.Message);
          this.isVisible = true;
          this.alertSuccess = true;
          this.router.navigate(['/jumbotron']);
        }
     },
   error => {
        alert('Auth  -- controlpassword - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
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


------------------------  via

this.auth.controlpassword(form.value.email, form.value.password.toLowerCase()).subscribe(
  res => {
      if(res['rc'] === 'nf') {
        this.type = 'error';
        this.Message = res['message'];
        this.showNotification(this.type, this.Message);
        return;
      }
      if(res['rc']  === 'ok') {
        this.eseguilogin(form);
      }
   },
   error => {
      alert('Auth  -- controlpassword - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
 });





*/


/*


/* originario fino al 19/03/2023

eseguilogin(form: NgForm) {

  console.log('frontend - eseguilogin email: ' + form.value.email + ' --- password: ' + form.value.password);

  this.auth.signIn(form.value.email.toLowerCase(), form.value.password.toLowerCase()).subscribe(
    res => {
        if(res['rc'] === 'nf') {
          this.type = 'error';
          this.Message = res['message'];
          this.showNotification(this.type, this.Message);
          return;
        }
        if(res['rc']  === 'ok') {
          this.type = 'success';
          this.Message = 'utente   Loggato con successo';
          this.showNotification(this.type, this.Message);
          this.isVisible = true;
          this.alertSuccess = true;
          this.router.navigate(['/jumbotron']);
        }
     },
   error => {
        alert('Auth  -- controlpassword - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     }
   ));
  }

*/
}

