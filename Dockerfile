FROM node:17.9.1-alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY ./package.json ./

USER node

RUN npm install --ignore-engines

COPY . .

COPY --chown=node:node . .

EXPOSE ${PORT}