/* interfaccia tabella utenti  */

export interface UserInterface {

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
  idLevel: number;
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

}



