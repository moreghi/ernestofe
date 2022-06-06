import { TruoloInterface } from '../interfaces/t_ruolo';


export class Truolo implements TruoloInterface {

  id: number;
  d_ruolo: string;
  tappo: string;
  key_utenti_operation: number;
  created_at:	Date;
  updated_at:	Date;

  constructor()  {

    this.id = 0;
    this.d_ruolo = '';
    this.tappo = 'N';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}
