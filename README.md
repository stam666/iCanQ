# iCanQ :exclamation:

## Run backend in /backend

- Run docker-compse for rabbitmq
  localhost:15672 user:guest pass:guest
  ```
  docker-compose up
  ```
- Run command for dev
  ```
  yarn start:dev
  yarn grpc:dev
  yarn users:dev
  yarn restaurants:dev
  yarn menus:dev
  yarn orders:dev
  ```
- Run command for prod
  ```
  yarn build
  yarn start
  yarn grpc
  yarn users
  yarn restaurants
  yarn menus
  yarn orders
  ```

## Run client in /client

- Run command for dev
  ```
  yarn dev
  ```

## Run K6

- Run packed with iCanQ : i.e. **[some_url_path]** = hostIp:8000/restaurants
  ```
  > docker-compose up
  > [start all services or just tested service]
  > docker-compose run k6 run -e PUBLIC_IP=[some_url_path] /tests/load_test.js
  ```
  - Grafana can be opened at port 3001
- Run only load-test : cd into loadtest.tests folder then run the same command
  - Grafana can be opened at port 3000
