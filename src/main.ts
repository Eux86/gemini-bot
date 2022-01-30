import Bot from './bot';
import { enabledBundles } from './enabled-commands';

require('dotenv').config();

// eslint-disable-next-line no-new
new Bot(enabledBundles)
  .start()
  .then(() => console.log('started'))
  .catch((e) => console.error(e));
