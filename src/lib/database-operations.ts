
// Lista de personajes

import { COLLECTIONS } from "../config/constants";

export async function getCharacters( db: any )  {

    // Retornar las colecciones de characters de manera ascendente
    return await db.collection( COLLECTIONS.CHARACTERS ).find().sort( { id: 1 } ).toArray();

}


// Voto seleccionado
export async function getVote( db: any, id: string ) {

    return await db.collection(COLLECTIONS.VOTES).findOne({ id });

}


// Personaje seleccionado (solo uno)
export async function getCharacter( db: any, id: string ) {

    return await db.collection(COLLECTIONS.CHARACTERS).findOne({ id });

}


// Votos de un personaje
export async function getCharacterVotes( db: any, id: string ) {

    return await db.collection(COLLECTIONS.VOTES).find({ character: id }).count(); // Saber cuantos hay del id señalado

}

// Obtener el id del nuevo voto
export async function assignVoteId( db: any ) {

    const lastVotes = await db.collection( COLLECTIONS.VOTES )
                            .find().sort( { _id: -1 } ).limit(1).toArray() // Del orden de abajo hacia arriba

    if( lastVotes.length === 0 ){

        return "1";

    }

    return String( +lastVotes[0].id + 1 ); // Añadir su id un número superior al último que habia (siendo así único)

}