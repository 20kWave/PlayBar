require('newrelic');

const Promise = require('bluebird');
const express = require('express');
const path = require('path');
const compression = require('compression');
const db = require('./../database/sqlQueries');
let redis = require('redis');
redis = Promise.promisifyAll(redis);

const client = redis.createClient({
  port: 6379,
  host: '0.0.0.0'
});

client.on('ready', () => console.log('redis connected'));

client.on('error', err => {
  console.log('err', err);
});

const app = express();
const port = 3020;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }

  return compression.filter(req, res);
};

app.use(compression({ filter: shouldCompress }));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/songs/:id', express.static(path.join(__dirname, '../public')));
app.use(
  '/loaderio-e7c99a3e0d1fea4258c07b87eeba2ad1/',
  express.static(
    path.join(__dirname, '../loaderio-e7c99a3e0d1fea4258c07b87eeba2ad1.txt')
  )
);

const cacheSong = (key, val) => {
  client.set(key, val, 'EX', 3600);
};

app.get(
  '/playbar/song',
  (getSong = (req, res) => {
    const songId = req.query.songId;
    const userId = req.query.userId || null;
    const cacheId = req.query.userId ? `${songId}_${userId}` : songId;
    client
      .getAsync(cacheId)
      .then(data => {
        if (data) {
          data = JSON.parse(data);
          res.send(data);
        } else {
          db.getSong(req, res, cacheSong);
        }
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  })
);

app.put('/playbar/song', (req, res) => {
  db.editSong(req, res);
});

app.post(
  '/playbar/like',
  (addLike = (req, res) => {
    db.likeSong(req, res);
  })
);

app.delete('/playbar/like', (req, res) => {
  db.dislikeSong(req, res);
});

app.listen(port, () => {
  console.log('server connected');
});
