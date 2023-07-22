import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogPosto } from '../classes/Logposto';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LogpostoService {

  private rotta = "/logposto";
  private rottafunction = '';

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient, private auth: AuthService) { }


  getAuthHeader(): HttpHeaders {
    const headers = new HttpHeaders(
      {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    );
    return headers;
  }

  getAll(idlog: number) {
    return this.http.get(this.APIURL + '/' + idlog,  {
           headers: this.getAuthHeader()
         });
  }

  getbyId(id: number) {
     this.rottafunction = 'getbyid';
     return this.http.get(this.APIURL + '/' + this.rottafunction  + '/'  + id, {
      headers: this.getAuthHeader()
    });
  }

  delete(logposto: LogPosto) {
    this.rottafunction = 'deletebyid';
    return this.http.delete(this.APIURL + '/' + this.rottafunction   + '/' + logposto.id,  {
      headers: this.getAuthHeader()
    });

  }

  update(logposto: LogPosto) {
    this.rottafunction = 'updatebyid';
    return this.http.put(this.APIURL + '/' + this.rottafunction + '/'  + logposto.id, logposto,  {
      headers: this.getAuthHeader()
    });
  }


   create(logposto: LogPosto){
    this.rottafunction = 'create';
    return this.http.post(this.APIURL + '/' + this.rottafunction , logposto,  {
      headers: this.getAuthHeader()
    });
  }


  getbyStato(idlog: number, idsett: number, idfila: number, stato: number) {

    this.rottafunction = 'getbyStato';
    return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett + '/' + idfila + '/' + stato,  {
            headers: this.getAuthHeader()
          });      // ok;
    }

  getPosto(idlog: number, idsett: number, idfila: number, idposto: number) {

      this.rottafunction = 'getPosto';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett + '/' + idfila + '/' + idposto,  {
              headers: this.getAuthHeader()
            });      // ok;
      }

}



