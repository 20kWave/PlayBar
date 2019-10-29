const schema = require('../database/data/schemaHelpers');

module.exports = {
  getSong: (req, res) => {
    schema
      .songGetterAsync(req.params.id)
      .then(results => res.status(200).send(results))
      .catch(err => res.status(404).send(err));
  },
  getPlaylist: (req, res) => {
    schema
      .playlistGetterAsync(req.params.playlist)
      .then(results => res.status(200).send(results))
      .catch(err => res.status(404).send(err));
  },
  likeEntry: (req, res) => {
    schema
      .likeUpdaterAsync(req.params.songId, req.body.isliked)
      .then(results => res.status(200).send(results))
      .catch(err => res.status(404).send(err));
  },
  playlistEntry: (req, res) => {
    schema
      .playlistSaverAsync(req.body.id, req.params.playlist)
      .then(results => res.status(201).send(results))
      .catch(err => res.status(400).send(err));
  }
};
