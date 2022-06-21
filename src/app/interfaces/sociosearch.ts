/* interfaccia tabella SocioSearch  */

export interface SocioSearchInterface {

  id: number;
  d_search: string;
  stato: number;
  tessere: string;
  localita: number;
  operativo: string;
  sesso: string;
  email: string;
  cell: string;
  orderby: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
