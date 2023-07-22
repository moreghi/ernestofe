import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoSettore } from '../classes/Eventosettore';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventosettoreService {

  private rotta = "/eventosettore";
  private rottafunction = '';

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient, private auth: AuthService) { }


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

      delete(eventosettore: EventoSettore) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + eventosettore.id,  {
          headers: this.getAuthHeader()
        });
      }

      update(eventosettore: EventoSettore) {

        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + eventosettore.id, eventosettore,  {
          headers: this.getAuthHeader()
        });
      }

       create(eventosettore: EventoSettore){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, eventosettore,  {
          headers: this.getAuthHeader()
        });
      }

    getbyIdEvento(id: number) {
      this.rottafunction = '/getbyevento';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }

    getbyIdEventoSettore(id: number, idSett: number) {
      this.rottafunction = 'getbyevento/settore';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idSett  , {
        headers: this.getAuthHeader()
      });
    }

    getbyStato(id: number, idSett: number, stato: number) {
      this.rottafunction = 'getbyStato/Sett/Stato';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idSett + '/' + stato  , {
        headers: this.getAuthHeader()
      });
    }

    getlast() {     // ok
      this.rottafunction = 'lastid/last';
      return this.http.get(this.APIURL + '/' + this.rottafunction, {
        headers: this.getAuthHeader()
      });
    }

    getbyIdEventoLogistica(idLog: number, idEvento: number) {
      this.rottafunction = 'getbyevento/logistica';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idLog + '/' + idEvento  , {
        headers: this.getAuthHeader()
      });
    }

    getbyIdEventoLogisticaActive(idLog: number, idEvento: number, stato: number) {
      this.rottafunction = 'getbyevento/logistica/Act';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idLog + '/' + idEvento + '/' + stato , {
        headers: this.getAuthHeader()
      });
    }

    aggiornaPostiPrenotati(idSettore: number, numPosti: number) {
      this.rottafunction = 'update/settore';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idSettore + '/' + numPosti , {
        headers: this.getAuthHeader()
      });
    }


}


