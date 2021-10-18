import Bot from './bot';

require('dotenv').config();

// eslint-disable-next-line no-new
new Bot().start()
  .then(() => console.log('started'))
  .catch((e) => console.error(e));
