import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';

let baseURL = 'http://localhost:3020';

export let postErrorRate = new Rate('Post errors');

export let options = {
  vus: 200,
  rps: 1200,
  duration: '5m'
};

export default function() {
  let songId = Math.floor(Math.random() * 10000000) + 1;
  let userId = Math.floor(Math.random() * 1000000) + 1;

  let postURL = `${baseURL}/like?songId=${songId}&userId=${userId}`;

  let res = http.post(postURL);
  check(res, {
    'status was 200': res => res.status == 200
  }) || postErrorRate.add(1);
}
