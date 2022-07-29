import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoPosto } from '../classes/Eventoposto';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventopostoService {

  private rotta = "/eventoposto";
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

      delete(eventoposto: EventoPosto) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + eventoposto.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(eventoposto: EventoPosto) {

        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + eventoposto.id, eventoposto,  {
          headers: this.getAuthHeader()
        });
      }


       create(eventoposto: EventoPosto){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, eventoposto,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(id: number, stato: number) {

        this.rottafunction = '/getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;

    }


    getbyIdEvento(id: number) {
      this.rottafunction = '/getbyevento';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }


    getbyIdEventoSettFila(id: number, idSett: number, idFila: number) {
      this.rottafunction = 'getbyevento/SettFila';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idSett + '/' + idFila   , {
        headers: this.getAuthHeader()
      });
    }

    getbyIdEventoSettFilaActive(id: number, idSett: number, idFila: number) {
      this.rottafunction = 'getbyevento/SettFilaActive';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idSett + '/' + idFila   , {
        headers: this.getAuthHeader()
      });
    }

    getbykeyuserpren(keyuserpren: string) {
      this.rottafunction = 'getbyevento/keyuserpren';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + keyuserpren , {
        headers: this.getAuthHeader()
      });
    }

    getbyIdEventoSettFilaposto(id: number, idSett: number, idFila: number, posto: number) {
      this.rottafunction = 'settfilaposto';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + idSett + '/' + idFila + '/' + posto, {
        headers: this.getAuthHeader()
      });
    }





}


