import { Injectable } from '@angular/core';
import { Tabellatw } from '../classes/Tabella_tw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TabellaTwService {

  private rotta = "/tabellatw";
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
        });
    }

    getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });
    }

    delete(tabellatw: Tabellatw) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + tabellatw.id,  {
            headers: this.getAuthHeader()
          });
    }

    update(tabellatw: Tabellatw) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + tabellatw.id, tabellatw,  {
        headers: this.getAuthHeader()
      });
    }


    create(tabellatw: Tabellatw){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, tabellatw,  {
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

