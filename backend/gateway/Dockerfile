FROM node:18

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --network-timeout 300000

COPY . /app
RUN yarn build

EXPOSE 8000
CMD [ "yarn", "start" ]
