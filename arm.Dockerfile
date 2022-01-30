#FROM arm32v7/node:alpine
FROM arm32v7/node:lts-alpine

WORKDIR /usr/src/app

COPY output.tar ./output.tar

RUN tar -xf ./output.tar

CMD [ "node", "./dist/main.js" ]
