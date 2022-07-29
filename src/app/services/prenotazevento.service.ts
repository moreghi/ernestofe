import { Injectable } from '@angular/core';
import { Prenotazevento } from '../classes/Prenotazevento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazeventoService {

  private rotta = '/prenotazevento';
  private rottafunction = '';

  private rottadaevadere = '/pren/getPrenotazionidaEvadere';
  private rottadaevaderebyday = '/pren/prenotazionibyday';
  private rottaprenbystato = '/pren/getPrenotazionibyStato';
  private rottaprenbyemail = '/pren/getPrenotazionibyemail';


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

    getPrenotazioni() {

         return this.http.get(this.APIURL);
    }      // ok      // ok




        getPrenotazione(id: number) {
          return this.http.get(this.APIURL + '/' + id);      // ok
        }


        deletePrenotazione(prenotazevento: Prenotazevento) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazevento.id);      // ok

        }



    updatePrenotazione(prenotazevento: Prenotazevento) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazevento.id, prenotazevento);      // ok

    }


     createPrenotazione(prenotazevento: Prenotazevento){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazevento);      // ok
    }


    getPrenotazinidaEvadere() {

         this.APIURLSEARCH = this.APIURL + this.rottadaevadere;

         return this.http.get(this.APIURLSEARCH);      // ok      // ok
    }


    getPrenotazinidaEvaderebyday(id: number) {

      this.APIURLSEARCH = this.APIURL + this.rottadaevaderebyday;
      console.log('--------- APIURL -------------------------------   prenotazioneService - prenbyday: ' + this.APIURL);
      console.log('-----------------------------------------   prenotazioneService - prenbyday: ' + this.APIURLSEARCH);
      return this.http.get(this.APIURLSEARCH + '/' + id);      // ok      // ok
 }


   getPrenotazinibystato(id: number) {

  this.APIURLSEARCH = this.APIURL + this.rottaprenbystato;
  return this.http.get(this.APIURLSEARCH + '/' + id);      // ok      // ok
}


getPrenotazinibyemail(email: string) {

  this.APIURLSEARCH = this.APIURL + this.rottaprenbyemail;
  return this.http.get(this.APIURLSEARCH + '/' + email);      // ok      // ok
}


// invio email dopo conferma definitiva prenotazione
sendemailPrenotazioneConfermataMoreno(prenotazevento: Prenotazevento) {

  console.log('frontend - prenotazioneConfirm.service - sendemailPrenotazioneConfermataMoreno --  :  ' + JSON.stringify(prenotazevento));

  return this.http.post(this.APIURL + '/pren/invioemailprenotazione/' + prenotazevento.email, prenotazevento);

  }

  deleteAllPrenotazbyToken(token: string) {

    this.rottafunction = 'deleteAllbytoken';
    return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + token);      // ok

  }


  getbyEvento(id: number) {
    this.rottafunction = 'pren/getbyevento/evento';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id);      // ok      // ok
  }





}

