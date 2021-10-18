FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./package.json .

RUN npm i
RUN npm run build
RUN npm run start

WORKDIR /usr/src/dist

CMD [ "node", "./dist/main.js" ]
