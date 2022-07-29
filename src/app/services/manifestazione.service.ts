import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manifestazione } from '../classes/Manifestazione';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';    // per gestire i grafici

@Injectable({
  providedIn: 'root'
})
export class ManifestazioneService {

  manif: Manifestazione;

  private rotta = "/manif";
  private rottaSearch = '/manife';   // per ricerche con chiavi diverse da id

  private rottaLast = "/manifestazione";
  private rootManiflastid  = "/lastid";
  private rootRicercaStato  = "/getbyStato/";
  private rootActive  = "/getManifestazioneActive";
  private rottafunction = '';

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

private APIURLLAST = environment.APIURL + this.rottaLast;

private APIURLSEARCH = '';

  constructor(private http: HttpClient, private auth: AuthService) { }


// attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato
// metodo per concatenare il token nei metodi di chiamata al server
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

      delete(manif: Manifestazione) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + manif.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(manif: Manifestazione) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + manif.id, manif,  {
          headers: this.getAuthHeader()
        });
      }


       create(manif: Manifestazione){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, manif,  {
          headers: this.getAuthHeader()
        });
      }

      getLastManifestazioneid() {
        this.rottafunction = '/manifestazione/lastid';
        return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
          headers: this.getAuthHeader()
        });      // ok;

      }

      getManifbyStato(stato: number) {

        this.rottafunction = '/getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;

    }

    /*
      getManifActive() {

          this.APIURLSEARCH = environment.APIURL + this.rottaSearch + this.rootActive;

          return this.http.get(this.APIURLSEARCH,  {
            headers: this.getAuthHeader()
          });      // ok;
      }
      */

      getManifAttiva(stato: number) {

        this.rottafunction = 'getActive/active';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;

    }




     getrilascio(id: number) {
        this.rottafunction = '/getrilascio';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id,  {
                headers: this.getAuthHeader()
              });      // ok;
     }

}
