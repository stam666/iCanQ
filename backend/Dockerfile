FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install --network-timeout 100000

COPY . .

EXPOSE 8000

CMD [ "yarn", "start" ]
