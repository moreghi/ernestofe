import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logistica } from '../classes/Logistica';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {

  private rotta = "/logistica";
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

      getAll() {
        return this.http.get(this.APIURL,  {
               headers: this.getAuthHeader()
             });
      }

      getbyId(id: number) {
        return this.http.get(this.APIURL + '/' + id, {
          headers: this.getAuthHeader()
        });
      }

      delete(logistica: Logistica) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + logistica.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(logistica: Logistica) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + logistica.id, logistica,  {
          headers: this.getAuthHeader()
        });
      }


       create(logistica: Logistica){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, logistica,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(stato: number) {

        this.rottafunction = '/getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;

    }

    getAllActive() {

      this.rottafunction = '/getbyActive/Act';
      return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
              headers: this.getAuthHeader()
            });      // ok;

  }




}

