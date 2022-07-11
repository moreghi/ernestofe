/* interfaccia tabella t_taglia_bigliettos  */

export class TtagliabigliettoInterface  {

  id: number;
  idtipotaglia: number;
  d_taglia: string;
  stato: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // relazioni
  d_stato_taglia_biglietto: string;

}
