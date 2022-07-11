import { Injectable } from '@angular/core';
import { TstatoManifestazione } from '../classes/T_stato_manifestazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TstatomanifestazioneService {


  private rotta = '/tstatomanifestazione';
  private rottafunction = '';

  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

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
        });      // ok      // ok      // ok
      }

        getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

        delete(statomanifestazione: TstatoManifestazione) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + statomanifestazione.id,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

    update(statomanifestazione: TstatoManifestazione) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + statomanifestazione.id, statomanifestazione,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

     create(statomanifestazione: TstatoManifestazione){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, statomanifestazione,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }
}

