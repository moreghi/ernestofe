/* interfaccia tabella Cassamov  */

export interface CassamovInterface {

  id: number;
  idcassa: number;
  idevento: number;
  idbiglietto: number;
  importo: number;
  stato: number;
  modpag: number;
  cognome: string;
  nome: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

