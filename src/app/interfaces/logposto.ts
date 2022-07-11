
/*  interfaccia per logPosto  */


export interface LogPostoInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
