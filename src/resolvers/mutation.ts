
import { IResolvers } from 'graphql-tools';
import { getCharacter, getCharacters, assignVoteId, getVote } from '../lib/database-operations';
import { Datetime } from '../lib/datetime';
import { COLLECTIONS, CHANGE_VOTES } from '../config/constants';

// Obtener todos los personajes
async function response( status: boolean, message: string, db: any ) {

    return {

        status, // igual qeu hacer status: status (se llama igual el atributo que el argumento)
        message,
        characters: await getCharacters( db )

    }
}

async function sendNotification( pubSub: any, db: any ) {

    // Se decide que evento a publicar para estar pendiente
    pubSub.publish( CHANGE_VOTES, { changeVotes: await getCharacters(db) } )

}

const mutation: IResolvers = {

    Mutation: {

        async addVote( _: void, { character }, { pubsub, db } ) {

            // Comprobar que el personaje existe
            const selectCharacter = await getCharacter( db, character );
            
            if( selectCharacter === null || selectCharacter === undefined )  {

                return response(false, 'El personaje introducido no existe y no puedes votar', db);

            }

 
            // Obtener id del voto
            const vote = {
                id: await assignVoteId(db),
                character,
                createdAt : new Datetime().getCurrentDateTime()
            };

            // En caso de existir
            return await db.collection( COLLECTIONS.VOTES ).insertOne(vote).then(

                // Añadir a la colección el nuevo voto
                async() => {
                    sendNotification( pubsub, db )
                    return response(true, 'El personaje existe y se ha emitido correctamente', db)
                }

            ).catch(

                // Capturar error
                async() => {
                    return response( false, 'El voto NO se ha emitido. Prueba de nuevo.', db );

                }

            )
            

        },

        async updateVote( _: void, {id, character }, { pubsub, db } ) {

            // Comprobar que el personaje existe
            const selectCharacter = await getCharacter( db, character );
            
            if( selectCharacter === null || selectCharacter === undefined )  {

                return {

                    status: false,
                    message: 'El personaje introducido no existe y no puedes actualizar el voto',
                    characters: await getCharacters( db )

                }

            }

            // Comprobar que el voto existe
            const selectVote = await getVote( db, id );
            
            if( selectVote === null || selectVote === undefined )  {

                return response(false, 'El voto introducido no existe y no puedes actualizar', db);

            }

            // Actualizar el voto después de comprobar
            return await db.collection( COLLECTIONS.VOTES ).updateOne(

                { id },
                {
                    $set: { character }
                }

            ).then( // Caso satisfactorio

                async() => {
                    sendNotification( pubsub, db )
                    return response(true, 'Voto actualizado correctamente', db);
                }

            ).catch( // Caso falso

                async() => {
                    return response( false, 'Voto NO actualizado. Prueba de nuevo', db );
                }

            )

        },

        async deleteVote( _: void, { id }, { pubsub, db } ) {

            // Comprobar que el voto existe
            const selectVote = await getVote( db, id );
            
            if( selectVote === null || selectVote === undefined )  {

                return response( false, 'El voto introducido no existe y no puedes borrarlo', db );

            }


            // Si existe, borrarlo
            return await db.collection( COLLECTIONS.VOTES ).deleteOne( { id } )
                .then( // Respuesta satisfactoria

                    async() => {
                        sendNotification( pubsub, db )
                        return response(true, 'Voto borrado correctamente', db);
                    }

                ).catch( // En caso de error

                    async() => {
                        return response(false, 'Voto NO borrado. Inténtelo de nuevo', db);
                    }

                );

        }

    }

};

export default mutation;