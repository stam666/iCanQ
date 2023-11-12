FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install --network-timeout 300000

COPY . .

RUN yarn build

EXPOSE 30043

CMD [ "yarn", "start" ]
