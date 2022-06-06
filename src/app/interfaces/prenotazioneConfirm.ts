/*  interfaccia per prenotazione_Confirm  */


export interface PrenotazioneConfirmInterface  {

    id: number;
    cognome: string;
    nome: string;
    telefono: string;
    email: string;
    password: string;
    idgiornata: number;
    datapren: string;
    persone: number;
    token: string;
    codpren: string;
    created_at: Date;
    updated_at: Date;

   }
