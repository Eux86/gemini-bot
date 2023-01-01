import { RollcallService } from '../services/rollcall-service';
import { CommandHandler } from '../../../types/command-handler';
import { getOrCreateTodayRollcall } from './common/create-roll-call';

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

export const notHere: CommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      discordMessage.channel,
      rollcallService,
    );
    await rollcallService.removeParticipant(
      todayRollcall,
      discordMessage.author.username,
    );
    if (todayRollcall.messageId) {
      const rollcallMessage = await discordMessage.channel.messages.fetch(
        todayRollcall.messageId,
      );
      await rollcallMessage.edit(
        rollcallService.generateMessageContent(todayRollcall),
      );
    }
    const random = getRandomInt(passiveAggressiveAnswerOneIn - 1);
    if (random > 0) {
      await discordMessage.delete();
    } else {
      const randomMessageIndex = getRandomInt(disappointedMessages.length - 1);
      await discordMessage.reply(disappointedMessages[randomMessageIndex]);
    }
  } catch (e) {
    switch ((e as Error).message || e) {
      case 'ALREADY_NOT_REGISTERED':
        await discordMessage.channel.send(
          "You are not registered in today's rollcall",
        );
        break;
      case 'Missing Permissions':
        await discordMessage.channel.send(
          'I cannot delete messages. Please give me the right permission',
        );
        break;
      default:
        await discordMessage.channel.send(`Something went wrong :/\n${e}`);
    }
  }
};
