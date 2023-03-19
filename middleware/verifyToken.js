
const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    
    // const authHeader = req.headers.token;
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
            if (err) return res.status(403).json('Token not valid')
            req.user = user;         
            next();
        })
    }
    else {
        return res.status(401).json('your are not authorized')
    }
}
module.exports = verify;