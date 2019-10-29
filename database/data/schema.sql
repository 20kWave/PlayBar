DROP DATABASE IF EXISTS soundCloutPlayer;

CREATE DATABASE soundCloutPlayer;

USE soundCloutPlayer;

CREATE TABLE songs (
  id INT NOT NULL AUTO_INCREMENT,
  songId INT NOT NULL,
  length INT NOT NULL,
  timestamp INT DEFAULT 0,
  isliked TINYINT DEFAULT 0,
  songFile VARCHAR(150),
  title VARCHAR(150),
  artist VARCHAR(60),
  album VARCHAR(60),
  thumbnail VARCHAR(150),
  PRIMARY KEY (id)
);