/* interfaccia tabella Adesione_Confirmed  */

export interface AdesioneConfirmInterface {

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
  operativo: string;
  token: string;
  codade: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}



