import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Userlevel } from '../classes/UserLevel';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserlevelService {

  private rotta = '/userlevel';

  private rottafunction = '';

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  userlevel: Userlevel;
  // lettura tutti gli utenti

 // non so dove usarlo nelle chiamate http
 getAuthHeader(): HttpHeaders {
  const headers = new HttpHeaders(
    {
      Authorization : 'Bearer ' + this.auth.getToken()
    }
  );
  return headers;
}


  getAlls():Observable<any> {

    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeader()
    });
  }


  // inserimento nuovo profilo
   createNew(data:any):Observable<any>{
    this.rottafunction = 'create';
    return this.http.post(this.apiUrl + '/' + this.rottafunction, data, {
      headers: this.getAuthHeader()
    });
  }


 // cancellazione profilo
 delete(id:any):Observable<any>  {
  this.rottafunction = "deletebyid";
//  console.log('cancellazione Utente: ' + id);
  return this.http.delete(this.apiUrl + '/' + this.rottafunction + '/' + id, {
    headers: this.getAuthHeader()
  });
}


updateUser(data:any,id:any):Observable<any> {
  this.rottafunction = "updatebyid";
  console.log(`aggiornamento utente ${id} `);
  return this.http.put(this.apiUrl + '/' + this.rottafunction + '/' + data.id, data, {
  headers: this.getAuthHeader()
  });
}

  getbyId(id: number):Observable<any>  {
    console.log('userService ------ lettura singolo Utente: ' + id);

    return this.http.get(this.apiUrl + '/' + id, {
      headers: this.getAuthHeader()
    });

  }


}
