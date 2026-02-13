const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const usersRoutes = require('./modules/users/user.routes');
const authRoutes = require('./modules/auth/auth.routes')
const notFound = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const auth = require('./middlewares/auth.middleware');


const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Ajuste origin para o seu frontend (Quasar), ex: http://localhost:9000
app.use(cors({
  origin: ['http://localhost:9000', 'http://localhost:3000'],
  credentials: true
}));


app.get('/api/me', auth , (req, res) => {
res.json({user: req.user });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
