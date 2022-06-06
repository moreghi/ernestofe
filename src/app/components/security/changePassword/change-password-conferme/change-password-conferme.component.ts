import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../classes/User';
import { ChangePassword } from '../../../../classes/Change-password';
// service
import { ChangepassService } from '../../../../services/changepass.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { NotifierService } from 'angular-notifier';



@Component({
  selector: 'app-change-password-conferme',
  templateUrl: './change-password-conferme.component.html',
  styleUrls: ['./change-password-conferme.component.css']
})
export class ChangePasswordConfermeComponent implements OnInit {

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

  // campi utilizzati per gestire controllo su campi conferma

  public email = '';
  public password_richiesta = '';


  public user: User;
  public chgpwd: ChangePassword;
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
              private changepassService: ChangepassService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.resetEmail = params['email']
                            });
}

  ngOnInit(): void {


    this.chgpwd  = new ChangePassword();
    this.email = this.form.resetEmail;
    console.log('OnInit - email: ' + this.email);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.changepassService.getby(this.email).subscribe(
    resp => {
      console.log(`letto chagepwd ${resp['data']}`);
      this.chgpwd = resp['data'];
      this.form.cognome = this.chgpwd.cognome;
      this.form.nome = this.chgpwd.nome;
      this.form.username = this.chgpwd.username;
      this.form.email = '';
      this.form.password = '';
      this.form.newpassword = '';
      this.form.confirmPassword = '';
      },
      error => {
            console.log('error in lettura chgpwd : ' + error.message);
          }
      );


  }


  onSubmit(form: NgForm)  {
    // da fare tutto

    alert('pronto per effettuare il cambio password - scrivere il codice');
    console.log(`email: ${form.value.email}`);
    console.log(`vecchia password: ${form.value.password}`);
    console.log(`nuova password: ${form.value.newpassword}`);
    console.log(`conferma nuova password: ${form.value.confirmPassword}`);

    console.log('controlli sui campi inseriti  ');
    // eseguo controllo sui campi inseriti
    if(form.value.email !== this.email) {
      this.Message = 'email di conferma non corrisponde a quella di richiesta - ripristino non consentito';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }

    if(form.value.password === form.value.newpassword) {
      this.Message = 'la nuova password deve essere diversa dalla password attuale - ripristino non consentito';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }
    if(form.value.newpassword !== form.value.confirmPassword) {
      this.Message = 'la password di conferma non coincide con la nuova password - ripristino non consentito';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }



    // verificate le credenziali per richiesta nuovo utente

    console.log('ok changepasswordConfirm ' + form.value.email + ' ' + form.value.newpassword + ' dati passati a backend ' );





    /////////   const resp = await this.forgotconfirmedService.resetpassword(form.value.email, this.newpassword);
    this.auth.confchangePassword(form.value.email, form.value.newpassword).subscribe(
    resp => {
        console.log('cambiata la password ');
        this.Message = 'password utente Cambiata con successo';
        this.isVisible = true;
        this.alertSuccess = true;

        this.type = 'success';
        this.showNotification(this.type, this.Message);
       },
       err => {
         this.type = 'error';
         this.Message = err.error.message;
         this.showNotification(this.type, this.Message);
         this.alertSuccess = false;
       }
     );

  }


  showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }




}
