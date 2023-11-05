# iCanQ

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
  ```
  
- Run command for prod
  ```
  yarn build
  yarn start
  yarn grpc
  ```
## Run client in /client
- Run command for dev
  ```
  yarn start
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
