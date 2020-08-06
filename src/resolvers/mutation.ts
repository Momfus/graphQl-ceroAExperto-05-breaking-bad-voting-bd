
import { IResolvers } from 'graphql-tools';
import { getCharacter, getCharacters, assignVoteId, getVote } from '../lib/database-operations';
import { Datetime } from '../lib/datetime';
import { COLLECTIONS } from '../config/constants';

const mutation: IResolvers = {

    Mutation: {

        async addVote( _: void, { character }, { db } ) {

            // Comprobar que el personaje existe
            const selectCharacter = await getCharacter( db, character );
            
            if( selectCharacter === null || selectCharacter === undefined )  {

                return {

                    status: false,
                    message: 'El personaje introducido no existe y no puedes votar',
                    characters: await getCharacters( db )

                }

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
                    return {
        
                        status: true,
                        message: 'El personaje existe y se ha emitido correctamente',
                        characters: await getCharacters( db )
        
                    }

                }

            ).catch(

                // Capturar error
                async() => {
                    return {
        
                        status: false,
                        message: 'El voto NO se ha emitido. Prueba de nuevo.',
                        characters: await getCharacters( db )
        
                    }

                }

            )
            

        },

        async updateVote( _: void, {id, character }, { db } ) {

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

                return {

                    status: false,
                    message: 'El voto introducido no existe y no puedes actualizar',
                    characters: await getCharacters( db )

                }

            }

            // Actualizar el voto después de comprobar
            return await db.collection( COLLECTIONS.VOTES ).updateOne(

                { id },
                {
                    $set: { character }
                }

            ).then( // Caso satisfactorio

                async() => {
                    return {

                        status: true,
                        message: 'Voto actualizado correctamente',
                        characters: getCharacters(db)

                    }
                }

            ).catch( // Caso falso

                async() => {
                    return {

                        status: false,
                        message: 'Voto NO actualizado. Prueba de nuevo',
                        characters: getCharacters(db)

                    }
                }

            )

        },

        async deleteVote( _: void, { id }, { db } ) {

            // Comprobar que el voto existe
            const selectVote = await getVote( db, id );
            
            if( selectVote === null || selectVote === undefined )  {

                return {

                    status: false,
                    message: 'El voto introducido no existe y no puedes borrarlo',
                    characters: await getCharacters( db )

                }

            }


            // Si existe, borrarlo
            return await db.collection( COLLECTIONS.VOTES ).deleteOne( { id } )
                .then( // Respuesta satisfactoria

                    async() => {
                        return {
                            status: true,
                            message: 'Voto borrado correctamente',
                            characters: getCharacters( db )
                        }
                    }

                ).catch( // En caso de error

                    async() => {
                        return {
                            status: false,
                            message: 'Voto NO borrado. Inténtelo de nuevo',
                            characters: getCharacters( db )
                        }
                    }

                );

        }

    }

};

export default mutation;