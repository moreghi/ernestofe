/* interfaccia tabella Adesione  */

export interface AdesioneInterface {

  id: number;
  cognome: string;
  nome: string;
  sesso: string;
  luogonascita: string;
  datanascita: string;
  residenza: string;
  indirizzo: string;
  email: string;
  telcasa: string;
  cell: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}


