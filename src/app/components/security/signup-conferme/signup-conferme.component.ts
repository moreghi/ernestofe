import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../classes/User';
import { Registerconfirmed } from '../../../classes/Register_confirmed';

// service
import { RegisterconfirmedService } from '../../../services/registerconfirmed.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-signup-conferme',
  templateUrl: './signup-conferme.component.html',
  styleUrls: ['./signup-conferme.component.css']
})
export class SignupConfermeComponent implements OnInit {

  public form = {
    resetToken: null,
    cognome: null,
    nome: null,
    username: null,
    email: null,
    password: ''
  };

  public error = null;

  // campi utilizzati per gestire controllo su campi conferma

  public email_richiesta = '';
  public password_richiesta = '';


  public user: User;
  public reg: Registerconfirmed;
  public token = '';

  // icone
  faTrash = faTrash;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';


  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private userService: UserService,
              private registerconfirmedService: RegisterconfirmedService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.resetToken = params['token']
                            });
    }

  ngOnInit(): void {

    this.reg  = new Registerconfirmed();
    this.reg.cognome = 'pincopallo';
    this.token = this.form.resetToken;
    console.log('OnInit - token: ' + this.token);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.registerconfirmedService.getRegConfirmbyToken(this.token).subscribe(
    resp => {
      this.reg = resp['data'];
      this.form.cognome = this.reg.cognome;
      this.form.nome = this.reg.nome;
      this.form.username = this.reg.username;
      this.form.email = '';
      // salvo i rimanenti campi per gestire la verifica
      this.email_richiesta = this.reg.email;
      this.password_richiesta = this.reg.password;
      },
      error => {
            console.log('error in lettura user: ' + error.message);
          }
      );

  }

 async onSubmit(form: NgForm) {
    alert('sono in submit');
    console.log('sono in submit ---------  username --  ' + form.value.username);
    // eseguo controllo sui campi inseriti
    if(form.value.email !== this.email_richiesta) {
      this.Message = 'email di conferma non corrisponde a quella di richiesta - conferma non consentita';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }
    if(form.value.password !== this.password_richiesta) {
      this.Message = 'password di conferma non corrisponde a quella di richiesta - conferma non consentita';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }
    // verificate le credenziali per richiesta nuovo utente

    console.log('ok signup ' + this.reg.cognome + ' ' + this.reg.nome + ' sltri ' );

    const resp = await this.auth.signUp(this.reg.cognome, this.reg.nome, this.reg.username, this.reg.email, this.reg.password);
    if (resp) {
        console.log('creato utente ');
        this.Message = 'utente ' + this.reg.cognome + ' ' + this.reg.nome + ' Registrato con successo';
        this.isVisible = true;
        this.alertSuccess = true;

        this.type = 'success';
        this.showNotification(this.type, this.Message);
       }

}

handleError(error) {
  this.error = error.error.errors;
}


showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}



}
