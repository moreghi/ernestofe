
/*  interfaccia per EventoFila  */


export interface EventoFilaInterface {

  id: number;
  stato: number;
  idEvento: number;
  idLogistica: number;
  idSettore: number;
  dfila: string;
  nposti: number;
  npostipren: number;
  nstart: number;
  nend: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
// campo derivato dalle relazioni
  dsettore: string;
}
