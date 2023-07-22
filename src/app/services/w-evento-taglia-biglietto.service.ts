import { Injectable } from '@angular/core';
import { WEventoTagliaBiglietto } from '../classes/W_evento_taglia_biglietto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WEventoTagliaBigliettoService {

  private rotta = '/weventotagliabiglietto';
  private rottafunction = '';

  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLSEARCH = '';

     constructor(private http: HttpClient, private auth: AuthService) { }


  // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato


  /*   inibisco la gestione token.  -- le conferme sono fatte da utenti non registrati

  getAuthHeader(): HttpHeaders   {
    // passo il token dentro a header per non farlo passare in chiaro su url
    const headers = new HttpHeaders(
        {
          authorization: 'Bearer ' + this.auth.getToken()
        }
      );
      return headers;
      }
*/

    getAll(id: number, stato: number) {
        this.rottafunction = 'getAll';
         return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + stato);
    }

    getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id);      // ok
        }

    delete(wEventoTagliaBiglietto: WEventoTagliaBiglietto) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + wEventoTagliaBiglietto.id);      // ok

        }

    update(wEventoTagliaBiglietto: WEventoTagliaBiglietto) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  wEventoTagliaBiglietto.id, wEventoTagliaBiglietto);      // ok

    }

    create(wEventoTagliaBiglietto: WEventoTagliaBiglietto){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, wEventoTagliaBiglietto);      // ok
    }

    deleteAll(idEvento: number) {
      this.rottafunction = 'deleteAll';
       return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + idEvento);
  }

  getbyideStato(id: number, stato: number) {
    this.rottafunction = 'getbyideStato';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + stato);
  }

  getAllPren(id: number, stato: number) {
    this.rottafunction = 'getAllPren';
     return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + stato);
}

getbyflagPU(id: number) {

  this.rottafunction = 'getbyflag/PU';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id);
}




}
