import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Biglietto } from '../classes/Biglietto';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BigliettoService {

  private rotta = "/biglietto";
  private rottafunction = '';

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

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
             });      // ok
        }

        getbyId(id: number) {
          return this.http.get(this.APIURL + '/' + id, {
            headers: this.getAuthHeader()
          });
        }


        delete(biglietto: Biglietto) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + biglietto.id,  {
            headers: this.getAuthHeader()
          });

        }


        update(biglietto: Biglietto) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + biglietto.id, biglietto,  {
            headers: this.getAuthHeader()
          });

        }


         create(biglietto: Biglietto){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, biglietto,  {
            headers: this.getAuthHeader()
          });
        }

        getlastId() {
          this.rottafunction = 'last/lastid';
          return this.http.get(this.APIURL + '/' + this.rottafunction , {
            headers: this.getAuthHeader()
          });
        }


}

