import { GraphQLSchema } from 'graphql';
import 'graphql-import-node';
// import typeDefs from './schema.graphql';
import resolvers from './../resolvers/resolversMap';
import { makeExecutableSchema } from 'graphql-tools';

import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typeDefs = mergeTypeDefs (loadFilesSync(path.join(__dirname, './**/*.graphql') ) ); // Hace referencia a cualqueir directorio de fichero con .graphql

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;