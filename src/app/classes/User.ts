import { UserInterface } from '../interfaces/user';

export class User implements UserInterface {


  id: number;
  cognome: string;
  nome: string;
  photo: string;
  idStato: number;
  tipoacc: number;
  username: string;
  password: string;
  email: string;
  telefono: string;
  idRuolo: number;
  idRuolo_Day: number;
  idruoloweb: number;
  noteUtente: string;
  eseguitaAbilitazione: string;
  remember_token: string;
  email_verified_at: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
// campo derivato dalla relazione con tabella t_stato_manifestazione
  d_ruolo: string;
  d_ruolo_day: string;
  d_Stato_Utente: string;
  d_ruolo_web: string;

  constructor()  {

  this.id = 0;
  this.cognome = '';
  this.nome = '';
  this.idStato = 0;
  this.tipoacc = 0;
  this.username = '';
  this.password = '';
  this.email = '';
  this.telefono = '';
  this.photo = '';
  this.idRuolo = 0;
  this.idRuolo_Day = 0;
  this.idruoloweb = 0;
  this.noteUtente = '';
  this.eseguitaAbilitazione = 'N';
  this.remember_token = '';
  this.email_verified_at = '';
  this.key_utenti_operation = 0;
  this.created_at = new Date();
  this.updated_at = new Date();
// relazioni
  this.d_ruolo = '';
  this.d_ruolo_day = '';
  this.d_Stato_Utente = '';
  this.d_ruolo_web = '';

  }


}
