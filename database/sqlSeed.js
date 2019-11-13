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
    `copy users (userName) from '${path.join(
      __dirname,
      "/../playbarCSV/usersSql.csv"
    )}' delimiter '|' CSV HEADER;`
  )
  .then(() => {
    console.log("inserting artists");
    return client.query(
      `copy artists (artistName) from '${path.join(
        __dirname,
        "/../playbarCSV/artistsSql.csv"
      )}' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songs");
    return client.query(
      `copy songs (songLength, songFile, title, artistId, album, thumbnail) from '${path.join(
        __dirname,
        "/../playbarCSV/songsSql.csv"
      )}' delimiter '|' CSV HEADER;`
    );
  })
  .then(() => {
    console.log("inserting songslikes");
    return client.query(
      `copy songslikes (userId, songId, isLiked) from '${path.join(
        __dirname,
        "/../playbarCSV/songsLikesSql.csv"
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
