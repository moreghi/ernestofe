import { Injectable } from '@angular/core';
import { Prenotazione } from '../classes/Prenotazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  private rotta = "/prenotazione";
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

  getAuthHeader(): HttpHeaders   {
    // passo il token dentro a header per non farlo passare in chiaro su url
    const headers = new HttpHeaders(
        {
            Authorization: 'Bearer ' +  this.auth.getToken()
        }
      );
      return headers;
      }


    getPrenotazioni() {

      // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
         return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });      // ok      // ok


        }

        getPrenotazione(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });      // ok
        }


        deletePrenotazione(prenotazione: Prenotazione) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazione.id,  {
            headers: this.getAuthHeader()
          });      // ok

        }



    updatePrenotazione(prenotazione: Prenotazione) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazione.id, prenotazione,  {
        headers: this.getAuthHeader()
      });      // ok

    }


     createPrenotazione(prenotazione: Prenotazione){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione,  {
         headers: this.getAuthHeader()
      });      // ok
    }


    getPrenotazinidaEvadere() {

         this.APIURLSEARCH = this.APIURL + this.rottadaevadere;

         return this.http.get(this.APIURLSEARCH,  {
          headers: this.getAuthHeader()
        });      // ok      // ok
    }


    getPrenotazinidaEvaderebyday(id: number) {

      this.APIURLSEARCH = this.APIURL + this.rottadaevaderebyday;
      console.log('--------- APIURL -------------------------------   prenotazioneService - prenbyday: ' + this.APIURL);
      console.log('-----------------------------------------   prenotazioneService - prenbyday: ' + this.APIURLSEARCH);
      return this.http.get(this.APIURLSEARCH + '/' + id,  {
       headers: this.getAuthHeader()
     });      // ok      // ok
 }


   getPrenotazinibystato(id: number) {

  this.APIURLSEARCH = this.APIURL + this.rottaprenbystato;
  return this.http.get(this.APIURLSEARCH + '/' + id,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}


getPrenotazinibyemail(email: string) {

  this.APIURLSEARCH = this.APIURL + this.rottaprenbyemail;
  return this.http.get(this.APIURLSEARCH + '/' + email,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}


// invio email dopo conferma definitiva prenotazione
sendemailPrenotazioneConfermataMoreno(prenotazione: Prenotazione) {

  console.log('frontend - prenotazioneConfirm.service - sendemailPrenotazioneConfermataMoreno ------  :  ' + JSON.stringify(prenotazione));

  return this.http.post(this.APIURL + '/pren/invioemailprenotazione/' + prenotazione.email, prenotazione);

  }




}
