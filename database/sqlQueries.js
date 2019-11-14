const { Pool, Client } = require('pg');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: '0.0.0.0',
  database: 'wave',
  password: 'password',
  port: 5432
});

// pool.on('connect', client => {
//   console.log('conneted to db');
// });

pool.on('error', client => {
  console.log(err);
});

module.exports = {
  getSong: (getSong = (req, res, cb) => {
    const songId = req.query.songId;
    const userId = req.query.userId || null;
    const songs = [];
    if (userId) {
      pool
        .query(
          `SELECT songs.songid, songlength, songfile, title, album, artistName, thumbnail, isliked FROM users, songs, songsLikes, artists WHERE songs.songId = ${songId} AND users.userId = ${userId} AND songs.artistId = artists.artistId AND users.userId = songsLikes.userId AND songs.songId = songsLikes.songId;`
        )
        .then(data => {
          const songData = data.rows[0];
          if (songData) {
            songs.push(songData);
            cb(`${songId}_${userId}`, JSON.stringify(songs));
            res.send(songs);
          } else {
            return pool.query(
              `SELECT songid, artistname, title, songlength, songfile, album, thumbnail FROM artists, songs WHERE songs.songId = ${songId} AND songs.artistId = artists.artistId`
            );
          }
        })
        .then(data => {
          if (data) {
            const songData = data.rows[0];
            songs.push(songData);
            cb(`${songId}_${userId}`, JSON.stringify(songs));
            res.send(songs);
          }
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    } else {
      pool
        .query(
          `SELECT songid, artistname, title, songlength, songfile, album, thumbnail FROM artists, songs WHERE songs.songId = ${songId} AND songs.artistId = artists.artistId`
        )
        .then(data => {
          const songData = data.rows[0];
          songs.push(songData);
          cb(songId, JSON.stringify(songs));
          res.send(songs);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  }),
  editSong: (editSong = (req, res) => {
    const songId = req.query.songId;
    const title = req.query.title;
    pool
      .query(`UPDATE songs SET title = '${title}' where songId = ${songId}`)
      .then(data => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  }),
  likeSong: (likeSong = (req, res) => {
    const songId = req.query.songId;
    const userId = req.query.userId;
    pool
      .query(
        `INSERT INTO songsLikes (userId, songId, isLiked) VALUES (${userId}, ${songId}, true)`
      )
      .then(data => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  }),
  dislikeSong: (dislikeSong = (req, res) => {
    const songId = req.query.songId;
    const userId = req.query.userId;
    pool
      .query(
        `DELETE FROM songsLikes WHERE songId = ${songId} AND userId = ${userId};`
      )
      .then(data => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  })
};

/*
Range: 9000000 - 10000000
EXPLAIN (ANALYZE, BUFFERS)

Getting one song:
SELECT * FROM artists, songs WHERE songs.songId = 10000000 AND songs.artistId = artists.artistId

Getting the like status of a song if user is logged in:
SELECT * FROM users, songs, songsLikes WHERE songs.songId = 8088479 AND users.userId = 900900 AND users.userId = songsLikes.userId AND songs.songId = songsLikes.songId;

Getting all the users' liked songs:
SELECT * FROM users, songs, songsLikes WHERE users.userId = 968900 AND users.userId = songsLikes.userId AND songs.songId = songsLikes.songId;

Add a like:
INSERT INTO songsLikes (userId, songId, isLiked) VALUES (972320, 9293256, true);

Delete a like:
DELETE FROM songsLikes WHERE songId = 9293256 AND userId = 972320;

Update a title:
UPDATE songs SET title = 'Hold On' where songId = 9334040;
*/
