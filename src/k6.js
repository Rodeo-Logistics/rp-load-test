import http from 'k6/http'

const queries = JSON.parse(open('./easygraphql-load-tester-queries.json'))

export default function () {
  for (const query of queries) {
    const url = 'http://localhost:5000/graphql'
    const payload = JSON.stringify({
      query: query.query,
      variables: query.variables,
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    http.post(url, payload, params)
  }
}