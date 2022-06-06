import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { JwtInterface } from '../../../interfaces/jwt';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-password-new-user',
  templateUrl: './change-password-new-user.component.html',
  styleUrls: ['./change-password-new-user.component.css']
})
export class ChangePasswordNewUserComponent implements OnInit {

  constructor(private auth: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {
  }



  onSubmit(form: NgForm) {

  }


}
