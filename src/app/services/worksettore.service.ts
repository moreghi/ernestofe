import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkSettore } from '../classes/Work_settore';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorksettoreService {

  private rotta = '/workSettore';
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

     delete(workSettore: WorkSettore) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + workSettore.id, {
            headers: this.getAuthHeader()
          });      // ok

        }

     update(workSettore: WorkSettore) {
      this.rottafunction = 'updateby/id';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + workSettore.id, workSettore, {
        headers: this.getAuthHeader()
        });
        }

    create(workSettore: WorkSettore){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, workSettore, {
        headers: this.getAuthHeader()
      });      // ok
        }

    getAllselected(stato: number):Observable<any> {
          this.rottafunction = 'getAll/selected';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
           headers: this.getAuthHeader()
         });      // ok
     }

     getCountbylogistica(id: number) {

      this.rottafunction = '/count';
      return this.http.get(this.APIURL + this.rottafunction + '/' + id);
    }

    getAllloc(idlog: number):Observable<any> {
      this.rottafunction = '/getallLog';
      return this.http.get(this.APIURL  + this.rottafunction + '/' + idlog,  {
       headers: this.getAuthHeader()
      });      // ok
    }

    getbySettoreAct(id: number, stato: number):Observable<any> {
      this.rottafunction = 'getbySettoreAct';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/' + stato,  {
       headers: this.getAuthHeader()
     });      // ok
 }


}
