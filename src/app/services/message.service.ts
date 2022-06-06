import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../classes/Message';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private rotta = '/message';

  private rottafunction = '';

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  message: Message;

// lettura tutti i moduli
  getAlls():Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // inserimento nuovo modulo
   createNew(data:any):Observable<any>{
    this.rottafunction = 'create';
    return this.http.post(this.apiUrl + '/' + this.rottafunction, data);
  }

  // cancellazione utente
   delete(id:any):Observable<any>  {
    this.rottafunction = "deletebyid";
  //  console.log('cancellazione Utente: ' + id);
    return this.http.delete(this.apiUrl + '/' + this.rottafunction + '/' + id);
  }

  update(data:any):Observable<any> {
    this.rottafunction = "updatebyid";
    console.log(`aggiornamento rotta ${data.id} `);
    return this.http.put(`${this.apiUrl}/${this.rottafunction}/${data.id}`, data);
  }

  getbyId(id:number):Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}
