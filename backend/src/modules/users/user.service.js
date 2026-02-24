const bcrypt = require('bcrypt');
const repo = require('./user.repository');

function httpError(statusCode, code, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

async function listUsers() {
  return repo.findAll();
}

async function getUser(id) {
  const user = await repo.findById(id);
  if (!user) throw httpError(404, 'USER_NOT_FOUND', 'User not found');
  return user;
}

async function createUser(data) {
  const exists = await repo.findByEmail(data.email);
  if (exists) throw httpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
  const password_hash = await bcrypt.hash(data.password, 10);
  const created = await repo.create({
    name: data.name,
    email: data.email,
    password_hash
  });
  return created;
}

async function updateUser(id, data) {
  const current = await repo.findById(id);
  if (!current) throw httpError(404, 'USER_NOT_FOUND', 'User not found');

  if (data.email && data.email !== current.email) {
    const exists = await repo.findByEmail(data.email);
    if (exists) throw httpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
  }

  const payload = { ...data };
  if (payload.password) {
    payload.password_hash = await bcrypt.hash(payload.password, 10);
    delete payload.password;
  }
  if (payload.roles && !payload.role) {
    payload.role = payload.roles;
    delete payload.roles;
  }

  const updated = await repo.update(id, payload);
  return updated;
}

async function deleteUser(id) {
  const ok = await repo.remove(id);
  if (!ok) throw httpError(404, 'USER_NOT_FOUND', 'User not found');
  return true;
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
