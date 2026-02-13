const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const env = require('../../config/env');
const repo = require('./auth.repository');
const { error } = require('console');


function httpError(statusCode , code, message){
    const err = new Error(message);
    err.statusCode = statusCode;
    err.code = code;
    return err;
}

function singAccessToken(user){
    const secret = process.env.JWT_ACESS_SECRET;
    if(!secret) throw new error('Erro com a chave secreta, o que esta vindo é : ', secret )

        const expiresIn = process.env.JWT_ACESS_SECRET || '15M';

        return jwt.sign(
            { sub: String(user.id), role: user.role || 'user'} ,
            secret,
            {expiresIn}
        );
}

function makeRefreshToken(){
    // token aleatorio
    return crypto.randomBytes(48).toString('base64url');
}

function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshExpiriesAt(){
    const days = Number(process.env.REFRESH_TOKEN_EXPIRIES_DAYS || 7);
    const ms = days * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms);
}

async function login({email, password}) {
    const user = await repo.findUserByEmail(email);
    if(!user) throw httpError(401, 'INVALID_CREDENTIALS', 'tente novamente');

    if(!user.is_active === false){
        throw httpError(403, 'USER_DISABLED', 'Entre em contato com administradores')
    }
    
    if(!user.password_hash){
        throw httpError(400, 'PASSWORD_NOT_SET', 'Usuário sem senha , solicite recuperação de senha')
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) throw httpError(401 , 'INVALID_CREDENTIALS', 'email e ou senha inválidos')


    const acessToken = signAccesToken(user);
    
    const refreshToken = makeRefreshToken();

    const tokenHash = hashToken( refreshToken);

    const expiresAt = refreshExpiresAt();
    const saved = await repo.insertRefreshToken({
        userId: user.id,
        tokenHash,
        expiresAt
    });

    return {
        acessToken,
        refreshToken,
        refreshTokenId: saved.id,
        user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user'}
    };
}

async function refresh(refreshToken) {
    if (!refreshToken) throw httpError(401, 'MISSING_REFRESH_TOKEN', 'Refresh token ausente' );

    const tokenHash = hasToken(refreshToken);
    const rt = await repo.findValidrefreshToken(tokenHash);
    if (!rt)  throw httpError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token inválido');

    const user = await repo.findUserById(rt.user.id);
    if(!user) throw httpError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token inválido') ;
    if(user.is_active === false) throw httpError(403, 'USER_DISABLED', 'Usuário desativado');


    // rota revoga o token atual e emite um novo


    await repo.revokedRefreshToken(rt.id);


    const  newRefreshToken = makeRefreshToken();
    const newHash = hashToken(newRefreshToken);
    const expiresAt = refreshExpiriesAt();

    await repo.insertRefreshToken(
        {
            userId: user.id,
            tokenHash : newHash,
            expiresAt
        }
    )

    const accesToken = singAccessToken(user);

    return {
        acessToken,
        refreshToken : newRefreshToken,
        user: {id: user.id, name: user.name, email: user.email, role: user.role || 'user'}
    };
}
   async function logout(refreshToken) {
    if (!refreshToken) return;
    
    const tokenHash = hashToken(refreshToken);
    const  rt = await repo.findValidRefreshToken(tokenHash);
    if( rt ) await repo.revokedRefreshToken(rt.id);
   }


    module.exports = { login, refresh , logout };

    
