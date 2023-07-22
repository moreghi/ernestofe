import { W_Prenotazevento_masterInterface } from './../interfaces/w_prenotazevento_master';

export class W_Prenotazevento_master implements W_Prenotazevento_masterInterface {

  id: number;
  descEvento: string;
  dataEvento: string;
  oraEvento: string;
  datapren: string;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  token: string;
  importo: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
        this.id = 0;
        this.descEvento = '';
        this.dataEvento = '';
        this.oraEvento = '';
        this.datapren = '';
        this.cognome = '';
        this.nome = '';
        this.telefono = '';
        this.email = '';
        this.token = '';
        this.importo = 0;
        this.created_at = new Date();
        this.updated_at = new Date();

  }
}
