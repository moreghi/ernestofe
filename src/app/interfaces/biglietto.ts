/* interfaccia tabella Biglietto  */

export interface BigliettoInterface {

    id: number;
    evento: number;
    idprenotazione: number;
    stato: number;
    tipo: number;
    numero: number;
    importo: number;
    cognome: string;
    nome: string;
    email: string;
    cellulare: string;
    datapre: string;
    dataconf: string;
    dataemi: string;
    settore: number;
    fila: number;
    posto: number;
    modpag: number;
    key_utenti_operation: number;
    created_at: Date;
    updated_at: Date;

  }



