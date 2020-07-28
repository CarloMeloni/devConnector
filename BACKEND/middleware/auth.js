const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //GET TOKEN FROM THE HEADER
    const token = req.header('x-auth-token');

    //CHECK IF THERE IS NO TOKEN
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied man!' });
    }

    //VERIFY TOKEN 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid man!' });
    }
}

