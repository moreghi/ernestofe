import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quotatessera } from '../classes/Quotatessera';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class QuotatesseraService {

  private rotta = "/quotatessera";
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
         });      // ok
    }

    getbyId(id: number) {
      return this.http.get(this.APIURL + '/' + id, {
        headers: this.getAuthHeader()
      });
    }


    delete(quotatessera: Quotatessera) {
      this.rottafunction = 'deletebyid';
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + quotatessera.id,  {
        headers: this.getAuthHeader()
      });

    }


    update(quotatessera: Quotatessera) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + quotatessera.id, quotatessera,  {
        headers: this.getAuthHeader()
      });

    }


     create(quotatessera: Quotatessera){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, quotatessera,  {
        headers: this.getAuthHeader()
      });
    }

    getbyanno(id: number, anno: number) {
      this.rottafunction = 'anno';
      return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id + '/' + anno,  {
        headers: this.getAuthHeader()
      });
    }


}



