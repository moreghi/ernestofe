import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoFila } from '../classes/Eventofila';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventofilaService {

  private rotta = "/eventofila";
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


  getAll(idlog: number, idsett: number) {
        this.rottafunction = 'fila';
        return this.http.get(this.APIURL  + '/' + idlog  + '/' + idsett + '/' + this.rottafunction, {
               headers: this.getAuthHeader()
             });
      }

  getbyId(id: number) {
        return this.http.get(this.APIURL + '/'  + id, {
          headers: this.getAuthHeader()
        });
      }

  delete(eventofila: EventoFila) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction   + '/' + eventofila.id,  {
          headers: this.getAuthHeader()
        });

      }

  update(eventofila: EventoFila) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction  + eventofila.id, eventofila,  {
          headers: this.getAuthHeader()
        });
      }


  create(eventofila: EventoFila){
        this.rottafunction = 'create';

        return this.http.post(this.APIURL + '/' + this.rottafunction , eventofila,  {
          headers: this.getAuthHeader()
        });
      }


  getbyStato(idevento: number, idsett: number, stato: number) {

        this.rottafunction = 'getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idevento  + '/' + idsett + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;
    }


  getbyFila(idevento: number, fila: number) {   // ok

      this.rottafunction = 'getbyFila';
      return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idevento  + '/' + fila,  {
              headers: this.getAuthHeader()
            });      // ok;
  }

  getlast() {     // ok
    this.rottafunction = 'lastid/last';
    return this.http.get(this.APIURL + '/' + this.rottafunction, {
      headers: this.getAuthHeader()
    });
  }

  getbysettore(idsettore: number, stato: number) {   // ok

    this.rottafunction = 'getbysettore';
    return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idsettore + '/' + stato,  {
            headers: this.getAuthHeader()
          });      // ok;
}


getbyeventoLogistica(idLog: number, idEvento: number) {   // ok
  this.rottafunction = 'getbyEvento/Logistica';

console.log('EventoFilaService -- url: ' + this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento )


  return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento,  {
          headers: this.getAuthHeader()
        });      // ok;
}


getfilebyPosti(idLog: number, idEvento: number) {   // ok
  this.rottafunction = 'getfileby/Posti';

console.log('EventoFilaService -- url: ' + this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento )


  return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento,  {
          headers: this.getAuthHeader()
        });      // ok;
}


getlastfila() {     // ok
  //this.rottafunction = 'lastid/last';
  this.rottafunction = 'lastid/ultimo';
  let id = 9999;
  return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + id , {
    headers: this.getAuthHeader()
  });
}

getbyeventoLogisticaSettoreStato(idLog: number, idEvento: number, idSettore: number, stato: number) {   // ok
  this.rottafunction = 'getAllFileby/L/E/S/S';

console.log('EventoFilaService -- url: ' + this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento + '/' + idSettore + '/' + stato )


  return this.http.get(this.APIURL + '/' + this.rottafunction +  '/' + idLog + '/' + idEvento + '/' + idSettore + '/' + stato,  {
          headers: this.getAuthHeader()
        });      // ok;
}


aggiornaPostiPrenotati(idFila: number, numPosti: number) {
  this.rottafunction = 'update/fila';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idFila + '/' + numPosti , {
    headers: this.getAuthHeader()
  });
}







}

