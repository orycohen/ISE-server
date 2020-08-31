const express = require('express');
const router = express.Router();
const debug = require('debug')('app:routes-api');
const Needy = require('../model')('Needy');
const NeedyRequest = require('../model')('NeedyRequest');
const Request = require('../model')('Request');
const middleware = require('../middleware');

router.get('/', (req, res) => {
	debug(req.user.type);
	res.send("What?");
});

router.post('/request-needy', middleware.checkAuthenticated, async (req, res) => {
	debug(`needy got: `, req.body);
	await NeedyRequest.create(req.body);
	res.send('Thank you');
});

router.post('/add-needy', middleware.checkIsManager, async (req, res) => {
	debug(`needy got: `, req.body);
	await Needy.create(req.body);
	if (!req.body.fromRequest) {
		return res.send('Thank you');
	}
	else {
		NeedyRequest.findById(req.body.id, (err, needyReq) => {
			needyReq.accepted = true;
			needyReq.save().then(() => res.send('Thank you'));
		});
	}
});

router.get('/all-needies', middleware.checkIsManager, async (req, res) => {
	const needies = await Needy.find({});
	res.send(needies);
});

router.get('/requests', middleware.checkIsManager, async (req, res) => {
	const reqs = await Request.find({accepted: false});
	res.send(reqs);
});

module.exports = router;
