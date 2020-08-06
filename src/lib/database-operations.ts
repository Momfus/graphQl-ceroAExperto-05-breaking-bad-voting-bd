
// Lista de personajes

import { COLLECTIONS } from "../config/constants";

export async function getCharacters( db: any )  {

    // Retornar las colecciones de characters de manera ascendente
    return await db.collection( COLLECTIONS.CHARACTERS ).find().sort( { id: 1 } ).toArray();

}


// Personaje seleccionado (solo uno)
export async function getCharacter( db: any, id: string ) {

    return await db.collection(COLLECTIONS.CHARACTERS).findOne({ id });

}


// Votos de un personaje
export async function getCharacterVotes( db: any, id: string ) {

    return await db.collection(COLLECTIONS.VOTES).find({ character: id }).count(); // Saber cuantos hay del id señalado

}