import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../classes/Evento';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';    // per gestire i grafici

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  evento: Evento;

   @Output() eventoOpen = new EventEmitter<boolean>();

  private rotta = "/evento";
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

      delete(evento: Evento) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + evento.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(evento: Evento) {

        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + evento.id, evento,  {
          headers: this.getAuthHeader()
        });
      }


       create(evento: Evento){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, evento,  {
          headers: this.getAuthHeader()
        });
      }


      getbyStato(stato: number) {

        this.rottafunction = 'getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + stato,  {
                headers: this.getAuthHeader()
              });      // ok;

    }


    getbyIdManif(id: number) {
      this.rottafunction = 'getbymanif';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }

    getActivebyIdManif(id: number) {
      this.rottafunction = 'getbymanif/Active';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
        headers: this.getAuthHeader()
      });
    }



    createEvento(stato: boolean){
         this.eventoOpen.emit(stato);

         alert('service - createEvento: ' + stato);
    }


    getAllActive() {

      this.rottafunction = 'getbyActive/Act';
      return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
              headers: this.getAuthHeader()
            });      // ok;
  }

  getlast() {
    this.rottafunction = 'lastid/last';
    return this.http.get(this.APIURL + '/' + this.rottafunction , {
      headers: this.getAuthHeader()
    });
  }






  getnumbyManif(id: number) {
    this.rottafunction = 'getNumberEventi/Manif';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id, {
      headers: this.getAuthHeader()
    });
  }

  getbyIdManifbyStato(id: number, stato: number) {
    this.rottafunction = 'getbymanif/Stato';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' +  stato, {
      headers: this.getAuthHeader()
    });
  }




/*


        this.rottafunction = 'updatebyid';
        this.http.put(this.APIURL + '/' + this.rottafunction + '/' + evento.id, evento,  {
          headers: this.getAuthHeader()
        });
        if(evento.stato === 1) {
          this.eventoOpen.emit(evento);
        }
        return ;


*/


  }
