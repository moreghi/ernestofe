import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cassa } from '../classes/Cassa';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CassaService {

  private rotta = "/cassa";
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


        delete(cassa: Cassa) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + cassa.id,  {
            headers: this.getAuthHeader()
          });

        }


        update(cassa: Cassa) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + cassa.id, cassa,  {
            headers: this.getAuthHeader()
          });

        }


         create(cassa: Cassa){
          console.log('frontend ------------------------  cassaService: ' + JSON.stringify(cassa));
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, cassa,  {
            headers: this.getAuthHeader()
          });
        }

        getbydata(datacassa: string, idEvento: number) {
          this.rottafunction = 'getbycassa/cassa';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + datacassa+ '/' + idEvento,  {
            headers: this.getAuthHeader()
          });

        }

        getlastdata(idEvento: number) {
          this.rottafunction = 'getbycassa/lastdata';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idEvento,  {
            headers: this.getAuthHeader()
          });

        }


        getAllDaybyEvento(id: number) {
          this.rottafunction = 'day/All/Evento';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
            headers: this.getAuthHeader()
          });
        }

}

