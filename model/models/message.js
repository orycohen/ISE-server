const debug = require('debug')('app:model-messages');
const mongo = require('mongoose');

module.exports = db => {
    let schema = mongo.Schema({
        addressee: {type: String, required: true},
        content: {type: String, required: true},
        date: {type: Date, required: true},
        was_read: {type: Boolean, required: true}
    });
    
    db.model('Message', schema, 'messages');
    debug('Message model created');
}
