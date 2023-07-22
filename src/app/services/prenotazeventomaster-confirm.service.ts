import { Injectable } from '@angular/core';
import { PrenotazeventomasterConfirm } from '../classes/PrenotazeventomasterConfirm';
import { EventoPosto } from '../classes/Eventoposto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrenotazeventomasterConfirmService {
  private rotta = '/prenotazeventomasterConfirm';
  private rottafunction = '';



  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLSEARCH = '';

     constructor(private http: HttpClient, private auth: AuthService) { }


  // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato


  /*   inibisco la gestione token.  -- le conferme sono fatte da utenti non registrati

  getAuthHeader(): HttpHeaders   {
    // passo il token dentro a header per non farlo passare in chiaro su url
    const headers = new HttpHeaders(
        {
          authorization: 'Bearer ' + this.auth.getToken()
        }
      );
      return headers;
      }
*/

    getAll() {

         return this.http.get(this.APIURL);
    }      // ok      // ok

    getbyId(id: number) {
          return this.http.get(this.APIURL + '/' + id);      // ok
        }

    delete(prenotazevento: PrenotazeventomasterConfirm) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazevento.id);      // ok
        }

    update(prenotazevento: PrenotazeventomasterConfirm) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazevento.id, prenotazevento);      // ok
    }

    create(prenotazevento: PrenotazeventomasterConfirm){
          this.rottafunction = 'create';
          return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazevento);      // ok
    }

    getbycodpren(codpren: string) {

      this.rottafunction = 'getPrenotazbycodpren/codpren';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  codpren);      // ok      // ok
    }

    deletebycodpren(codpren: string) {
      this.rottafunction = 'destroycodpren';
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/'  + codpren);
    }

    deletebytoken(token: string) {
      this.rottafunction = 'destroytoken';
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/'  + token);
    }

    invioemail(prenotazevento: PrenotazeventomasterConfirm){

      this.rottafunction = 'confirmedprenmasterevento';
      return this.http.post(this.APIURL + '/' + this.rottafunction , prenotazevento);      // ok


      /*   vecchia modalità. non passo più parametri, ma in body
      let cognome = prenotazevento.cognome;
      let nome = prenotazevento.nome;
      let dataev = prenotazevento.dataEvento;
      let datapren = prenotazevento.datapren;
      let descev = prenotazevento.descEvento;
      let email = prenotazevento.email;
      let oraev = prenotazevento.oraEvento;
      let importo = prenotazevento.importo;
      let codpren = prenotazevento.codpren;
      let token = prenotazevento.token;
      let telefono = prenotazevento.telefono;

      this.rottafunction = 'confirmedprenmasterevento';
      return this.http.post(this.APIURL + '/' + this.rottafunction + '/' + cognome + '/' + nome + '/' + dataev + '/' + datapren + '/' + descev  + '/' + email + '/' + oraev + '/' + codpren + '/' + token + '/' + telefono + '/' + importo, prenotazevento);      // ok
      */



}

getbytoken(token: string) {

  this.rottafunction = 'getPrenotazbytoken';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  token);      // ok      // ok
}

getAllbyEvento(id: number) {

  this.rottafunction = 'getAllby/Evento';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' +  id);      // ok      // ok
}


}


