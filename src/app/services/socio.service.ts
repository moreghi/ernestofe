/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocioService {

  constructor() { }
}
*/


import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socio } from '../classes/Socio';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';    // per gestire i grafici
// import { stringify } from 'querystring';



@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private rotta = "/socio";
  private rottaSearch = '/socioe';   // per ricerche con chiavi diverse da id


  private rootRicercaStato  = "/getbyStato/";

  private rottafunction = '';

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server


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

      getsoci() {
               return this.http.get(this.APIURL,  {
               headers: this.getAuthHeader()
             });      // ok
        }

        getSocio(id: number) {
          return this.http.get(this.APIURL + '/' + id, {
            headers: this.getAuthHeader()
          });
        }


        deleteSocio(socio: Socio) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + socio.id,  {
            headers: this.getAuthHeader()
          });

        }


        updateSocio(socio: Socio) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + socio.id, socio,  {
            headers: this.getAuthHeader()
          });

        }


         createSocio(socio: Socio){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, socio,  {
            headers: this.getAuthHeader()
          });
        }

        getLastSocioid() {
          this.rottafunction = 'Socio/lastid';
          return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
            headers: this.getAuthHeader()
          });      // ok;
        }

        getsociobyCognomeNomeCell(cognome: string, nome: string, cell: string) {
            this.rottafunction = 'cognNomeCellulare';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + cognome + '/' + nome + '/' + cell);      // ok;
        }


        getsociobyFilter(strsql: string) {
          this.rottafunction = 'filterSearch/strsql';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + strsql);      // ok;
      }




        /*   da sistemare
        getsociobyStato(stato: number) {
              this.APIURLSEARCH = environment.APIURL + this.rotta + this.rootRicercaStato;

              return this.http.get(this.APIURLSEARCH + stato,  {
                  headers: this.getAuthHeader()
                });      // ok;

      }

 */

}

