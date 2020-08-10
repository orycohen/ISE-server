const debug = require('debug')('app:model-session-user');
const mongo = require('mongoose');

module.exports = db => {
    let schema = mongo.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        type: {type: String, required: true}
    });
    
    db.model('User', schema, 'users');
    debug('User model created');
}
