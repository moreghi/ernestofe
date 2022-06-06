/* interfaccia tabella t_localita  */

export interface TlocalitaInterface {

  id: number;
  d_localita: string;
  cap: string;
  pr: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
