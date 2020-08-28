const express = require('express');
const router = express.Router();
const debug = require('debug')('app:routes-index');

router.get('/', (req, res) => {
	res.send("What?");
});

router.get('/tryme', (req, res) => {
	debug("the headers are: ", req.headers);
	res.send(req.isAuthenticated() ? "Yap" : "Nope");
});

module.exports = router;
