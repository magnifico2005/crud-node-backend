const db = require('../../config/db');

async  function findUserByEmail(email) {
    const { rows }  = await db.query(
        'select id, name, email, password_hash, role is_active from users where email = $1', [email]
    );
    return rows[0] || null;
}

async function findUserById(id) {
    const { rows } = await db.query(
        'select id, name, email, password_hash, role, is_active from users where id = $1', [id]
    );
    return rows[0] || null;
}

async function insertRefreshToken(userId, tokenHash, expiresAt) {
    const { rows } = await db.query(
        `INSERT INTO refresh_tokens ( user_id, token_hash, expires_at)
        VALUES ($1, $2 , $3)
        RETURNING id` )

        return rows[0] || null;
    
}

async function findValidRefreshToken(tokenHash) {
    const [ rows ]  = await db.query(
        `SELECT id, user_id, expires_at, revoked_at from refresh_tokens where token_hash = $1`, [tokenHash]
    );

    const rt = rows[0] || null;
    if (!rt) return null;
    if ( rt.revoked_at) return null;
    if (new Date(rt.expires_at).getTime() <= Date.now()) return null;

    return rt;
}

async function revokedRefreshToken(id) {
    await db.query(
        'UPDATE refresh_tokens set revoked_at = now whre id = $1' [id]


    );
}

module.exports = {
    findUserByEmail,
    findUserById,
    insertRefreshToken,
    findValidRefreshToken: findValidRefreshToken,
    revokedRefreshToken
};
