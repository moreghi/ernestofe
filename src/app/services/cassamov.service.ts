import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cassamov } from '../classes/Cassamov';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CassamovService {

  private rotta = "/cassamov";
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


        delete(cassamov: Cassamov) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + cassamov.id,  {
            headers: this.getAuthHeader()
          });

        }


        update(cassamov: Cassamov) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + cassamov.id, cassamov,  {
            headers: this.getAuthHeader()
          });

        }


         create(cassamov: Cassamov){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, cassamov,  {
            headers: this.getAuthHeader()
          });
        }


        getAllbyCassa(id: number) {
          this.rottafunction = 'cassa/All';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
            headers: this.getAuthHeader()
          });
        }

        getAllbyEvento(id: number) {
          this.rottafunction = 'cassa/All/Evento';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
            headers: this.getAuthHeader()
          });
        }

}



