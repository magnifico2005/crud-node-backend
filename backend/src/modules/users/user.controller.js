const { createUserSchema, updateUserSchema } = require('./user.schema');
const service = require('./user.service');

function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    err.code = 'INVALID_ID';
    throw err;
  }
  return id;
}

async function list(req, res, next) {
  try {
    const users = await service.listUsers();
    res.json(users);
  } catch (e) { next(e); }
}

async function get(req, res, next) {
  try {
    const id = parseId(req);
    const user = await service.getUser(id);
    res.json(user);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await service.createUser(data);
    res.status(201).json(user);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const id = parseId(req);
    const data = updateUserSchema.parse(req.body);
    const user = await service.updateUser(id, data);
    res.json(user);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req);
    await service.deleteUser(id);
    res.status(204).send();
  } catch (e) { next(e); }
}

module.exports = { list, get, create, update, remove };
