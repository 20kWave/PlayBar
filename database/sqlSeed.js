const { Pool, Client } = require("pg");
const path = require("path");

const client = new Client({
  user: "postgres",
  host: "0.0.0.0",
  database: "wave",
  password: "password",
  port: 5432
});

client.connect(err => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("db connected");
  }
});

client
  .query(
    `copy users (userName) from '/tmp/pgcsv/usersSql.csv' delimiter '|' CSV HEADER;`
  )
  .then(() => {
    console.log("inserting artists");
    return client.query(
      `copy artists (artistName) from '/tmp/pgcsv/artistsSql.csv' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songs");
    return client.query(
      `copy songs (songLength, songFile, title, artistId, album, thumbnail) from '/tmp/pgcsv/songsSql.csv' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songslikes");
    return client.query(
      `copy songslikes (userId, songId, isLiked) from '/tmp/pgcsv/songsLikesSql.csv' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("success!");
    client.end();
  })
  .catch(err => {
    console.log(err);
  });
