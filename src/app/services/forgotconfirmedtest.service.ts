import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForgotPassword } from '../classes/Forgot-password';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotconfirmedtestService {

  private rotta = '/forgottest';

  constructor(private http: HttpClient) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  forgotconf: ForgotPassword;
  // lettura tutti gli utenti

  getAll():Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // inserimento nuovo utente
  createNew(data:any):Observable<any> {
    console.log(data,'forgotconfirmedService - CreateNew');
    return this.http.post(`${this.apiUrl}`, data);
  }

  // cancellazione utente
  delete(email:any):Observable<any>  {
    console.log('cancellazione richiesta reset: ' + email);
    return this.http.delete(`${this.apiUrl}/${email}`);
  }


  update(data:any,email:any):Observable<any> {
    console.log(`aggiornamento richiesta ripristino ${email} `);
    return this.http.put(`${this.apiUrl}/${email}`, data);
  }

 // Visualizzazione singolo utente
 getby(email:any):Observable<any>  {
  console.log('ForgotconfirmedService ------ lettura singola richiesta: ' + email);

  return this.http.get(`${this.apiUrl}/${email}`);

 }
//  spostato da authservice
forgotPwd(email: string) {
  return this.http.post(this.apiUrl + '/forgotpwd', { email });
}

// non funziona - togliere
confresetPasswordtest(email: string, newpassword: string) {

  const test = this.apiUrl + '/confpwdtest';

  console.log(`forgotServicetest - confresetPassword - parametri ${email} ' ' ${newpassword} url: ${test}`);



  return this.http.post(this.apiUrl + '/confpwdtest', { email, newpassword });
}


resetpassword(email: string, password: string) {

  const test = this.apiUrl + '/resetpassword';
  const test1 = `${this.apiUrl}/resetpassword`;
  console.log(`forgotServicetest - resetpassword - parametri ${email} ' ' ${password} url: ${test} url1: ${test1}`);

// this.apiUrl + "/resetpassword"

  return this.http.post(`${this.apiUrl}/resetpassword`, { email, password });
}

}
