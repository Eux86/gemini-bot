FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ./package-lock.json .
COPY ./tsconfig.json .
COPY ./src .

RUN npm i
RUN npm run build
RUN npm run start

WORKDIR /usr/src/dist

#CMD [ "node", "main.js" ]
CMD ["/bin/sh"]
