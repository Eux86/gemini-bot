import Bot from './bot';
import { enabledBundles } from './enabled-commands';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function start() {
  try {
    console.log('starting...');
    await new Bot(enabledBundles).start();
    console.log('started');
  } catch (e) {
    console.error('Uncaught exception', e);
  }
}

start();
