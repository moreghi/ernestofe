import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WFile } from '../classes/W_File';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WFileService {

  private rotta = '/wfile';
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

     delete(wfile: WFile) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + wfile.id, {
            headers: this.getAuthHeader()
          });      // ok

        }

     update(wfile: WFile) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + wfile.id, wfile, {
        headers: this.getAuthHeader()
        });
        }

    create(wfile: WFile){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, wfile, {
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
