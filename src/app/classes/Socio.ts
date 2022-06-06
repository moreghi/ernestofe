import { SocioInterface } from '../interfaces/socio';

export class Socio implements SocioInterface {

  id: number;
  stato: number;
  cognome: string;
  nome: string;
  sesso: string;
  locNascita: number;
  luogonascita: string;
  datanascita: string;
  residenza: number;
  indirizzo: string;
  email: string;
  telcasa: string;
  cell: string;
  tessera: string;
  operativo: string;
  notesocio: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
	// campo derivato dalle relazioni
  d_stato_utente: string;
  localNascita: string;
  d_localita: string;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.cognome = '';
    this.nome = '';
    this.sesso = '';
    this.locNascita = 0;
    this.luogonascita = '';
    this.datanascita = '';
    this.residenza = 0;
    this.indirizzo = '';
    this.email = '';
    this.telcasa = '';
    this.cell = '';
    this.tessera = '';
    this.notesocio = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();
     // campo derivato dalle relazioni
    this.d_stato_utente = '';
    this.localNascita = '';
    this.d_localita = '';

  }
}
