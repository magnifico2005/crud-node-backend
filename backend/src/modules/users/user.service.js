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
  return repo.create(data);
}

async function updateUser(id, data) {
  const current = await repo.findById(id);
  if (!current) throw httpError(404, 'USER_NOT_FOUND', 'User not found');

  if (data.email && data.email !== current.email) {
    const exists = await repo.findByEmail(data.email);
    if (exists) throw httpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
  }

  const updated = await repo.update(id, data);
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
