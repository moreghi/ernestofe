import { Injectable } from '@angular/core';
import { Tstatotagliabiglietto } from '../classes/T_stato_taglia_biglietto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TstatotagliabigliettoService {

  private rotta = "/tstatotagliabiglietto";
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

  delete(statotaglia: Tstatotagliabiglietto) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + statotaglia.id,  {
            headers: this.getAuthHeader()
          });
        }

  update(statotaglia: Tstatotagliabiglietto) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + statotaglia.id, statotaglia,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

  create(statotaglia: Tstatotagliabiglietto){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, statotaglia,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

}


