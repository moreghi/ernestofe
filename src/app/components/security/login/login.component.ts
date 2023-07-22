import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { JwtInterface } from '../../../interfaces/jwt';
import { NotifierService } from 'angular-notifier';
import { UserlevelService } from '../../../services/userlevel.service';
// model
import { User } from '../../../classes/User';
import { Userlevel } from '../../../classes/UserLevel';


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

  public user: User;
  public userlevel: Userlevel;

  isUserLogged = true;
  isLoggedIn = false;

  public navigateInqu = 'Inqu';
  public navigateEdit = 'Edit';
  public navigateEdits = 'Edits';

  public functUser = '';

  constructor(private auth: AuthService,
              private tokenStorage: TokenStorageService,
              private userlevelService: UserlevelService,
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

onSubmit(form: NgForm) {       // funziona alla perfezione
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




// controllo email prima di fare signin


// ----------------------------  versione con promise --- da errore

/*
  try {

  const resp = await this.auth.signIn(form.value.email, form.value.password).toPromise();
  alert(resp.user_name + ' logged in successfully');
  this.router.navigate(['/']);

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

*/


// ------------------------------------------------------   versione con subscribe

  console.log('frontend - eseguilogin email: ' + form.value.email + ' --- password: ' + form.value.password);
  this.auth.signIn(form.value.email, form.value.password).subscribe(
  res => {
      if(res['rc'] === 'nf') {
        this.type = 'error';
        this.Message = res['message'];
        this.showNotification(this.type, this.Message);
        return;
      }
      if(res['rc'] === 'ko') {
        this.type = 'error';
        this.Message = res['message'];
        this.showNotification(this.type, this.Message);
        return;
      }
      if(res['rc']  === 'ok') {
        //    alert('login corretto');
        // salvo sulla locatStorage i dati dell'utente loggato
            console.log('frontend  ----------------  salvo i dati dell utente loggato su localStorage');
            localStorage.setItem('token', res['accessToken']);
            localStorage.setItem('username', res['username']);
            localStorage.setItem('cognome', res['cognome']);
            localStorage.setItem('email', res['email']);
            localStorage.setItem('level', res['level']);
            localStorage.setItem('id', String(res['id']));   // posso salvare su localstorage solo campi string
            localStorage.setItem('token_type', res['token_type']);
            localStorage.setItem('expires_in', res['expires_in']);
            localStorage.setItem('user', String(JSON.stringify(res['user'])));
            localStorage.setItem('user_ruolo', String(res['level']));
            this.user = new User();
            this.user = res['user'];

            console.log('frontend -------  recupero il profilo  --------   utente loggato: ' + this.user.cognome);

            this.loadProfilo(this.user);
      }
   },
 error => {
      alert('Auth  -- controlpassword - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });

}

// recupero il profilo
loadProfilo(user: User) {
  console.log('loadProfilo ------   appena entrato');

  this.userlevelService.getbyId(user.idLevel).subscribe(
    res => {

      console.log('rc dopo lettura su backend: ' + res['rc']);


      if(res['rc']  === 'ok') {
        //    alert('login corretto');
        // salvo sulla locatStorage i dati dell'utente loggato
            console.log('frontend  ---- loadFrofilo --  .... ok .... ---  salvo i dati dell utente loggato su localStorage');

            this.userlevel = res['data'];
            localStorage.setItem('Druolo', this.userlevel.UserLevelName);

            // imposto localStorage -- functionUser dal profilo
            switch (this.userlevel.id) {
                case -1:
                case 99:
                  this.functUser = this.navigateEdits;
                  break;
                case 0:
                  this.functUser = this.navigateInqu;
                  break;
                case 1:
                case 2:
                  this.functUser = this.navigateEdit;
                  break;
                default:
                  this.functUser = this.navigateInqu;
                  break;
              }
            localStorage.setItem('functUser', this.functUser);


            console.log('frontend -------  login --- ok -----   utente loggato: ' + this.user.cognome + ' funzione: ' + this.functUser);

            this.creaevetemitter(this.user);
      }
      if(res['rc']  === 'nf') {
        //    alert('login corretto');
        // salvo sulla locatStorage i dati dell'utente loggato
            console.log('frontend  ---- loadFrofilo --     nf    ---  salvo i dati dell utente loggato su localStorage');

            const profilo = 'Profilo Inesistente !!';
            localStorage.setItem('Druolo', profilo);

            console.log('frontend -------  login --- nf -----   utente loggato: ' + this.user.cognome);

            this.creaevetemitter(this.user);
      }
    },
    error => {
         alert('login  -- loadFrofilo - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      });


}



// modifica moreno 20/03/2023
// effettuato il login effettuo il metodo  per generare evenemitter
creaevetemitter(user: User): void{

  this.auth.creaevenemitterlogin(user);

  const idevent = JSON.parse(localStorage.getItem('evemitlogin'));  // normalizzo la variabile user salvata con JSON.stringify
  const iduser = JSON.parse(localStorage.getItem('id'));


  if(idevent === iduser) {
      // ho controllato di aver emesso evenemitter per utente loggato
      this.isUserLogged = true;
      this.type = 'success';
      this.Message = 'utente   Loggato con successo';
      this.showNotification(this.type, this.Message);
      this.isVisible = true;
      this.alertSuccess = true;
      this.router.navigate(['/jumbotron']);
    } else {
      this.type = 'error';
      this.Message = 'problemi su evenemitter utente loggato -- user.id ' + user.id + ' idevent ' + idevent;
      this.showNotification(this.type, this.Message);
      this.isVisible = true;
      this.alertSuccess = false;
    }


}






async eseguilogin(form: NgForm) {







/*   da provare


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
     }
   ));

*/



  }


/* Metodo originale che va in errore con la promise


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
     }
   ));
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


  /*  con gestione subscribe  - in auth.service faccio solo la lettura  semplice  */
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

/*


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

// ---------------------------------------------    this.eseguilogin(form);    // metodo subscribe
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




}

