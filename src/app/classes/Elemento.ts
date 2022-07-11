import { ElementoInterface } from '../interfaces/elemento';

export class Elemento implements ElementoInterface {

  id: number;
  idsettore: number;
  dsettore: string;
  delemento: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idsettore = 0;
    this.dsettore = '';
    this.delemento = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}


















