import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eventosettfilaposti } from '../classes//Eventosettfilaposti';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventosettfilapostiService {

  private rotta = "/eventosettfilaposti";
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

      delete(eventosettfilaposti: Eventosettfilaposti) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + eventosettfilaposti.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(eventosettfilaposti: Eventosettfilaposti) {

        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + eventosettfilaposti.id, eventosettfilaposti,  {
          headers: this.getAuthHeader()
        });
      }


       create(eventosettfilaposti: Eventosettfilaposti){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, eventosettfilaposti,  {
          headers: this.getAuthHeader()
        });
      }


    getbyIdEvento(id: number) {
      this.rottafunction = '/getbyevento';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }

    getcountfileposti(id: number) {
      this.rottafunction = '/count';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }






}



/*


import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';    // per gestire i grafici

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  evento: Evento;

   @Output() eventoOpen = new EventEmitter<boolean>();





*/
