DROP DATABASE IF EXISTS wave;

CREATE DATABASE wave;

\c wave;

CREATE TABLE users (
  userId SERIAL NOT NULL,
  userName VARCHAR(100),
  PRIMARY KEY (userId)
);

CREATE TABLE artists (
  artistId SERIAL NOT NULL,
  artistName VARCHAR(100),
  PRIMARY KEY (artistId)
);

CREATE TABLE songs (
  songId SERIAL NOT NULL,
  songLength SMALLINT NOT NULL,
  songFile VARCHAR(150),
  title VARCHAR(150),
  artistId INTEGER REFERENCES artists(artistId) ON DELETE CASCADE,
  album VARCHAR(60),
  thumbnail VARCHAR(150),
  PRIMARY KEY (songId)
);

CREATE INDEX idx_artistId ON songs(artistId);

CREATE TABLE songsLikes (
  songsLikedId SERIAL NOT NULL,
  userId INTEGER REFERENCES users(userId) ON DELETE CASCADE,
  songId INTEGER REFERENCES songs(songId) ON DELETE CASCADE, 
  isLiked BOOLEAN,
  PRIMARY KEY (songsLikedId)
);

CREATE INDEX idx_usersId ON songsLikes(userId);
CREATE INDEX idx_songId ON songsLikes(songId);