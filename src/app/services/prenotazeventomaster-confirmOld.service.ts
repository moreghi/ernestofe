import { Injectable } from '@angular/core';
import { PrenotazeventomasterConfirmOld } from '../classes/PrenotazeventomasterConfirmOld';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrenotazeventomasterConfirmOldService {
  private rotta = '/prenotazeventomasterConfirmOld';
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

    getAll() {

         return this.http.get(this.APIURL);
    }      // ok      // ok

        getbyId(id: number) {
          return this.http.get(this.APIURL + '/' + id);      // ok
        }

        delete(prenotazevento: PrenotazeventomasterConfirmOld) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazevento.id);      // ok

        }

    update(prenotazevento: PrenotazeventomasterConfirmOld) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazevento.id, prenotazevento);      // ok

    }

     create(prenotazevento: PrenotazeventomasterConfirmOld){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazevento);      // ok
    }


    getPrenotazinbycodpren(codpren: string) {

      this.rottafunction = 'getPrenotazbycodpren/codpren';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  codpren);      // ok      // ok
    }

    deletePreConfirmbycodpren(codpren: string) {
      this.rottafunction = 'destroycodpren';
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/'  + codpren);
    }

    deletePreConfirmbytoken(token: string) {
      this.rottafunction = 'destroytoken';
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/'  + token);
    }



}
