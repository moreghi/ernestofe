import { Injectable } from '@angular/core';
import { Ttipobiglietto } from '../classes/T_tipo_biglietto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TtipobigliettoService {

  private rotta = "/ttipobiglietto";
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

  delete(tipobiglietto: Ttipobiglietto) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + tipobiglietto.id,  {
            headers: this.getAuthHeader()
          });
        }

  update(tipobiglietto: Ttipobiglietto) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + tipobiglietto.id, tipobiglietto,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

  create(tipobiglietto: Ttipobiglietto){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, tipobiglietto,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

  getbyevento(id: number) {
          this.rottafunction = 'getbyevento';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
            headers: this.getAuthHeader()
          });
        }
  getbytaglia(id: number, idtaglia: number) {
          this.rottafunction = 'getbytaglia';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idtaglia , {
            headers: this.getAuthHeader()
          });
        }






}


