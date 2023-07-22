import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wsettori } from '../classes/W_Settori';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WSettoriService {

  private rotta = '/wsettori';
  private rottafunction = '';
  private stato = 0;

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient,
              private auth: AuthService) { }


 getAuthHeader(): HttpHeaders   {
   // passo il token dentro a header per non farlo passare in chiaro su url

   const headers = new HttpHeaders(
       {
        authorization: 'Bearer ' + this.auth.getToken()
       }
     );
     return headers;
   }


     getAll():Observable<any> {
             return this.http.get(this.APIURL,  {
              headers: this.getAuthHeader()
            });      // ok
        }


     getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });
        }

     delete(wsettori: Wsettori) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + wsettori.id, {
            headers: this.getAuthHeader()
          });      // ok

        }

     update(wsettori: Wsettori) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + wsettori.id, wsettori, {
        headers: this.getAuthHeader()
        });
        }

    create(wsettori: Wsettori){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, wsettori, {
        headers: this.getAuthHeader()
      });      // ok
        }

    getAllselected(stato: number):Observable<any> {
          this.rottafunction = 'getAll/selected';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
           headers: this.getAuthHeader()
         });      // ok
     }
}


