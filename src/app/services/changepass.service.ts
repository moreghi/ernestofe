import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePassword } from '../classes/Change-password';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangepassService {

 private rotta = '/changepassword';

  constructor(private http: HttpClient) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  changePassword: ChangePassword;
  // lettura tutti gli utenti

  getAll():Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // inserimento nuovo utente
  createNew(data:any):Observable<any> {
    console.log(data,'changepasswordService - CreateNew');
    return this.http.post(`${this.apiUrl}`, data);
  }

  // cancellazione utente
  delete(email:any):Observable<any>  {
    console.log('cancellazione richiesta reset: ' + email);
    return this.http.delete(`${this.apiUrl}/${email}`);
  }


  update(data:any,email:any):Observable<any> {
    console.log(`aggiornamento richiesta change password ${email} `);
    return this.http.put(`${this.apiUrl}/${email}`, data);
  }

 // Visualizzazione singolo utente
 getby(email:any):Observable<any>  {
  console.log('ChangepasswordService ------ lettura singola richiesta: ' + email);

  return this.http.get(`${this.apiUrl}/${email}`);

 }
//  spostato da authservice
 changePwd(email: string) {

  const testUrl = `'url ' ${this.apiUrl} '/changepwd'`;

  console.log(`ChangepasswordService ------ richiesta Cambio Password: ${testUrl} con email: ` + email);

  return this.http.post(this.apiUrl + "/changepwd", { email });
}


/*
// non funziona - togliere
confresetPassword(email: string, newpassword: string) {

  const test = this.apiUrl + "/confresetuserpwd";

  console.log(`forgotService - confresetPassword - parametri ${email} ' ' ${newpassword} url: ${test}`);



  return this.http.post(this.apiUrl + "/confresetuserpwd", { email, newpassword });
}
*/


changepassword(email: string, password: string) {

  const test = this.apiUrl + "/changepassword";
  const test1 = `${this.apiUrl}/changepassword`;
  console.log(`changepasswordService - changepassword - parametri ${email} ' ' ${password} url: ${test} url1: ${test1}`);

// this.apiUrl + "/resetpassword"

  return this.http.post(`${this.apiUrl}/changepassword`, { email, password });
}




}
