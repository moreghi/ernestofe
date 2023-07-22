/* interfaccia tabella w_settori  */

export class WsettoriInterface  {

  id: number;
  descrizione: string;
  stato: number; // '0= attivo 1=non attivo'
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}




