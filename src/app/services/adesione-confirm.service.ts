import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdesioneConfirm } from '../classes/AdesioneConfirm';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AdesioneConfirmService {

  public adeConf: AdesioneConfirm;


  private rotta = "/adesioneConfirm";
  private rottafunction = '';

  private rottabyToken = '/getbytoken';
  private rottabyTokenCodade = '/getbytokencodade';
  private rottabyEmail = '/getbyemail';
  private rottabyEmailCognomeNome = 'getbyemailCognomeNome';

  private rottadeletebyToken = '/destroyToken';


// vecchia versione senza environment
//  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server


  constructor(private http: HttpClient, private auth: AuthService) { }

  /*   il cliente non è loggato quindi non ho token
      getAuthHeader(): HttpHeaders {
        const headers = new HttpHeaders(
          {
            authorization: 'Bearer ' + this.auth.getToken()
          }
        );
        return headers;
      }
*/

    getAll() {
      // ok
    return this.http.get(this.APIURL);
    }

    getbyemail(email: string) {
    return this.http.get(this.APIURL + '/' + email);
    }


    delete(adeConf: AdesioneConfirm) {
    this.rottafunction = 'deletebyid';
    return this.http.delete(this.APIURL + '/'  + this.rottafunction +  '/' + adeConf.email);
    }


    update(adeConf: AdesioneConfirm) {
    this.rottafunction = 'updatebyid';
    return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + adeConf.email, adeConf);
    }

    create(adeConf: AdesioneConfirm){
    this.rottafunction = 'create';
    return this.http.post(this.APIURL + '/' + this.rottafunction, adeConf);
    }

    getAdeConfirmbyToken(token: string) {
      this.rottafunction = this.rottabyToken;
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token);
    }


    getAdeConfirmbyTokenCodade(token: string, codade: string) {
      this.rottafunction = this.rottabyTokenCodade;
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token + '/' + codade );

    }

    getAdeConfirmbyEmail(email: string) {
      this.rottafunction = this.rottabyEmail;
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + email  );
    }

    getAdeConfirmbyEmailCognomeNome(email: string, cognome: string, nome: string) {
      this.rottafunction = this.rottabyEmailCognomeNome;
     // const merda = this.APIURL + '/' + this.rottafunction + '/' + email + '/' + cognome + '/' + nome;
     // alert('service: merda ' + merda);

      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + email + '/' + cognome + '/' + nome  );
    }

    deleteAdeConfirmbyToken(token: string) {
      this.rottafunction = this.rottadeletebyToken;
      return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + token);

    }


    // registrazione prenotazione cena a sanfra tramite mail 2022/03/16
    registerConfermetAdesioneMoreno(cognome: string, nome: string, sesso: string, luogonascita: string , datanascita: string,
                                    residenza: string , indirizzo: string, email: string, telcasa: string, cell: string, operativo: string
                                    ) {



    console.log(`frontend - adesioneConfirm.service - registerConfermetAdesioneMoreno ------  inizio -- cognome passato: ${cognome} ` );
    console.log(`frontend - adesioneConfirm.service - registerConfermetAdesioneMoreno ------  inizio -- dataNascita: ${datanascita} ` );

    this.adeConf = new AdesioneConfirm();
    this.adeConf.cognome = cognome.toUpperCase();
    this.adeConf.nome = nome.toUpperCase();
    this.adeConf.sesso = sesso.toUpperCase();
    this.adeConf.luogonascita = luogonascita.toUpperCase();
    this.adeConf.datanascita = datanascita;
    this.adeConf.residenza = residenza.toUpperCase();
    this.adeConf.indirizzo = indirizzo.toUpperCase();
    this.adeConf.email = email.toLowerCase();
    this.adeConf.telcasa = telcasa;
    this.adeConf.cell = cell;
    this.adeConf.operativo = operativo.toUpperCase();

    console.log('AdesioneConformService ------- pronto per registrare la adesione_confirm ' + JSON.stringify(this.adeConf));

   // let merda = this.APIURL + '/confirmed';
   // console.log('path per lanciare la registrazione della prenotazione: ', merda);



    return this.http.post(this.APIURL + '/confirmed', this.adeConf);

    //  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

    }


}


