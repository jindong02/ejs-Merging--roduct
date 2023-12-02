const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const {
  allDatabaseScanningFunction,
} = require('./middlewares/scanningDatabase');
require('dotenv').config();

global.siteSettings = {
  autoPromote: true,
};

const router = require('./routes');
const passportMiddleware = require('./middlewares/passport');
const { connectToMonero, connectToWallet, getAccount } = require('./monero');
const { escrowService } = require('./monero/Escrow');

const appSetup = async () => {
  console.log('Connecting to database...');

  await mongoose.connect('mongodb://localhost:27017/project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to database');
  console.log('Connecting to Monero Wallet RPC...');

  const walletRpc = await connectToMonero({
    address: 'http://localhost:28081',
    username: 'rpc_user',
    password: 'rpc_pass',
  });

  console.log('Connected to Monero Wallet RPC');

  const wallet = await connectToWallet({
    walletRpc,
    name: 'test_wallet',
    pass: 'test_wallet_pass',
  });

  const account = await getAccount({
    walletRpc,
  });

  escrowService.setUpEscrow(walletRpc, wallet, account);

  allDatabaseScanningFunction();

  passportMiddleware(passport);

  const app = express();

  app.set('view engine', 'ejs');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));
  app.use(express.static(`${__dirname}/public`));
  app.use(express.static(`${__dirname}/uploads`));

  app.use(
    session({
      secret: process.env.SESSION_SECRET
        ? process.env.SESSION_SECRET
        : 'secret',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 5400000 }, // 1.5 hours
    }),
  );
  // FLASH MIDDLEWARE
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.authuser = req.user;
    res.locals.query = req.query;
    const splitedUrl = req.url.split('?');
    res.locals.url = splitedUrl;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
  });

  app.use(router);

  app.all('*', (req, res) => {
    res.render('Pages/docsErrorPages/404');
  });

  app.listen('3000', () => {
    console.log('Server running on port 3000');
  });
};

appSetup();
