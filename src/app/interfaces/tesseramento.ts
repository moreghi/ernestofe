/* interfaccia tabella Tesseramento  */

export interface TesseramentoInterface {

  id: number;
  idSocio: number;
  idTessera: string;
  stato: number;
  anno: number;
  dataiscr: string;
  importo: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
