/**
 * This is the EasyGraphQL Load test. A simplified test that is less configurable,
 * but quicker to write.
 */

const path = require('path');
const EasyGraphQLLoadTester = require('easygraphql-load-tester');
const {
  fileLoader
} = require('merge-graphql-schemas');
const {
  importSchema
} = require('graphql-import');

const {
  BASE_URL,
  EMAIL,
  PASSWORD
} = process.env;

const schema = importSchema(path.join(__dirname, 'schema', 'schema.graphql'), 'utf8');
const queries = fileLoader(path.join(__dirname, './graphql'));

const args = {
  loginUser: {
    input: {
      email: EMAIL,
      password: PASSWORD
    }
  },
  eventSearch: {
    input: {
      searchTerm: "test",
      searchType: "entry",
      ERAUID: "37757",
      showOpenEventsOnly: true
    }
  }
}

const loadTester = new EasyGraphQLLoadTester(schema, args);

loadTester.k6('k6.js', {
  customQueries: queries,
  selectedQueries: ['loginUser, eventSearch'],
  vus: 10,
  duration: '10s',
  queryFile: true,
  withMutations: true,
  out: ['json=test_result.json'],
});
