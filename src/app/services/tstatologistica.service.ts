import { Injectable } from '@angular/core';
import { TstatoLogistica } from '../classes/T_stato_logistica';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TstatologisticaService {

  private rotta = "/tstatologistica";
  private rottafunction = '';

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient,
              private auth: AuthService) { }

 // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato


 getAuthHeader(): HttpHeaders   {
   // passo il token dentro a header per non farlo passare in chiaro su url

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

  getbyid(id: number) {
    return this.http.get(this.APIURL + '/' + id,  {
      headers: this.getAuthHeader()
    });
  }

  delete(statologistica: TstatoLogistica) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + statologistica.id,  {
            headers: this.getAuthHeader()
          });
        }

  update(statologistica: TstatoLogistica) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + statologistica.id, statologistica,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

  create(statologistica: TstatoLogistica){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, statologistica,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }
}


