import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registerconfirmed } from '../classes/Register_confirmed';    // ../../../classes/user
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterconfirmedService {

  private rotta = '/regconf';
  private rottafunction = '';

  constructor(private http: HttpClient) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIAUTURL + this.rotta;

  regconf: Registerconfirmed;
  // lettura tutti gli utenti

  getAll():Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // inserimento nuovo utente
  createNew(data:any):Observable<any> {
    console.log(data,'RegisterconfirmedService - CreateNew');
    return this.http.post(`${this.apiUrl}`, data);
  }

  // cancellazione utente
  delete(email:any):Observable<any>  {
    console.log('cancellazione Utente: ' + email);
    return this.http.delete(`${this.apiUrl}/${email}`);
  }


  update(data:any,email:any):Observable<any> {
    console.log(`aggiornamento utente ${email} `);
    return this.http.put(`${this.apiUrl}/${email}`, data);
  }

 // Visualizzazione singolo utente
 getby(email:any):Observable<any>  {
  console.log('RegisterconfirmedService ------ lettura singola conferma: ' + email);

  return this.http.get(`${this.apiUrl}/${email}`);

 }

 // lettura per token

 getRegConfirmbyToken(token:any):Observable<any> {
  console.log('RegisterconfirmedService ------ lettura per token: ' + token);
  console.log(`RegisterconfirmedService -- token ---- url lettura: ${this.apiUrl}/${token}`);
  return this.http.get(`${this.apiUrl}/${token}`);

 }


 getPreConfirmbyEmail(email: string) {
  this.rottafunction = "/getbyemail";
  return this.http.get(this.apiUrl + this.rottafunction + '/' + email  );

}


}
