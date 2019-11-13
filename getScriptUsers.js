import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';

let baseURL = 'http://localhost:3020';

export let getErrorRate = new Rate('Get errors');

export let options = {
  vus: 200,
  rps: 1200,
  duration: '5m'
};

// const getRndBias = (min, max, bias, influence) => {
//   const rnd = Math.random() * (max - min) + min;
//   const mix = Math.random() * influence;
//   return rnd * (1 - mix) + bias * mix;
// };

export default function() {
  let songId = Math.floor(Math.random() * (10000000 - 9999000 + 1)) + 9999000;

  let userId = Math.floor(Math.random() * (1000000 - 999900 + 1)) + 999900;

  let getSongUserURl = `${baseURL}/playbar/song?songId=${songId}&userId=${userId}`;

  let res = http.get(getSongUserURl);
  check(res, {
    'status was 200': res => res.status === 200,
    'has results': res => JSON.parse(res.body)[0].songid !== 'undefined'
  }) || getErrorRate.add(1);
}
