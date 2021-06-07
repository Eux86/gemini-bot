FROM arm32v7/node:alpine

WORKDIR /usr/src/app

COPY ./dist/ .
ADD ./node_modules.tar.gz .

CMD [ "node", "main.js" ]
