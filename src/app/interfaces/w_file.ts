/* interfaccia tabella w_file  */

export class WfileInterface  {

  id: number;
  descrizione: string;
  stato: number; // '0= attivo 1=non attivo'
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
