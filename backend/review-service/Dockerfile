FROM node:18

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app
RUN yarn build

EXPOSE 8005
CMD [ "yarn", "start" ]
