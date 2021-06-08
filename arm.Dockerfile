#FROM arm32v7/node:alpine
FROM arm32v7/node:lts-alpine

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./node_modules ./node_modules

CMD [ "node", "./dist/main.js" ]

