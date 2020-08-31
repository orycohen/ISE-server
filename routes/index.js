const express = require('express');
const router = express.Router();
const debug = require('debug')('app:routes-index');
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, 'hello' + 'file.png')
    }
});

var upload = multer();

router.get('/', (req, res) => {
	res.send("What?");
});

router.get('/tryme', (req, res) => {
	debug("the headers are: ", req.headers);
	res.send(req.isAuthenticated() ? "Yap" : "Nope");
});

router.post('/file', upload.single('image'), (req, res) => {
	debug(`file is:`, req.file);
	debug('body is:', req.body.name);
	res.send('Thank you!');
});

module.exports = router;
