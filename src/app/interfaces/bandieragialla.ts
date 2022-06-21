/* interfaccia tabella Bandieragialla  */

export interface BandieragiallaInterface {

  id: number;
  nomeassociazione: string;
  email: string;
  indirizzo: string;
  telefono: string;
  cellulare: string;
  codfisc: string;
  piva: string;
  iban: string;
  banca: string;
  ultimaTessera: number;
  costoTessera: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
