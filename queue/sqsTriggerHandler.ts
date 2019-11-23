import {Queue} from './queue';

exports.handler = async (event) => {
    return Queue.handleMessages(event.body);
};