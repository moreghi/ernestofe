import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../classes/User';
import { ForgotPassword } from '../../../../classes/Forgot-password';

// service
import { ForgotconfirmedService } from '../../../../services/forgotconfirmed.service';
import { ForgotconfirmedtestService } from '../../../../services/forgotconfirmedtest.service';      // test
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { NotifierService } from 'angular-notifier';



@Component({
  selector: 'app-forgot-password-conferme',
  templateUrl: './forgot-password-conferme.component.html',
  styleUrls: ['./forgot-password-conferme.component.css']
})
export class ForgotPasswordConfermeComponent implements OnInit {

  public form = {
    resetEmail: null,
    cognome: null,
    nome: null,
    username: null,
    email: null,
    password: '',
    newpassword: '',
    confirmPassword: ''
  };

  public error = null;

  public user: User;
  public forg: ForgotPassword;
  public email = '';
  public newpassword = 'provvisoria';
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
              private forgotconfirmedService: ForgotconfirmedService,
              private testService: ForgotconfirmedtestService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.resetEmail = params['email']
                            });
    }

  ngOnInit(): void {

    this.forg  = new ForgotPassword();

    this.email = this.form.resetEmail;
    console.log('OnInit - email: ' + this.email);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.forgotconfirmedService.getby(this.email).subscribe(
    resp => {
      console.log(`letto forgot ${resp['data']}`);
      this.forg = resp['data'];
      this.form.cognome = this.forg.cognome;
      this.form.nome = this.forg.nome;
      this.form.username = this.forg.username;
      this.form.email = '';
      this.form.newpassword = this.newpassword;
      },
      error => {
            console.log('error in lettura forgott : ' + error.message);
          }
      );

  }

 async onSubmit(form: NgForm) {
   // alert('sono in submit');
    console.log('sono in submit ---------  email --  ' + form.value.email);
    // eseguo controllo sui campi inseriti
    if(form.value.email !== this.email) {
      this.Message = 'email di conferma non corrisponde a quella di richiesta - ripristino non consentito';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }

    // verificate le credenziali per richiesta nuovo utente

    console.log('ok forgotpasswordConfirm ' + form.value.email + ' ' + this.newpassword + ' dati passati a backend ' );


    const resp = await this.testService.resetpassword(form.value.email, this.newpassword);
/*
    this.user = new User();
    this.user.email = form.value.email;
    this.user.password = form.value.newpassword;   */

    /////////   const resp = await this.forgotconfirmedService.resetpassword(form.value.email, this.newpassword);
   // const resp = await this.auth.confresetPassword(form.value.email, this.newpassword);  // non funziona
  //  const resp = await this.forgotconfirmedService.confresetPassword(form.value.email, this.newpassword);
    if (resp) {
        console.log('Ripristinata password iniziale ');
        this.Message = 'password utente ' + this.forg.cognome + ' ' + this.forg.nome + ' Ripristinata con successo';
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
