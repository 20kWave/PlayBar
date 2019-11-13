const { Pool, Client } = require("pg");
const path = require("path");

const client = new Client({
  user: "postgres",
  host: "13.57.239.222",
  database: "wave",
  password: null,
  port: 5432
});

client.connect();

client
  .query(
    `copy users (userName) from '${path.join(
      __dirname,
      "/usersSql.csv"
    )}' delimiter '|' CSV HEADER;`
  )
  .then(() => {
    console.log("inserting artists");
    return client.query(
      `copy artists (artistName) from '${path.join(
        __dirname,
        "/artistsSql.csv"
      )}' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songs");
    return client.query(
      `copy songs (songLength, songFile, title, artistId, album, thumbnail) from '${path.join(
        __dirname,
        "/songsSql.csv"
      )}' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songslikes");
    return client.query(
      `copy songslikes (userId, songId, isLiked) from '${path.join(
        __dirname,
        "/songsLikesSql.csv"
      )}' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("success!");
    client.end();
  })
  .catch(err => {
    console.log(err);
  });
