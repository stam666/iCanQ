FROM node:alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
