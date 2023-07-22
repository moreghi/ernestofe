/*  interfaccia per manifestazione  */


export interface ManifestazioneInterface {

    id: number;
    descManif: string;
    anno: number;
    dtInizio: string;
    dtFine: string;
    numUtentiTot: number;
    incassatoTot: number;
    photo: string;
    noteManifestazione: string;
    stato: number;
    key_utenti_operation: number;
    created_at: Date;
    updated_at: Date;
    // campo derivato dalla relazione con tabella t_stato_manifestazione
    d_stato_manifestazione: string;

  }
