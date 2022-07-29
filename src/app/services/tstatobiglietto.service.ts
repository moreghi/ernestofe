import { Injectable } from '@angular/core';
import { Tstatobiglietto } from '../classes/T_stato_biglietto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TstatobigliettoService {

  private rotta = "/tstatobiglietto";
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

  delete(statobiglietto: Tstatobiglietto) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + statobiglietto.id,  {
            headers: this.getAuthHeader()
          });
        }

  update(statobiglietto: Tstatobiglietto) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + statobiglietto.id, statobiglietto,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

  create(statobiglietto: Tstatobiglietto){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, statobiglietto,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

}

