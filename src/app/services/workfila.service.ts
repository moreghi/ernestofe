import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkFila } from '../classes/Work_fila';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkfilaService {

  private rotta = '/workFila';
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

     delete(workFila: WorkFila) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + workFila.id, {
            headers: this.getAuthHeader()
          });      // ok

        }

     update(workFila: WorkFila) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + workFila.id, workFila, {
        headers: this.getAuthHeader()
        });
        }

    create(workFila: WorkFila){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, workFila, {
        headers: this.getAuthHeader()
      });      // ok
    }

      getAllselected(stato: number):Observable<any> {
          this.rottafunction = 'getAll/selected';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
           headers: this.getAuthHeader()
         });      // ok
      }

      getAllloc(idlog: number, idsec: number):Observable<any> {
        this.rottafunction = '/getallLog';
        return this.http.get(this.APIURL  + this.rottafunction + '/' + idlog + '/' + idsec,  {
         headers: this.getAuthHeader()
        });      // ok
      }

      getAllfilebySector(idlog: number, idsec: number, stato: number):Observable<any> {
        this.rottafunction = '/getAllfileby/Sector';
        return this.http.get(this.APIURL  + this.rottafunction + '/' + idlog + '/' + idsec + '/' + stato,  {
         headers: this.getAuthHeader()
        });      // ok
      }

      getAllfilebyAllSector(idlog: number, stato: number):Observable<any> {
        this.rottafunction = '/getAllfileby/AllSector';
        return this.http.get(this.APIURL  + this.rottafunction + '/' + idlog + '/' + stato,  {
         headers: this.getAuthHeader()
        });      // ok
      }



}
