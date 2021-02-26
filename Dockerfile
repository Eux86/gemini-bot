FROM node:alpine

WORKDIR /usr/src/app

COPY ./dist/ .
COPY ./node_modules/ node_modules/

CMD [ "node", "main.js" ]
