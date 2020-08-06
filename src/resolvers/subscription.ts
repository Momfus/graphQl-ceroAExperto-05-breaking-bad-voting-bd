import { IResolvers } from 'graphql-tools';
import { CHANGE_VOTES } from '../config/constants';

const subscription: IResolvers = {
    Subscription: {

        changeVotes: {

            subscribe: ( _: void, __: any, { pubsub } ) => {

                // Obtener la información del evento que se quiere saber los cambios    
                return pubsub.asyncIterator(CHANGE_VOTES);

            }

        }

    }
};

export default subscription;