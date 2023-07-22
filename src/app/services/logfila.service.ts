import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogFila } from '../classes/Logfila';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogfilaService {

  private rotta = "/logfila";
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


      getAll(idlog: number, idsett: number) {
        this.rottafunction = 'fila';
        return this.http.get(this.APIURL  + '/' + idlog  + '/' + idsett + '/' + this.rottafunction, {
               headers: this.getAuthHeader()
             });
      }

      getbyId(id: number) {
        return this.http.get(this.APIURL + '/'  + id, {
          headers: this.getAuthHeader()
        });
      }

      delete(logfila: LogFila) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction   + '/' + logfila.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(logfila: LogFila) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction  + logfila.id, logfila,  {
          headers: this.getAuthHeader()
        });
      }


       create(logfila: LogFila){
        this.rottafunction = 'create';
        console.log('logfilaService ----  create ' + JSON.stringify(logfila));
        return this.http.post(this.APIURL + '/' + this.rottafunction , logfila,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(idlog: number, idsett: number, stato: number) {

        this.rottafunction = 'getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;
    }


    getbyFila(idlog: number, fila: number) {

      this.rottafunction = 'getbyFila';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + fila,  {
              headers: this.getAuthHeader()
            });      // ok;
  }

  getlast() {
    this.rottafunction = 'lastid/last';
    return this.http.get(this.APIURL + '/' + this.rottafunction, {
      headers: this.getAuthHeader()
    });
  }

  getbylogistica(idlog: number, stato: number) {

    this.rottafunction = 'getbylogistica';
    return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog + '/' + stato,  {
            headers: this.getAuthHeader()
          });      // ok;
}

getbylogisticaeSettore(idLogistica: number, idSettore: number) {

  this.rottafunction = '/getbylogistica/Settore';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idLogistica + '/' + idSettore,  {
          headers: this.getAuthHeader()
        });      // ok;

}


}

