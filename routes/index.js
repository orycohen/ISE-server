const express = require('express');
const router = express.Router();
const debug = require('debug')('app:routes-index');

router.get('/', (req, res) => {
	var p = require('path').join(__dirname, '..', 'build', 'index.html');
	debug(`That is ${p}`);
  res.sendFile(p);
});

router.get('/tryme', (req, res) => {
	debug("the headers are: ", req.headers);
	res.send(req.isAuthenticated() ? "Yap" : "Nope");
});

module.exports = router;
