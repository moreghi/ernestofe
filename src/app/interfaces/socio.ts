/* interfaccia tabella Socio  */

export interface SocioInterface {

  id: number;
  stato: number;
  cognome: string;
  nome: string;
  sesso: string;
  locNascita: number;
  luogonascita: string;
  datanascita: string;
  residenza: number;
  indirizzo: string;
  email: string;
  telcasa: string;
  cell: string;
  tessera: string;
  operativo: string;
  notesocio: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
	// campo derivato dalle relazioni
  d_stato_utente: string;
  localNascita: string;
  d_localita: string;
}
