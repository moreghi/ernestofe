
/*  interfaccia per EventoSettFilaPostiInterface {
  */


export interface EventosettfilapostiInterface {

  id: number;  // è idLogistica
  stato: number;
  idEvento: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  postoStart: number;
  postoEnd: number;
  utilizzo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
