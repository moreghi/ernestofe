import { Injectable } from '@angular/core';
import { TstatoPrenotazione } from '../classes/T_stato_prenotazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TstatoprenotazioneService {

  tstatoprenotazione: TstatoPrenotazione[] = [];  // definisco i dati come array vuoto

  private rotta = '/statoprenotazione';
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
            Authorization: 'Bearer ' +  this.auth.getToken()
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

        delete(statoprenotazione: TstatoPrenotazione) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + statoprenotazione.id,  {
            headers: this.getAuthHeader()
          });      // ok      // ok
        }

    update(statoprenotazione: TstatoPrenotazione) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + statoprenotazione.id, statoprenotazione,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

     create(statoprenotazione: TstatoPrenotazione){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, statoprenotazione,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

    getlastid() {
      this.rottafunction = 'lastid';
      return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

}

