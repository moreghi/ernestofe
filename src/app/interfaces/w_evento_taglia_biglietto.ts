/* interfaccia tabella t_taglia_bigliettos  */

export class wEventoTagliaBigliettoInterface  {

  id: number;
  idEvento: number;
  d_taglia: string;
  importo: number;
  nbiglietti: number;
  stato: number;
  flagpu: string;
  tagliaUser: string;
  serie: string;
  ultimoemesso: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


}

