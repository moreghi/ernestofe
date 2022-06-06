import { MsgpopupInterface } from '../interfaces/msgpopup';

export class Msgpopup implements MsgpopupInterface {

  id: number;
  header: string;
  cls: string;
  txt01: string;
  txt02: string;
  txt03: string;


  constructor()  {

    this.id = 0;
    this.header = '';
    this.cls = '';
    this.txt01 = '';
    this.txt02 = '';
    this.txt03 = '';


  }

}
