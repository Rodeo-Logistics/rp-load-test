import http from 'k6/http';
import {
  check,
  sleep
} from 'k6';
import {
  print
} from 'graphql/language/printer'

import Authenticate from '../graphql/loginUser.gql'
import EVENT_SEARCH from '../graphql/eventSearch.gql'

const {
  BASE_URL,
  EMAIL,
  PASSWORD
} = process.env;

let headers = {
  'Content-Type': 'application/json',
};

export const options = {
  stages: [{
      duration: '1m',
      target: 100
    }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    {
      duration: '2m',
      target: 100
    }, // stay at 100 users for 10 minutes
    {
      duration: '1m',
      target: 0
    }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

export default () => {
  let loginRes = http.post(BASE_URL, JSON.stringify({
    query: print(Authenticate),
    variables: {
      input: {
        email: EMAIL,
        password: PASSWORD,
      }
    }
  }),{ headers: headers });

  check(loginRes, {
    'logged in successfully': (resp) => {
      return !!resp.json('data.loginUser.token.accessToken');
    },
  });

  let authHeaders = {
    Authorization: `${loginRes.json('data.loginUser.token.tokenType')} ${loginRes.json('data.loginUser.token.accessToken')}`
  };

  let userERAUID = loginRes.json('data.loginUser.user.ERAUID');

  let eventSearchRes = http.post(BASE_URL, JSON.stringify({
    query: print(EVENT_SEARCH),
    variables: {
      input: {
          searchTerm: ["test", "", "zqzwzr"][Math.floor(Math.random() * 3)],
          searchType: "entry",
          ERAUID: userERAUID,
          showOpenEventsOnly: true
      }
    }
  }), {
    headers: {
      ...headers,
      ...authHeaders
    }
  });

  check(eventSearchRes, {
    'searched for an event successfully': (resp) => {
      return !!resp.json('data.eventSearch');
    },
  });

  sleep(1);
};