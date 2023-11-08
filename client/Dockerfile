FROM node:latest

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install --network-timeout 100000

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
