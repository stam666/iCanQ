FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8001
CMD [ "node", "dist/start.js" ]
