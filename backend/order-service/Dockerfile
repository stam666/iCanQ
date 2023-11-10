FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8004

CMD [ "yarn", "start" ]
