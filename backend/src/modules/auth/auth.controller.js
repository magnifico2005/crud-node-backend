const {loginSchema } =  require('./auth.schema');

const service = require('./auth.service');

function cookieOptions(){
    const secure = ( process.env.COOKIE_SEDCURE || 'false' )  === 'true';
    const sameSite = process.env.COOKIE_SAMESITE || 'LAX';


    return {

        httpOnly: true,
        secure, 
        sameSite,
        path : '/api/auth',

        // maxAge alinhado aos dias do refresh


        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRIES_DAYS || 7) * 24 * 60 * 1000
    };
}

async function login(req, res, next) {
    try{

        console.log('content-type:', req.headers['content-type']);
console.log('body:', req.body);
        const data = loginSchema.parse(req.boty);
        const result = await service.login(data);

        //refresh token vai em cookie httpOnly

        res.cookie('refresh_token', result.refreshToken, cookieOptions());

        //acess token vai no body (frontend guarda na memória)

        res.json({
            accessToken: result.accessToken,
            user: result.user
        });        
    
    } catch (e) {
        next(e);
}
}

async function refresh(req, res, next ) {
    try{

        const refreshToken = req.cookie.refresh_token;

        const result = await service.refreshToken(refreshToken);


        // rotaciona cookie

        res.cookie('refrech_token', result.refreshToken, cookieOptions());

        res.json({
            accessToken : result.accessToken,
            user: result.user
        })
    } catch (e) {
        next(e);
    }
    
}

async function logout(req, res, next) {
    try{
        const refreshToken = req.cookie.refresh.token;
        await service.logout(refreshToken);

        res.clearCookie ('refresh_token', {path: '/api/auth'});
        res.status(204).send();
    } catch (e) {
        next(e);
    }
    
}


module.exports = { login, refresh, logout};