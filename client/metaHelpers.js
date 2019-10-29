import axios from 'axios';

const metaHelpers = {
  // Current Player song will always be the first song in the next up playlist
  mount() {
    const id = window.location.href.split('/')[4];
    axios
      .get(`http://localhost:3020/playlist/songs`)
      .then(results => {
        // 1) Get all the songs as the default playlist
        const songs = results.data;
        console.log(results.data);
        // 2) Splice out first song and push to upNext playlist
        const upNext = [];
        upNext.push(songs.shift());
        // 3) When setting state, make a songFile out of upNext[0]
        // 4) Set state: songs, upNext, songFile
        return this.setState({
          songs,
          upNext,
          songFile: new Audio(upNext[0].songFile)
        });
      })
      .catch(err => console.log('mount err: ', err));
  },
  tick(songfile) {
    const { songs, upNext, repeat, songFile } = this.state;
    // If the song has ended
    //   1) clear the interval,
    //   2) repeat song if necessary,
    //   3) call next if possible,
    //   4) if repeating all AND at the end, restart with previousPlays
    const isEnded = songFile.ended;
    if (isEnded) {
      clearInterval(this.timestampID);
      if (repeat === 'Song') {
        songFile.currentTime = 0;
        this.setState({ timestamp: 0 });
      } else if (songs.length > 0 || upNext.length > 0) {
        this.next();
      } else if (repeat === 'List') {
        // mount makes a request for the songList, and resets state for songs, upNext, and songFile
        this.mount();
      }
    } else {
      // Tick is called each second when playing,
      //   storing the currentTime property from the Audio element
      this.setState({ timestamp: songFile.currentTime });
    }
  },
  shuffle() {
    const { shuffle } = this.state;
    let newStatus;
    //  check shuffle state and rotate between '' and '-alt', where '' references the default classname
    if (shuffle === '') {
      newStatus = '-alt';
    } else {
      newStatus = '';
    }
    this.setState({ shuffle: newStatus });
  },
  repeat() {
    const { repeat } = this.state;
    let newStatus;
    //  check repeat state and rotate between: '' to 'List' to 'Song' back to ''
    if (repeat === '') {
      newStatus = 'List';
    } else if (repeat === 'List') {
      newStatus = 'Song';
    } else {
      newStatus = '';
    }
    this.setState({ repeat: newStatus });
  },
  like(songId, isLiked) {
    const { upNext } = this.state;
    //  Post to the "/like:songId" route to toggle like status
    axios
      .post(`http://localhost:3020/like/${songId}`, { isliked: isLiked })
      .then(() => axios.get('http://localhost:3020/songs'))
      .then(results => {
        const songs = results.data;
        // if songId is current player song, toggle isliked to re-render "like" status
        if (songId === upNext[0].songId) {
          const likeStatus = upNext[0].isliked;
          upNext[0].isliked = likeStatus ? 0 : 1;
        }
        return this.setState({ upNext, songs: results.data });
      })
      .catch(err => console.log('like err', err));
  }
  //  *IF TIME REFACTOR:
  //  *Get nextUp songIds, use Promise.each to:
  //    *use '/songs/:id' to get the song obj
  //    *then push result to upNext arr
  //    *When all promises complete: setState with upNext
  //  *Do the same for previousPlays^
};

export default metaHelpers;
