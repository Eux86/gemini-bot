import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import { sayNotHere } from './common/common';

function getRandomInt(max: number): number {
  const part = Math.random() * max;
  return Math.floor(part);
}

const disappointedMessages = [
  '¬_¬',
  'Bene. Ok.',
  '(┛ಠ_ಠ)┛彡┻━┻',
  '...ok',
  '💔',
  '¯\\_(ツ)_/¯',
];

const passiveAggressiveAnswerOneIn = 6;

export const notHere: PrefixCommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();

  sayNotHere(
    rollcallService,
    discordMessage.author.username,
    discordMessage.channel,
  );

  const random = getRandomInt(passiveAggressiveAnswerOneIn - 1);
  if (random > 0) {
    await discordMessage.delete();
  } else {
    const randomMessageIndex = getRandomInt(disappointedMessages.length - 1);
    await discordMessage.reply(disappointedMessages[randomMessageIndex]);
  }
};
