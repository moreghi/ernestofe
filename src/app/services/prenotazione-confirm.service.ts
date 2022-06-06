import { Injectable } from '@angular/core';
import { PrenotazioneConfirm } from '../classes/PrenotazioneConfirm';
import { Prenotazione } from '../classes/Prenotazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { delay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PrenotazioneConfirmService {

  private rotta = '/prenotConfirm';
  private rottafunction = '';

  private rottabyToken = '/getbytoken';
  private rottabyTokenCodpre = '/getbytokencodpre';
  private rottabyEmailDatapre = '/getbyemaildatapre';
  private rottabyEmail = '/getbyemail';

  private rottadeletebyToken = '/destroyToken';



  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLTOKEN = '';

  constructor(private http: HttpClient, private auth: AuthService) { }

  public preConf: PrenotazioneConfirm;
  public prenotazione: Prenotazione;

  // la prenotazione va fatta senza loggarsi

  /*
  getAuthHeader(): HttpHeaders {
    const headers = new HttpHeaders(
      {
          Authotzation : 'Bearer ' + this.auth.getToken()
      }
    );
    return headers;
  }  */

       getPreConfirms() {
              // ok
          return this.http.get(this.APIURL);
        }

        getPreConfirm(email: string) {
          return this.http.get(this.APIURL + '/' + email);
        }


        deletePreConfirm(preConf: PrenotazioneConfirm) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/'  + this.rottafunction +  '/' + preConf.email);
        }


        updatePreConfirm(preConf: PrenotazioneConfirm) {
          this.rottafunction = 'updatebyid';
          return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + preConf.email, preConf);
         }

       createPreConfirm(preConf: PrenotazioneConfirm){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, preConf);
      }

      getPreConfirmbyToken(token: string) {

        this.APIURLTOKEN =  this.APIURL + this.rottabyToken;
        return this.http.get(this.APIURLTOKEN + '/' + token);

      }


      getPreConfirmbyTokenCodpre(token: string, codpre: string) {
        this.APIURLTOKEN =  this.APIURL + this.rottabyTokenCodpre;
        return this.http.get(this.APIURLTOKEN + '/' + token + '/' + codpre );

      }


      getPreConfirmbyEmailData(email: string, datapre: Date) {
        this.APIURLTOKEN =  this.APIURL + this.rottabyEmailDatapre;
        return this.http.get(this.APIURLTOKEN + '/' + email + '/' + datapre );

      }

      getPreConfirmbyEmail(email: string) {
        this.APIURLTOKEN =  this.APIURL + this.rottabyEmail;
        return this.http.get(this.APIURLTOKEN + '/' + email  );

      }

      deletePreConfirmbyToken(token: string) {
        this.APIURLTOKEN =  this.APIURL + this.rottadeletebyToken;
        return this.http.delete(this.APIURLTOKEN + '/' + token);

      }


// registrazione prenotazione cena a sanfra tramite mail 2022/03/16
registerConfermetPrenotazioneMoreno(cognome: string, nome: string, email: string, telefono: string,
                                    giornata: string, numpersone: number, idGiornata: number) {

  console.log(`frontend - prenotazioneConfirm.service - registerConfermetPrenotazioneMoreno ------  inizio -- cognome passato: ${cognome} ` );

  this.preConf = new PrenotazioneConfirm();
  this.preConf.cognome = cognome;
  this.preConf.nome = nome;
  this.preConf.email = email;
  this.preConf.telefono = telefono;
  this.preConf.datapren = giornata;
  this.preConf.persone = numpersone;
  this.preConf.idgiornata = idGiornata;

  console.log('pronto per registrare la prenotazioen_confirm ' + JSON.stringify(this.preConf));

  let merda = this.APIURL + '/confirmed';
  console.log('path per lanciare la registrazione della prenotazione: ', merda);



  return this.http.post(this.APIURL + '/confirmed', this.preConf);

  //  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

}





}
