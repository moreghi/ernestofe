import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';  // 'auth-token';
const TOKEN_TYPE = 'token_type:';
const TOKEN_EXPIRES_IN = 'expires_in';
const USER_KEY = 'auth-user';

const TOKEN_TYPE_VALUE = 'bearer';
const TOKEN_EXPIRES_IN_VALUE = 3600;

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
     window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(TOKEN_TYPE, TOKEN_TYPE_VALUE);
    window.localStorage.setItem(TOKEN_EXPIRES_IN, String(TOKEN_EXPIRES_IN_VALUE));

  }

  public getToken(): string | null {
    return  window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.localStorage.setItem('username', user.username);
    window.localStorage.setItem('cognome', user.cognome);
    window.localStorage.setItem('email', user.email);
    window.localStorage.setItem('user_ruolo', String(user.user_ruolo));
    window.localStorage.setItem('id', String(user.id));
    window.localStorage.setItem('idruoloweb', String(user.idruoloweb));
    window.localStorage.setItem('token', String(user.remember_token));
  }


  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }


/*
     localStorage.setItem('token', payload.access_token);
          console.log(payload);
          localStorage.setItem('user', JSON.stringify(payload));            // campi aggiuntivi messi per testare - facoltativi
          localStorage.setItem('username', payload.username);
          localStorage.setItem('cognome', payload.cognome);
          localStorage.setItem('email', payload.email);
          localStorage.setItem('user_ruolo', payload.level);
          localStorage.setItem('id', String(payload.id));
          localStorage.setItem('idruoloweb', String(payload.idruoloweb));

*/

}
