import { AdesioneConfirmInterface } from '../interfaces/adesioneConfirm';

export class AdesioneConfirm implements AdesioneConfirmInterface {

  id: number;
  cognome: string;
  nome: string;
  sesso: string;
  luogonascita: string;
  datanascita: string;
  residenza: string;
  indirizzo: string;
  email: string;
  telcasa: string;
  cell: string;
  operativo: string;
  token: string;
  codade: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
        this.id = 0;
        this.cognome = '';
        this.nome = '';
        this.sesso = '';
        this.luogonascita = '';
        this.datanascita = '';
        this.residenza = '';
        this.indirizzo = '';
        this.email = '';
        this.telcasa = '';
        this.cell = '';
        this.operativo = '';
        this.token = '';
        this.codade = '';
        this.key_utenti_operation = 0;
        this.created_at  = new Date();
        this.updated_at = new Date();


  }
}

