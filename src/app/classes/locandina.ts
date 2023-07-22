import { LocandinaInterface } from '../interfaces/locandina';

export class Locandina implements LocandinaInterface {

id: number;
stato: number;
idManif: number;
idEvento: number;
photo: string;
key_utenti_operation: number;
created_at: Date;
updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idManif = 0;
    this.idEvento = 0;
    this.photo = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}











