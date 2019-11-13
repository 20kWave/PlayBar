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

export default function() {
  let songId = Math.floor(Math.random() * (10000000 - 9999000 + 1)) + 9999000;

  let getSongUrl = `${baseURL}/playbar/song?songId=${songId}`;

  let res = http.get(getSongUrl);
  check(res, {
    'status was 200': res => res.status == 200,
    'has results': res => JSON.parse(res.body)[0].songid !== 'undefined'
  }) || getErrorRate.add(1);
}
