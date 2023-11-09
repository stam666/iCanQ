FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8000
ENV NODE_ENV=production
ENV HOST=localhost
ENV PORT=8000
ENV JWT_SECRET=pttwpttw
ENV JWT_EXPIRE=86400
ENV MONGO_URL=mongodb+srv://admin:SajA7iAFs2rn8LBt@cluster0.pfytphq.mongodb.net/ICANQ?retryWrites=true&w=majority
ENV DATABASE_HOST=aws.connect.psdb.cloud
ENV DATABASE_USERNAME=1l8jhqv6aa81w2saj0m9
ENV DATABASE_PASSWORD=pscale_pw_Im58apEXDat801LPKEE4MPBHr8fljNmSkdvGWzX9QSP
ENV MQ_HOST=localhost
ENV GRPC_HOST=localhost
ENV USER_SERVICE_PORT=8001
ENV USER_SERVICE_URI=http://localhost:8001
ENV RESTAURANT_SERVICE_PORT=8002
ENV RESTAURANT_SERVICE_URI=http://localhost:8002
ENV MENU_SERVICE_PORT=8003
ENV MENU_SERVICE_URI=http://localhost:8003
ENV ORDER_SERVICE_PORT=8004
ENV ORDER_SERVICE_URI=http://localhost:8004
ENV REVIEW_SERVICE_PORT=8005
ENV REVIEW_SERVICE_URI=http://localhost:8005

CMD [ "yarn", "start" ]
