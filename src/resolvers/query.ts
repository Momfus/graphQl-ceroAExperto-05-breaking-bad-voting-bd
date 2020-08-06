import { IResolvers } from 'graphql-tools';
import { getCharacters, getCharacter } from '../lib/database-operations';

const query: IResolvers = {
    Query: {
        
        async characters( _: void, __: any, { db } ) { // db sacado de server.ts que esta definido

            return await getCharacters(db);

        },

        async character( _: void,{ id }, { db } ) {

            return await getCharacter(db, id);

        }
    }
};

export default query;