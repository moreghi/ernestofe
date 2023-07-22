/* interfaccia tabella comunicatos  */

export interface ComunicatoInterface {

  id: number;
  titolo: string;
  stato: number;
  dataStart: string;
  dataEnd: string;
  dayValidity: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

