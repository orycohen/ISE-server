const debug = require('debug')('app:model-needyRequest');
const mongo = require('mongoose');

module.exports = db => {
	let schema = mongo.Schema({
		name: {type: String, required: true},
		coordinate: {type: {lat: Number, lng: Number}, required: true},
		phone: {type: String, required: true},
		age: {type: Number, required: true},
		accepted: {type: Boolean},
		requestType: {type: String}
	});
	schema.pre('save', function(next) {
		debug('here', this.isNew);
		if (this.isNew) {
			this.accepted = false;
			this.requestType = 'Needy';
		}
		next();
	});
	db.model('NeedyRequest', schema, 'request');
	debug('NeedyRequest model created');
}
