import { TabellatInterface } from '../interfaces/tabella_t';


export class Tabellat implements TabellatInterface {

    id: number;
    nametab: string;
    d_tabella: string;
    tipo: string;
    fatto: string;
    key_utenti_operation: number;
    created_at: Date;
    updated_at: Date;

  constructor()  {

    this.id = 0;
    this.nametab = '';
    this.d_tabella = '';
    this.tipo = '';
    this.fatto = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}
