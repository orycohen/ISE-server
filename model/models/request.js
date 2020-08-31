const debug = require('debug')('app:model-request');
const mongo = require('mongoose');

module.exports = db => {
	let schema = mongo.Schema({
		accepted: { type: Boolean }
	});
	db.model('Request', schema, 'request');
	debug('Request model created');
}
