import { Injectable } from '@angular/core';
import { PrenotazeventoConfirm } from '../classes/PrenotazeventoConfirm';
import { Prenotazevento } from '../classes/Prenotazevento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrenotazeventoConfirmService {

  private rotta = '/prenoteventoNConfirm';
  private rottafunction = '';

  private rottabyToken = '/getbytoken';
  private rottabyTokenCodpre = '/getbytokencodpre';
  private rottabyEmailDatapre = '/getbyemaildatapre';
  private rottabyEmail = '/getbyemail';

  private rottadeletebyToken = '/destroyToken';



  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLTOKEN = '';

  constructor(private http: HttpClient, private auth: AuthService) { }

  public preConf: PrenotazeventoConfirm;
  public prenotazevento: Prenotazevento;

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


deletePreConfirm(preConf: PrenotazeventoConfirm) {
  this.rottafunction = 'deletebyid';
  return this.http.delete(this.APIURL + '/'  + this.rottafunction +  '/' + preConf.email);
}


updatePreConfirm(preConf: PrenotazeventoConfirm) {
  this.rottafunction = 'updatebyid';
  return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + preConf.email, preConf);
}

createPreConfirm(preConf: PrenotazeventoConfirm){
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

getAllPreConfirmbyTokenCodpre(token: string, codpre: string) {
  this.rottafunction = '/getAllbytokencodpre';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token + '/' + codpre );

  }







getPreConfirmbyEmailData(email: string, datapre: Date) {
  this.APIURLTOKEN =  this.APIURL + this.rottabyEmailDatapre;
  return this.http.get(this.APIURLTOKEN + '/' + email + '/' + datapre );

}

getPreConfirmbyEmail(email: string) {
    this.APIURLTOKEN =  this.APIURL + this.rottabyEmail;
    return this.http.get(this.APIURLTOKEN + '/' + email  );

}


getPreConfirmbyEmailUtente(email: string, cognome: string, nome: string, persone: number) {
  this.rottafunction = 'getbyemailuser';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + email + '/' + cognome + '/' + nome + '/' + persone);

}





deletePreConfirmbyToken(token: string) {
  this.rottafunction = 'destroyToken';
  return this.http.delete(this.APIURL + '/' + this.rottafunction + '/'  + token);

}



// registrazione prenotazione cena a sanfra tramite mail 2022/03/16
registerConfermetPrenotazeventonormalMoreno(cognome: string, nome: string, email: string, telefono: string,
                          idevento: number, numpersone: number, idtipobiglietto: number, dataev: string) {

    console.log(`frontend - prenotazioneConfirm.service - registerConfermetPrenotazioneMoreno ------  inizio -- cognome passato: ${cognome} ` );

    this.preConf = new PrenotazeventoConfirm();
    this.preConf.cognome = cognome;
    this.preConf.nome = nome;
    this.preConf.email = email;
    this.preConf.telefono = telefono;
    this.preConf.idevento = idevento;
    this.preConf.persone = numpersone;
    this.preConf.idtipobiglietto = idtipobiglietto;
    this.preConf.datapren = dataev;

    console.log('pronto per registrare la prenotazioen_confirm ' + JSON.stringify(this.preConf));

    // i tipi sono due
    // '/confirmedeventoN'    evento senza logistiva
    // '/confirmedeventoL'    evento con Logistica


    let merda = this.APIURL + '/confirmedeventoN';
    console.log('path per lanciare la registrazione della prenotazione: ', merda);



    return this.http.post(this.APIURL + '/confirmedeventoN', this.preConf);

//  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

}


registerConfermetPrenotazeventologisticaMoreno(preConf: PrenotazeventoConfirm) {

console.log('frontend - prenotazioneConfirm.service - registerConfermetPrenotazeventologisticaMoreno ------');


console.log('pronto per registrare la prenotazioen_confirm ' + JSON.stringify(preConf));

// i tipi sono due
// '/confirmedeventoN'    evento senza logistiva
// '/confirmedeventoL'    evento con Logistica


let merda = this.APIURL + '/confirmedeventoL';
console.log('path per lanciare la registrazione della prenotazione: ', merda);



return this.http.post(this.APIURL + '/confirmedeventoL', preConf);

//  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

}


   // invio email per conferma gruppo di prenotazioni per conferma
   getbysendmailconfirmedpren(sendto: string, cognome: string, nome: string, dataev: string, keyuserpren: string, descev: string) {
    this.rottafunction = 'getbyconfirmedpren/sendmail';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + sendto + '/' + cognome + '/' + nome + '/' +
                        dataev + '/' + keyuserpren + '/' + descev);
  }




}

