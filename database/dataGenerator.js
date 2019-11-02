const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const faker = require('faker');

const writeUsers = fs.createWriteStream('usersSql.csv');
const writeArtists = fs.createWriteStream('artistsSql.csv');
const writeSongs = fs.createWriteStream('songsSql.csv');
const writeSongsLikes = fs.createWriteStream('songsLikesSql.csv');

writeUsers.write('userId, userName\n', 'utf8');
writeArtists.write('artistId,artistName\n', 'utf8');
writeSongs.write(
  'songId,songLength,songFile,title,artistId,album,thumbnail\n',
  'utf8'
);
writeSongsLikes.write('songsLikedId,userId,songId,isLiked\n', 'utf8');

const writeCSV = (writer, encoding, cb) => {
  let i = 10;

  const write = () => {
    let ok = true;
    while (i > 0 && ok) {
      let data = ['\n'];
      const username = faker.internet.userName();
      data.push(username + '\n');
      data = data.join(',');
      if (i === 9) {
        writer.write(data, encoding, cb);
      } else {
        ok = writer.write(data, encoding);
      }
      i--;
    }

    if (i > 0) {
      writer.once('drain', write);
    }
  };

  write();
};

writeCSV(writeUsers, 'utf-8', () => {
  writeUsers.end();
});

// fs.writeFile('data.js', json, 'utf8', (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('success write');
//   }
// });
