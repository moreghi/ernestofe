/* interfaccia tabella Cassa  */

export interface CassaInterface {

  id: number;
  idEvento: number;
  datacassa: string;
  stato: number;
  cassaIniziale: number;
  incassi: number;
  cassaFinale: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

