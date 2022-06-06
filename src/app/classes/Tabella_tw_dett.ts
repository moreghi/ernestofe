import { TabellatwDettInterface } from '../interfaces/tabella_tw_dett';


export class TabellatwDett implements TabellatwDettInterface {

    id: number;
    idtab: number;
    idtabella: number;
    descrizione: string;
    stato: string;
    tappo: string;
    key_utenti_operation: number;
    created_at: Date;
    updated_at: Date;

  constructor()  {

    this.id = 0;
    this.idtab = 0;
    this.idtabella = 0;
    this.descrizione = '';
    this.stato = '';
    this.tappo = 'N';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}
