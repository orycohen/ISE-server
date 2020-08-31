const debug = require('debug')('app:model-needy');
const mongo = require('mongoose');

module.exports = db => {
    let schema = mongo.Schema({
        name: {type: String, required: true},
        coordinate: {type: {lat: Number, lng: Number}, required: true},
        phone: {type: String, required: true},
        age: {type: Number, required: true}
    });
    
    db.model('Needy', schema, 'needy');
    debug('Needy model created');
}
