FROM node

WORKDIR /usr/src/app

COPY output.tar ./output.tar

RUN tar -xf ./output.tar

CMD [ "node", "./dist/main.js" ]
