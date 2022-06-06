/* interfaccia tabella Bandieragialla  */

export interface BandieragiallaInterface {

  id: number;
  nomeAssociazione: string;
  anno: number;
  ultimaTessera: number;
  costoTessera: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


}
