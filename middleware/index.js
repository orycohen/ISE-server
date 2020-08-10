const jwt = require('jsonwebtoken');

module.exports = {
    checkAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        res.redirect('/login')
    },
    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    },
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.sendStatus(401);
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    }
}
