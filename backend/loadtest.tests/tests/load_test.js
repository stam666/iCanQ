import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: "3m", target: 60 },
    { duration: "4m", target: 60 },
    { duration: "3m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default () => {
  let response = http.get(`http://${__ENV.PUBLIC_IP}`);
  check(response, { "status was 200": (r) => r.status == 200 });
  sleep(1);
};
