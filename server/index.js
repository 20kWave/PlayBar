const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const cb = require('./routeCallbacks');

const app = express();
const port = 3020;

const jsonParser = bodyParser.json();

app.use(cors());

app.use('/songs/:id', express.static(path.join(__dirname, '../public')));

app.get('/song/:id', cb.getSong);

app.get('/playlist/:playlist', cb.getPlaylist);

app.post('/like/:songId', jsonParser, cb.likeEntry);

app.post('/playlist/:playlist', jsonParser, cb.playlistEntry);

app.listen(port);
