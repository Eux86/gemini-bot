import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import {
  getOrCreateTodayRollcall,
  updateExistingRollcall,
} from './common/common';
import { RollcallUserAlreadyNotRegisteredException } from '../services/errors';
import { Message } from 'discord.js';

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

const sendPassiveAggresiveMessageAndDelete = async (
  discordMessage: Message,
) => {
  const random = getRandomInt(passiveAggressiveAnswerOneIn - 1);
  if (random > 0) {
    await discordMessage.delete();
  } else {
    const randomMessageIndex = getRandomInt(disappointedMessages.length - 1);
    await discordMessage.reply(disappointedMessages[randomMessageIndex]);
  }
};

export const notHere: PrefixCommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();

  if (!discordMessage.channel) {
    await discordMessage.reply('Something went wrong');
    console.error('Could not read the channel');
    return;
  }
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      discordMessage.channel,
      rollcallService,
    );
    await rollcallService.removeParticipant(
      todayRollcall,
      discordMessage.author.username,
    );
    await updateExistingRollcall(discordMessage, todayRollcall);
    await sendPassiveAggresiveMessageAndDelete(discordMessage);
  } catch (e) {
    if (e instanceof RollcallUserAlreadyNotRegisteredException) {
      await discordMessage.reply({
        content: "You are not registered in today's rollcall",
      });
    } else if (e === 'Missing Permissions') {
      await discordMessage.reply({
        content:
          'I cannot delete messages. Please give me the right permission',
      });
    } else {
      console.error(e);
      await discordMessage.reply({
        content: 'Something went wrong :/',
      });
    }
  }
};
