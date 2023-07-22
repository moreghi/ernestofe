import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Locandina } from '../classes/Locandina';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LocandinaService {

  private rotta = "/locandina";
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

      delete(locandina: Locandina) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + locandina.id,  {
          headers: this.getAuthHeader()
        });

      }

      update(locandina: Locandina) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + locandina.id, locandina,  {
          headers: this.getAuthHeader()
        });
      }


       create(locandina: Locandina){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, locandina,  {
          headers: this.getAuthHeader()
        });
      }


      getbynameloc(photo: string) {
        this.rottafunction = 'getbynameloc/locandina';
        return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + photo, {
          headers: this.getAuthHeader()
        });
      }

        getlast() {
          this.rottafunction = 'lastid/last';
          return this.http.get(this.APIURL + '/' + this.rottafunction, {
            headers: this.getAuthHeader()
          });
        }


  }
