
import { Injectable } from '@angular/core';
import { W_Prenotazevento_master } from './../classes/W_Prenotazevento_master';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class W_PrenotazeventomasterService {

  private rotta = '/wprenotazeventomaster';
  private rottafunction = '';

  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLSEARCH = '';

     constructor(private http: HttpClient, private auth: AuthService) { }

  getAuthHeader(): HttpHeaders   {
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

    getbytoken(token: string) {
          this.rottafunction = 'getbytoken';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token,  {
            headers: this.getAuthHeader()
          });        // ok
        }

    delete(prenotazevento: W_Prenotazevento_master) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazevento.id,  {
            headers: this.getAuthHeader()
          });
        }

    update(prenotazevento: W_Prenotazevento_master) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazevento.id, prenotazevento,  {
        headers: this.getAuthHeader()
      });       // ok
    }

     create(prenotazevento: W_Prenotazevento_master){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazevento,  {
        headers: this.getAuthHeader()
      });       // ok
    }

}

