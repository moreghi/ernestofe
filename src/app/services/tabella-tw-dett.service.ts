import { Injectable } from '@angular/core';
import { TabellatwDett } from '../classes/Tabella_tw_dett';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TabellaTwDettService {

  private rotta = "/tabellatwdett";
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
        });
    }

    getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });
    }

    delete(elemento: TabellatwDett) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + elemento.id,  {
            headers: this.getAuthHeader()
          });
    }

    update(elemento: TabellatwDett) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + elemento.id, elemento,  {
        headers: this.getAuthHeader()
      });
    }


    create(elemento: TabellatwDett){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, elemento,  {
        headers: this.getAuthHeader()
      });
    }

    deleteAll() {
      this.rottafunction = 'deleteAll';
      return this.http.delete(this.APIURL + '/' + this.rottafunction ,  {
        headers: this.getAuthHeader()
      });
    }



}

