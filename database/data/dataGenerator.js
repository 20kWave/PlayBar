const Promise = require("bluebird");
const faker = require("faker");
const fs = Promise.promisifyAll(require("fs"));
const allSongs = require("./songs.json");

const writeUsers = fs.createWriteStream("usersSql.csv");
const writeArtists = fs.createWriteStream("artistsSql.csv");
const writeSongs = fs.createWriteStream("songsSql.csv");
const writeSongsLikes = fs.createWriteStream("songsLikesSql.csv");

writeUsers.write("userName\n", "utf8");
writeArtists.write("artistName\n", "utf8");
writeSongs.write(
  "songLength|songFile|title|artistId|album|thumbnail\n",
  "utf8"
);
writeSongsLikes.write("userId|songId|isLiked\n", "utf8");

const writeCSV = (table, writer, encoding, cb) => {
  let i =
    table === "users"
      ? 1000000
      : table === "artists"
      ? 1000000
      : table === "songs" || table === "artistsSongs"
      ? 10000000
      : 5000000;

  let s = 96;
  const artistTotal = 1000000;
  const songTotal = 10000000;
  const userTotal = 1000000;
  const songBias = songTotal * 0.8;
  let userCount = null;
  let currentUserName = null;
  let currentUser = userTotal;
  let artistCount = null;
  let currentArtist = null;

  const getRndBias = (min, max, bias, influence) => {
    const rnd = Math.random() * (max - min) + min;
    const mix = Math.random() * influence;
    return rnd * (1 - mix) + bias * mix;
  };
  const write = () => {
    let ok = true;

    while (i > 0 && ok) {
      let data = [];
      s = s > 0 ? s : 96;

      if (table === "users") {
        const username = faker.internet.userName();
        data.push(username + "\n");
        data = data.join("");
      }

      if (table === "artists") {
        const artistName = faker.name.findName();
        data.push(artistName + "\n");
        data = data.join("");
      }

      if (table === "songs") {
        const artistCount = Math.floor(Math.random() * artistTotal) + 1;
        const song = allSongs[s - 1];
        const songLength = song.song_duration;
        const songFile = song.song_url;
        const title = faker.lorem.words();
        const artistId = artistCount;
        const album = faker.lorem.words();
        const thumbnail = song.song_art_url;

        s--;

        data = [
          songLength,
          songFile,
          title,
          artistId,
          album,
          thumbnail + "\n"
        ].join("|");
      }

      if (table === "songslikes" || table === "usersSongs") {
        userCount = userCount || Math.floor(Math.random() * 5) + 1;
        const songCount = getRndBias(1, songTotal, songBias, 0.8).toFixed();
        currentUser = currentUser > 0 ? currentUser : userTotal;

        const userId = currentUser;
        const songId = songCount;
        const isLiked = 1;

        if (table === "usersSongs") {
          currentUserName = currentUserName || faker.internet.userName();
          const userName = currentUserName;
          data = [userId, songId, isLiked, userName + "\n"].join("|");
        } else {
          data = [userId, songId, isLiked + "\n"].join("|");
        }

        userCount--;

        if (userCount === 0) {
          userCount = null;
          currentUserName = null;
          currentUser--;
        }
      }

      if (table === "artistsSongs") {
        const song = allSongs[s - 1];
        artistCount = artistCount || Math.floor(Math.random() * 10) + 1;
        currentArtist = currentArtist || faker.name.findName();
        // currentArtistId = currentArtistId > 0 ? currentArtistId : artistTotal;

        const artist = currentArtist;
        // const artistId = currentArtistId;
        const songId = i;
        const songTitle = faker.lorem.words();
        const songLength = song.song_duration;
        const album = faker.lorem.words();
        const songFile = song.song_url;
        const thumbnail = song.song_art_url;

        s--;
        artistCount--;

        data = [
          songId,
          album,
          artist,
          songFile,
          songLength,
          songTitle,
          thumbnail + "\n"
        ].join("|");

        if (artistCount === 0) {
          artistCount = null;
          currentArtist = null;
          // currentArtistId--;
        }
      }

      if (i === 1) {
        writer.write(data, encoding, cb);
      } else {
        ok = writer.write(data, encoding);
      }

      i--;
    }
    if (i > 0 && !ok) {
      writer.once("drain", write);
    }
  };

  write();
};

writeCSV("users", writeUsers, "utf-8", () => {
  console.log("finishing!");
  writeUsers.end();
});
writeCSV("artists", writeArtists, "utf-8", () => {
  console.log("finishing!");
  writeArtists.end();
});

writeCSV("songs", writeSongs, "utf-8", () => {
  console.log("finishing!");
  writeSongs.end();
});

writeCSV("songslikes", writeSongsLikes, "utf-8", () => {
  console.log("finishing!");
  writeSongsLikes.end();
});
