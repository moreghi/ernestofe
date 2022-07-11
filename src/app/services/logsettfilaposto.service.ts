import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogSettFilaPosti } from '../classes/Logsettfilaposti';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogsettfilapostoService {

  private rotta = "/logfilaposti";
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
        return this.http.get(this.APIURL + '/' + idlog ,  {
               headers: this.getAuthHeader()
             });
      }

      getbyId(id: number) {
        return this.http.get(this.APIURL + '/'  + id, {
          headers: this.getAuthHeader()
        });
      }

      delete(logsettfila: LogSettFilaPosti) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction  + '/' + logsettfila.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(logsettfila: LogSettFilaPosti) {
        this.rottafunction = 'updatebyid';
        console.log('----- service ---------------------> logsettFilaPosti --- update: ' + JSON.stringify(logsettfila));
        return this.http.put(this.APIURL + '/' + this.rottafunction +  '/'  + logsettfila.id, logsettfila,  {
          headers: this.getAuthHeader()
        });
      }


       create(logsettfila: LogSettFilaPosti){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction , logsettfila,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(idlog: number, idsett: number, stato: number) {

        this.rottafunction = '/getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;
    }

     getbySettFila(idlog: number, idsett: number, idfila: number) {

      this.rottafunction = '/getbySettFila';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett + '/' + idfila,  {
              headers: this.getAuthHeader()
            });      // ok;
  }

    getbySett(idlog: number, idsett: number) {

      this.rottafunction = '/getbySett';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idlog  + '/' + idsett ,  {
              headers: this.getAuthHeader()
            });      // ok;
  }



}








