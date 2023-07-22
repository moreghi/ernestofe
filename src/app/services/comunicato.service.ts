import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comunicato } from '../classes/Comunicato';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ComunicatoService {

  private rotta = "/comunicato";
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


        delete(comunicato: Comunicato) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + comunicato.id,  {
            headers: this.getAuthHeader()
          });

        }


        update(comunicato: Comunicato) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + comunicato.id, comunicato,  {
            headers: this.getAuthHeader()
          });

        }


         create(comunicato: Comunicato){

          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, comunicato,  {
            headers: this.getAuthHeader()
          });
        }

        // lettura per data inizio
        getbydata(datacom: string) {
          this.rottafunction = 'getby/datain';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + datacom,  {
            headers: this.getAuthHeader()
          });

        }

        getbyStato(stato: number) {

          this.rottafunction = '/getbyStato';
          return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + stato,  {
                  headers: this.getAuthHeader()
                });      // ok;

      }

}

