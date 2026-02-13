const jwt = require('jsonwebtoken');


module.exports = ( req, res, next) => {
    try{

        const reader = req.header.authorization || '';
        const [type, token ] = header.split(' ');

        if(type !== 'Bearer ' || !token){
            return res.status(401).json({error: 'UNAUTHORIZED', message : 'Token ausente '});
        }

          const secret = process.env.JWT_ACCESS_SECRET;
          const payload = jwt.verify(token, secret);

          req.user  = {
                id: Number(payload.sub),
                role: payload.role
          };

          next();

    } catch (e) {
            return res.status(401).json({error: 'UNAUTHORIZED', message: 'Token inválido'});
    }
};