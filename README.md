### RP API Load Testing
Assess the performance of RP API in terms of concurrent users or requests per second.

### Tools
- [k6](https://k6.io/docs): load testing framework
- [easygraphql-load-tester](https://github.com/EasyGraphQL/easygraphql-load-tester): graphql abstraction tool for k6

### Setup
```sh
brew install k6
npm i
```

### Run
```sh
# Run the login and event search load test
npm run bundle && k6 run dist/login.bundle.js
```

### Troubleshooting
  >Error: `context deadline exceeded`
  >
  >https://k6.io/docs/misc/fine-tuning-os/
