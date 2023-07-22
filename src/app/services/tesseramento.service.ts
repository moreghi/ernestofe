import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tesseramento } from '../classes/Tesseramento';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TesseramentoService {

  private rotta = "/tesseramento";

  private rootRicercaStato  = "/getbyStato/";

  private rottafunction = '';

// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server


private APIURLSEARCH = '';

  constructor(private http: HttpClient, private auth: AuthService) { }


// attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato
// metodo per concatenare il token nei metodi di chiamata al server
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
             });      // ok
        }

        getbyid(id: number) {
          return this.http.get(this.APIURL + '/' +  id , {
            headers: this.getAuthHeader()
          });
        }

        getbySocio(idSocio: number) {
          this.rottafunction = 'getbyidSocio';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  idSocio , {
            headers: this.getAuthHeader()
          });
        }

        getbySocioeAnno(idSocio: number, anno: number) {
          this.rottafunction = 'getbyAnno';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  anno  + '/Socio/' +  idSocio, {
            headers: this.getAuthHeader()
          });
        }


        getbyTessera(tessera: string) {
          this.rottafunction = 'getbyidTessera';
          return this.http.get(this.APIURL + '/' + this.rottafunction + "/'" +  tessera + "'", {
            headers: this.getAuthHeader()
          });
        }

        deletetesseramento(tesseramento: Tesseramento) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + tesseramento.id,  {
            headers: this.getAuthHeader()
          });

        }


        updatetesseramento(tesseramento: Tesseramento) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + tesseramento.id, tesseramento,  {
            headers: this.getAuthHeader()
          });

        }


         createtesseramento(tesseramento: Tesseramento){
          this.rottafunction = 'create';

          const aa = this.getAuthHeader();
          console.log('frontend - Createtesseramento: -------  headers ' + JSON.stringify(aa));


          return this.http.post(this.APIURL + '/' + this.rottafunction, tesseramento,  {
            headers: this.getAuthHeader()
          });
        }

        countTesserebyanno(anno: number){
          this.rottafunction = 'gettesserebyAnno';

          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + anno,  {
            headers: this.getAuthHeader()
          });
        }

}
