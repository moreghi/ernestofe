import { TabellatwInterface } from '../interfaces/tabella_tw';


export class Tabellatw implements TabellatwInterface {

    id: number;
    idTab: number;
    nametab: string;
    numNew: number;
    numUpd : number;
    numDlt: number;
    key_utenti_operation: number;
    created_at: Date;
    updated_at: Date;

  constructor()  {

    this.id = 0;
    this.idTab = 0;
    this.nametab = '';
    this.numNew = 0;
    this.numUpd = 0;
    this.numDlt = 0;
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}
