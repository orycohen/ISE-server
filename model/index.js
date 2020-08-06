const mongo = require('mongoose');
const debug = require('debug')('app:model-index');

let db = mongo.createConnection();
const mongoUri = process.env['MONGO_URI'];

(async () => {
    try {
        db.openUri(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    } catch (error) {
        debug(`error while connecting to the database: ${error}`);
    }
})();

require('./models/user')(db);

module.exports = model => db.model(model);
