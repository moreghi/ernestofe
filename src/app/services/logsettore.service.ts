import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogSettore } from '../classes/Logsettore';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogsettoreService {

  private rotta = "/logsettore";
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
        this.rottafunction = 'settore';
        return this.http.get(this.APIURL  + '/' + idlog + '/' + this.rottafunction,  {
               headers: this.getAuthHeader()
             });
      }

      getbyId(id: number) {
        return this.http.get(this.APIURL +  '/' + id, {
          headers: this.getAuthHeader()
        });
      }

      delete(logsettore: LogSettore) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction  +  '/' + logsettore.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(logsettore: LogSettore) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction +  '/' + logsettore.id, logsettore,  {
          headers: this.getAuthHeader()
        });
      }


       create(logsettore: LogSettore){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, logsettore,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(idlog: number, stato: number) {

        this.rottafunction = '/getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;
    }

    getbySettore(idlog: number, settore: number) {

      this.rottafunction = '/getbySettore';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + settore,  {
              headers: this.getAuthHeader()
            });      // ok;
  }
   getbySettoreActive(idlog: number, stato: number) {

    this.rottafunction = '/getbySettoreAct';
    return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + stato,  {
            headers: this.getAuthHeader()
          });      // ok;
}
}

