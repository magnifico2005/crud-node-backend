const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const usersRoutes = require('./modules/users/user.routes');
const notFound = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', usersRoutes);

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
