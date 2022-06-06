import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ForgotconfirmedService } from '../../../../services/forgotconfirmed.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public error = '';
  public form = {
    email: null,
   };

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';

  isLoggedIn = false;

  constructor(private auth: AuthService,
              private forgotconfirmedService: ForgotconfirmedService,
              private router: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }

ngOnInit(): void {

}

onSubmit(form: NgForm): void {       // funziona alla perfezione
  if (!form.valid) {
    // alert('form Invalido - Login non verificabile');
    this.type = 'error';
    this.Message = 'form Invalido - Login non verificabile ';
    this.showNotification(this.type, this.Message);
    return;
}

 // const { username, password } = this.form;
  this.isVisible = true;
  //  this.auth.forgotPassword(form.value.email).subscribe(
  this.forgotconfirmedService.forgotPwd(form.value.email).subscribe(
    data => {
      this.type = 'success';
      this.Message = 'richiesta di reset password inviata correttamente';
      this.showNotification(this.type, this.Message);
    //  this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.alertSuccess = true;
    },
    err => {
      this.type = 'error';
      this.Message = err.error.message;
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
    }
  );
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







