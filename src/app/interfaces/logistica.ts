/*  interfaccia per logistica  */


export interface LogisticaInterface {

  id: number;
  stato: number;
  localita: string;
  luogo: string;
  photo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // campo derivato dalla relazione con tabella t_stato_manifestazione
  d_stato_logistica: string;


}
