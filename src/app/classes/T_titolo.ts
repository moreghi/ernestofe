import { TtitoloInterface } from '../interfaces/t_titolo';


export class Ttitolo implements TtitoloInterface {

  id: number;
  d_titolo: string;
  tappo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.d_titolo = '';
    this.tappo = 'N';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}







