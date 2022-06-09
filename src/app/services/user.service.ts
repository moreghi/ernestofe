import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private rotta = '/users';
  private rottafunction = '';

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  user: User;
  // lettura tutti gli utenti

  // non so dove usarlo nelle chiamate http
  getAuthHeader(): HttpHeaders {
    const headers = new HttpHeaders(
      {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    );
    return headers;
  }

  // lettura tutti gli utenti   -- ok
  getAllUsers():Observable<any> {

    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeader()
    } );
  }

  // inserimento nuovo utente   -- ok
   createUser(user: User){
    this.rottafunction = 'create';
    return this.http.post(this.apiUrl + '/' + this.rottafunction, user, {
      headers: this.getAuthHeader()
    });
  }


  // cancellazione utente -----  ok
  deleteuser(id:any):Observable<any>  {
    this.rottafunction = "deletebyid";
  //  console.log('cancellazione Utente: ' + id);
    return this.http.delete(this.apiUrl + '/' + this.rottafunction + '/' + id, {
      headers: this.getAuthHeader()
    });
  }

    // aggiornamento  utente -----  ok
  updateUser(user:any,id:any):Observable<any> {
    this.rottafunction = "updatebyid";
    console.log(`aggiornamento utente ${id} `);
  //  vecchio   return this.http.put(`${this.apiUrl}/${this.rottafunction}/${id}`, data);

   // user['_method'] = 'PUT';
//  prima .patch
    return this.http.put(this.apiUrl + '/' + this.rottafunction + '/' + user.id, user, {
    headers: this.getAuthHeader()
    });
  }

 // Visualizzazione singolo utente   --------   ok
 getuser(id: number):Observable<any>  {
  console.log('userService ------ lettura singolo Utente: ' + id);
 //   vecchio               return this.http.get(`${this.apiUrl}/${id}`);

  return this.http.get(this.apiUrl + '/' + id, {
    headers: this.getAuthHeader()
  });

}
// Visualizzazione singolo utente   --- per email    -- ok
getuserbyEmail(email: string):Observable<any>  {
  this.rottafunction = "getbyemail";
          console.log('userService ------ lettura singolo Utente per email: ' + email);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + email, {
    headers: this.getAuthHeader()
  });      // ok;

}

getuserbyEmailPren(email: string):Observable<any>  {
  this.rottafunction = "getbyemailPren";
          console.log('userService ------ lettura singolo Utente per email: ' + email);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + email);

}



getUserbyTipo(ruolo: number) {
  this.rottafunction = "getbytipo";

  console.log('rotta per lettura utenti per ruolo');
  console.log(this.apiUrl + '/' + this.rottafunction + '/' + ruolo);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + ruolo, {
    headers: this.getAuthHeader()
  });      // ok;
}


 // lettura tutti gli utenti   -- ok
 getAllUsersCircolo(ruolo: string):Observable<any> {

  this.rottafunction = "getAllbyruolo";


  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + ruolo, {
    headers: this.getAuthHeader()
  });
}


getUserbyLevel(level: number) {
  this.rottafunction = "getbylevel";

  console.log('rotta per lettura utenti per livello');
  console.log(this.apiUrl + '/' + this.rottafunction + '/' + level);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + level, {
    headers: this.getAuthHeader()
  });      // ok;
}

/*
 Visualizzazione singolo utente   --- per email  e cognome  -- ok
 non faccio gestione con token per uso in conferma prenotazione (senza login)

 */

getuserbyEmaileCognome(email: string, cognome: string):Observable<any>  {
  this.rottafunction = "getbyemailecognome";
  console.log('userService ------ lettura singolo Utente per email: ' + email + ' e cognome: ' + cognome);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + email + '/' + cognome, {
    headers: this.getAuthHeader()
  });      // ok;

}

getuserbyEmaileCognomePren(email: string, cognome: string):Observable<any>  {
  this.rottafunction = "getbyemailecognomePren";
  console.log('userService ------ lettura singolo Utente per email: ' + email + ' e cognome: ' + cognome);

  return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + email + '/' + cognome);      // ok;

}



createUserbyprenotazione(user: User) {

  console.log('frontend - userService - createUserbyprenotazione ------  ' + JSON.stringify(user) );

  return this.http.post(this.apiUrl + '/' + "confirmeduser", user);
  //  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

}



// vecchia definizione  -- funzionante

/*
getAllUsers():Observable<any> {
  return this.http.get(`${this.apiUrl}, {
    headers: this.getAuthHeader()
  }`);


}

// inserimento nuovo utente
createUser(data:any):Observable<any> {
  console.log(data,'UserService - CreateUser');
  return this.http.post(`${this.apiUrl}`, data);
}

// cancellazione utente
deleteuser(id:any):Observable<any>  {
  this.rottafunction = "deletebyid";
  console.log('cancellazione Utente: ' + id);
  return this.http.delete(`${this.apiUrl}/${this.rottafunction}/${id}`);
}


updateUser(data:any,id:any):Observable<any> {
  this.rottafunction = "updatebyid";
  console.log(`aggiornamento utente ${id} `);
//  vecchio   return this.http.put(`${this.apiUrl}/${this.rottafunction}/${id}`, data);

  data['_method'] = 'PUT';

  return this.http.patch(this.apiUrl + '/' + data.id, data, {
  headers: this.getAuthHeader()
});
}

// Visualizzazione singolo utente
getuser(id: number):Observable<any>  {
console.log('userService ------ lettura singolo Utente: ' + id);
//   vecchio               return this.http.get(`${this.apiUrl}/${id}`);

return this.http.get(this.apiUrl + '/' + id, {
  headers: this.getAuthHeader()
});

}
// Visualizzazione singolo utente
getuserbyEmail(email: string):Observable<any>  {
console.log('userService ------ lettura singolo Utente per email: ' + email);
return this.http.get(`${this.apiUrl}/${email}`);

}

*/


















}

