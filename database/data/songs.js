const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname + '/20kwavePlaybarSongs.csv');

csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('songs.json', json, 'utf8');
  });
