/* interfaccia tabella Cassa  */

export interface CassaInterface {

  id: number;
  datacassa: string;
  stato: number;
  importo: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

