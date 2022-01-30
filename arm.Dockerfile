#FROM arm32v7/node:alpine
FROM arm32v7/node:lts-alpine

WORKDIR /usr/src/app

#COPY output.tar ./output.tar
#
#RUN tar -xf ./output.tar

COPY ./package.json .
COPY ./package-lock.json .
COPY ./dist ./dist

RUN npm i --only=prod

#RUN npm run build

CMD [ "node", "./dist/main.js" ]
