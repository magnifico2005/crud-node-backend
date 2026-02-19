const db = require('../../config/db');

async function findAll() {
  const { rows } = await db.query(
    'SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function create({ name, email, password_hash }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at, password_hash`, 
    [name, email, password_hash]
  );
  return rows[0];
}

async function update(id, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${idx++}`);
    values.push(value);
  }

  fields.push(`updated_at = now()`);

  values.push(id);

  const { rows } = await db.query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = $${idx}
     RETURNING id, name, email, created_at, updated_at`,
    values
  );

  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove
};
