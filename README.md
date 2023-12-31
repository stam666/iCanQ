﻿# iCanQ

## :exclamation: **Migrate to microservice announcement**

Since we have migrated each service to be a microservice, we have separated package.json for each service in order to reduce coupling and make each service independent.

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
  yarn reviews:dev
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
  yarn reviews
  ```

## Run client in /client

- Run command for dev
  ```
  yarn dev
  ```

## **For anyone who get import error things**

Please try add <mark>tsconfig.json</mark> in backend folder

**Sample**

    {"version": "5.2.2",
    "compilerOptions": {
        "skipLibCheck": true,
        "target": "es6",
        "module": "commonjs",
        "moduleResolution": "node",
        "allowJs": true,
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "outDir": "./build",
        "rootDir": "src"
        },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
    }
