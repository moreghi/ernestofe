import { Injectable } from '@angular/core';
import { W_Prenotazevento } from '../classes/W_Prenotazevento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class W_PrenotazeventoService {

  private rotta = '/wprenotazevento';
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

    getPrenotazioni() {

         return this.http.get(this.APIURL);
    }



        getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id);      // ok
        }


        getbytoken(token: string) {
          this.rottafunction = 'getby/token';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token);      // ok
        }



        delete(prenotazevento: W_Prenotazevento) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazevento.id);      // ok

        }



    update(prenotazevento: W_Prenotazevento) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazevento.id, prenotazevento);      // ok

    }


     create(prenotazevento: W_Prenotazevento){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazevento);      // ok
    }

    getLast() {

      this.rottafunction = '/getLast/Last';
      return this.http.get(this.APIURL + '/' + this.rottafunction);      // ok;

    }

    getAllbytoken(token: string) {
      this.rottafunction = 'getAllby/tok';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token);      // ok
    }


}

